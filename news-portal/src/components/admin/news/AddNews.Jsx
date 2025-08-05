import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { imgServer, server } from '../../../api/server';
import {
    FiSave,
    FiArrowLeft,
    FiFileText,
    FiUser,
    FiTag,
    FiImage,
    FiGlobe,
    FiEye,
    FiUpload,
    FiX,
    FiPlus,
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
    FiLink,
    FiType,
    FiFolder,
    FiCheck
} from 'react-icons/fi';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import FormButton from '../../common/FormButton';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import { RichTextEditor } from './RichTextEditor';
import { ImageGalleryModal } from './ImageGalleryModal';
import NewsPreview from './NewsPreview';

const AddNews = () => {
    const [serverError, setServerError] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('en');
    const [seoKeywords, setSeoKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [showCoverGallery, setShowCoverGallery] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch categories and authors
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetch('/api/categories').then(res => res.json())
    });

    const { data: authors = [] } = useQuery({
        queryKey: ['authors'],
        queryFn: () => fetch('/api/users?role=author').then(res => res.json())
    });

    const validationSchema = Yup.object({
        title_en: Yup.string().required('English title is required'),
        title_np: Yup.string().required('Nepali title is required'),
        slug: Yup.string().required('Slug is required'),
        content_en: Yup.string().required('English content is required'),
        content_np: Yup.string().required('Nepali content is required'),
        categoryId: Yup.number().required('Category is required'),
        authorId: Yup.number().required('Author is required'),
        publishedAt: Yup.date().required('Publish date is required')
    });

    const createNewsMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetch('/api/articles', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to create article');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article created successfully!');
            navigate('/admin/news/manage');
        },
        onError: (error) => {
            setServerError(error.message);
            toast.error(error.message || 'Failed to create article');
        }
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setCoverImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCoverImageSelect = (image) => {
        const imageUrl = image.url || `${imgServer}${image.imageUrl}`;
        setCoverImagePreview(imageUrl);
        setCoverImage(imageUrl); // Store URL instead of file for gallery images
        setShowCoverGallery(false);
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
            setSeoKeywords([...seoKeywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword) => {
        setSeoKeywords(seoKeywords.filter(k => k !== keyword));
    };

    const initialValues = {
        title_en: '',
        title_np: '',
        slug: '',
        content_en: '',
        content_np: '',
        categoryId: '',
        authorId: '',
        publishedAt: new Date().toISOString().slice(0, 16)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate('/admin/news/manage')}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="mr-2" size={16} />
                            Back to News
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiFileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Add New Article</h1>
                                    <p className="text-gray-600 mt-1">Create and publish a new news article with rich content</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="text-sm font-medium text-orange-600">Draft</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <FiFileText className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        const formData = new FormData();
                        Object.keys(values).forEach(key => {
                            formData.append(key, values[key]);
                        });
                        if (coverImage) {
                            if (typeof coverImage === 'string') {
                                formData.append('coverImageUrl', coverImage);
                            } else {
                                formData.append('coverImage', coverImage);
                            }
                        }
                        formData.append('seoKeywords', JSON.stringify(seoKeywords));
                        createNewsMutation.mutate(formData);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form className="space-y-8">
                            {/* Basic Information */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiFileText className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Language Toggle */}
                                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setActiveLanguage('en')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeLanguage === 'en'
                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <FiGlobe className="w-4 h-4 inline mr-1" />
                                            English
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveLanguage('np')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeLanguage === 'np'
                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            नेपाली
                                        </button>
                                    </div>

                                    {/* Title Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput
                                            label="Title (English)"
                                            id="title_en"
                                            name="title_en"
                                            value={values.title_en}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (!values.slug) {
                                                    setFieldValue('slug', generateSlug(e.target.value));
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            error={touched.title_en && errors.title_en}
                                            placeholder="Enter article title in English"
                                            className={activeLanguage === 'en' ? 'ring-2 ring-indigo-200' : ''}
                                        />

                                        <FormInput
                                            label="Title (नेपाली)"
                                            id="title_np"
                                            name="title_np"
                                            value={values.title_np}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.title_np && errors.title_np}
                                            placeholder="नेपालीमा शीर्षक लेख्नुहोस्"
                                            className={activeLanguage === 'np' ? 'ring-2 ring-indigo-200' : ''}
                                        />
                                    </div>

                                    <FormInput
                                        label="URL Slug"
                                        id="slug"
                                        name="slug"
                                        value={values.slug}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.slug && errors.slug}
                                        placeholder="article-url-slug"
                                        helperText="This will be used in the article URL"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormSelect
                                            label="Category"
                                            id="categoryId"
                                            name="categoryId"
                                            value={values.categoryId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.categoryId && errors.categoryId}
                                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                            icon={FiTag}
                                        />

                                        <FormSelect
                                            label="Author"
                                            id="authorId"
                                            name="authorId"
                                            value={values.authorId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.authorId && errors.authorId}
                                            options={authors.map(author => ({ value: author.id, label: author.username }))}
                                            icon={FiUser}
                                        />

                                        <FormInput
                                            label="Publish Date"
                                            id="publishedAt"
                                            name="publishedAt"
                                            type="datetime-local"
                                            value={values.publishedAt}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.publishedAt && errors.publishedAt}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiImage className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Cover Image</h2>
                                </div>

                                <div className="space-y-4">
                                    {coverImagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={coverImagePreview}
                                                alt="Cover preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCoverImage(null);
                                                    setCoverImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                                            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Upload cover image</p>
                                            <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                                            <div className="flex justify-center space-x-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="coverImage"
                                                />
                                                <label
                                                    htmlFor="coverImage"
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                                                >
                                                    <FiUpload className="w-4 h-4 mr-2" />
                                                    Upload New
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCoverGallery(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <FiFolder className="w-4 h-4 mr-2" />
                                                    Choose from Gallery
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiFileText className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Article Content</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Content ({activeLanguage === 'en' ? 'English' : 'नेपाली'})
                                        </label>
                                        <RichTextEditor
                                            value={activeLanguage === 'en' ? values.content_en : values.content_np}
                                            onChange={(content) => {
                                                setFieldValue(activeLanguage === 'en' ? 'content_en' : 'content_np', content);
                                            }}
                                            placeholder={`Write your article content in ${activeLanguage === 'en' ? 'English' : 'Nepali'}...`}
                                        />
                                        {touched[`content_${activeLanguage}`] && errors[`content_${activeLanguage}`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`content_${activeLanguage}`]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SEO Keywords */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiTag className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">SEO Keywords</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                            placeholder="Add SEO keyword"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addKeyword}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {seoKeywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                            >
                                                {keyword}
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyword(keyword)}
                                                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(true)}
                                            className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            <FiEye className="w-4 h-4 mr-2" />
                                            Preview Article
                                        </button>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/news/manage')}
                                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <FormButton
                                            type="submit"
                                            disabled={createNewsMutation.isLoading}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center transition-colors"
                                        >
                                            <FiSave className="mr-2" size={18} />
                                            {createNewsMutation.isLoading ? 'Publishing...' : 'Publish Article'}
                                        </FormButton>
                                    </div>
                                </div>
                            </div>

                            {serverError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600">{serverError}</p>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                {/* Cover Image Gallery Modal */}
                <ImageGalleryModal
                    isOpen={showCoverGallery}
                    onClose={() => setShowCoverGallery(false)}
                    onSelectImage={handleCoverImageSelect}
                />

                {/* News Preview Modal */}
                {showPreview && (
                    <NewsPreview
                        isOpen={showPreview}
                        onClose={() => setShowPreview(false)}
                        articleData={{
                            ...initialValues,
                            coverImagePreview,
                            seoKeywords
                        }}
                        activeLanguage={activeLanguage}
                    />
                )}
            </div>
        </div>
    );
};

export default AddNews;
