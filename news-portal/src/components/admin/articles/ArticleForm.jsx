import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FiSave, FiX, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { 
  createArticle, 
  updateArticle, 
  generateSlug, 
  formatArticleForApi, 
  validateArticleData 
} from '../../../api/article-services';
import { getAllUsers } from '../../../api/user-services';
import { getAllImages } from '../../../api/images-service';
import ImageGalleryModal from '../news/ImageGalleryModal';

const ArticleForm = ({ article, onSave, onCancel }) => {
  const isEditing = !!article;
  
  const [formData, setFormData] = useState({
    languageCode: 'en',
    title: '',
    slug: '',
    content: '',
    summary: '',
    status: 'draft',
    publicationDatetime: '',
    allowComments: true,
    coverImageId: null,
    authorId: '',
    reporterId: null,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [errors, setErrors] = useState({});
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  // Fetch users for author/reporter selection
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers({ pageSize: 100 })
  });

  // Fetch images for cover image selection
  const { data: imagesData } = useQuery({
    queryKey: ['images'],
    queryFn: getAllImages
  });

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      onSave(data);
    },
    onError: (error) => {
      console.error('Error creating article:', error);
      setErrors({ submit: error.message || 'Failed to create article' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateArticle(id, data),
    onSuccess: (data) => {
      onSave(data);
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      setErrors({ submit: error.message || 'Failed to update article' });
    }
  });

  // Initialize form data when editing
  useEffect(() => {
    if (article) {
      setFormData({
        languageCode: article.languageCode || 'en',
        title: article.title || '',
        slug: article.slug || '',
        content: article.content || '',
        summary: article.summary || '',
        status: article.status || 'draft',
        publicationDatetime: article.publicationDatetime 
          ? new Date(article.publicationDatetime).toISOString().slice(0, 16)
          : '',
        allowComments: article.allowComments !== undefined ? article.allowComments : true,
        coverImageId: article.coverImageId || null,
        authorId: article.authorId || '',
        reporterId: article.reporterId || null,
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || '',
      });
      
      // Show SEO fields if any SEO data exists
      if (article.seoTitle || article.seoDescription || article.seoKeywords) {
        setShowSeoFields(true);
      }
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGenerateSlug = async () => {
    if (!formData.title.trim()) {
      setErrors(prev => ({ ...prev, slug: 'Title is required to generate slug' }));
      return;
    }

    setIsGeneratingSlug(true);
    try {
      const response = await generateSlug(formData.title, article?.id);
      setFormData(prev => ({ ...prev, slug: response.slug }));
      setErrors(prev => ({ ...prev, slug: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, slug: 'Failed to generate slug' }));
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleImageSelect = (image) => {
    setFormData(prev => ({ ...prev, coverImageId: image.id }));
    setShowImageGallery(false);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImageId: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = validateArticleData(formData);
    if (!validation.isValid) {
      const fieldErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Title')) fieldErrors.title = error;
        else if (error.includes('Language')) fieldErrors.languageCode = error;
        else if (error.includes('Author')) fieldErrors.authorId = error;
        else if (error.includes('SEO title')) fieldErrors.seoTitle = error;
        else if (error.includes('SEO description')) fieldErrors.seoDescription = error;
        else fieldErrors.general = error;
      });
      setErrors(fieldErrors);
      return;
    }

    // Format data for API
    const apiData = formatArticleForApi({
      ...formData,
      publicationDatetime: formData.publicationDatetime 
        ? new Date(formData.publicationDatetime).toISOString()
        : null,
      authorId: parseInt(formData.authorId),
      reporterId: formData.reporterId ? parseInt(formData.reporterId) : null,
      coverImageId: formData.coverImageId ? parseInt(formData.coverImageId) : null,
    });

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: article.id, data: { ...apiData, id: article.id } });
      } else {
        await createMutation.mutateAsync(apiData);
      }
    } catch (error) {
      // Error handling is done in mutation onError
    }
  };

  const users = usersData?.items || [];
  const images = imagesData || [];
  const selectedImage = images.find(img => img.id === formData.coverImageId);

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language *
              </label>
              <select
                name="languageCode"
                value={formData.languageCode}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.languageCode ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="en">English</option>
                <option value="np">Nepali</option>
              </select>
              {errors.languageCode && (
                <p className="mt-1 text-sm text-red-600">{errors.languageCode}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter article title"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="article-slug"
                required
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                disabled={isGeneratingSlug || !formData.title.trim()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingSlug ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief summary of the article"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your article content here..."
            />
          </div>
