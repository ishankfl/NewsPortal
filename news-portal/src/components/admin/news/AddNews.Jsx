import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { imgServer, server } from '../../../api/server';
import { getCategories } from '../../../api/category-services';
import { getUsers } from '../../../api/user-services';
import {
    FiSave,
    FiArrowLeft,
    FiFileText,
    FiImage,
    FiEye,
    FiUpload,
    FiX,
    FiFolder,
    FiSearch,
    FiMessageCircle

} from 'react-icons/fi';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { ImageGalleryModal } from './ImageGalleryModal';
import NewsPreview from './NewsPreview';
import SeoKeywords from './SEOKeywords';
import { NewsContenxt } from './NewsContents';
import { BasicInformation } from './BasicInformation';
import { createArticleWithFormData } from '../../../api/news-services';

const AddNews = () => {
    const [serverError, setServerError] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('en');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [seoKeywords, setSeoKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    const [showCoverGallery, setShowCoverGallery] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentFormValues, setCurrentFormValues] = useState(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch categories and authors
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const { data: usersData } = useQuery({
        queryKey: ['users', { page: 1, pageSize: 100, search: '' }],
        queryFn: getUsers
    });

    const authors = usersData?.items || [];

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        slug: Yup.string().required('Slug is required'),
        content: Yup.string().required('Content is required'),
        authorId: Yup.string().required('Author is required'),
        publishedAt: Yup.string().required('Publish date is required')
    });

    const createNewsMutation = useMutation({
        mutationFn: createArticleWithFormData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article created successfully!');
            navigate('/admin/news/manage');
        },
        onError: (error) => {
            console.error('Create news error:', error);
            setServerError(error.message || 'Failed to create article');
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
        const imageUrl = `${imgServer}${image.imageUrl}`;
        setCoverImagePreview(imageUrl);
        console.log("Image is selected...... ")
        console.log(image);
        setCoverImage(image.id); // Store URL instead of file for gallery images
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
        title: '',
        slug: '',
        content: '',
        categoryIds: [],
        authorId: '',
        publishedAt: new Date().toISOString().slice(0, 16)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
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

                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    console.log('🚀 Form submission started');
                                    console.log('📝 Form values:', values);
                                    console.log('🏷️ Selected categories:', selectedCategories);

                                    const formData = new FormData();

                                    // Map to API expected field names
                                    formData.append('Title', values.title || '');
                                    formData.append('Content', values.content || '');
                                    formData.append('LanguageCode', 'en');
                                    formData.append('Summary', values.content ? values.content.substring(0, 200) : '');
                                    formData.append('Slug', values.slug || '');
                                    formData.append('AuthorId', values.authorId || '');
                                    formData.append('PublicationDatetime', values.publishedAt || '');
                                    formData.append('Status', 'draft');
                                    formData.append('AllowComments', allowComments.toString());

                                    // Add cover image
                                    if (coverImage) {

                                        if (typeof coverImage === 'string') {
                                            formData.append('CoverImageUrl', coverImage);
                                        } else {
                                            formData.append('CoverImage', coverImage);
                                        }
                                    }

                                    // Add additional data
                                    formData.append('CategoryIds', JSON.stringify(selectedCategories));
                                    formData.append('SeoKeywords', JSON.stringify(seoKeywords));
                                    formData.append('SeoTitle', seoTitle || '');
                                    formData.append('SeoDescription', seoDescription || '');

                                    console.log('📡 Calling API...');
                                    console.log('📦 FormData contents:');
                                    for (let [key, value] of formData.entries()) {
                                        console.log(`  ${key}:`, value);
                                    }

                                    const result = await createNewsMutation.mutateAsync(formData);
                                    console.log('✅ API call successful:', result);

                                } catch (error) {
                                    console.error('❌ Submission error:', error);
                                    console.error('❌ Error details:', error.response?.data || error.message);
                                } finally {
                                    console.log('🏁 Form submission completed');
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
                                // Update current form values for preview
                                React.useEffect(() => {
                                    setCurrentFormValues(values);
                                }, [values]);

                                return (
                                    <Form className="space-y-8">
                                        <BasicInformation
                                            activeLanguage={activeLanguage}
                                            values={values}
                                            errors={errors}
                                            touched={touched}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            setFieldValue={setFieldValue}
                                            categories={categories}
                                            authors={authors}
                                            generateSlug={generateSlug}
                                            setActiveLanguage={setActiveLanguage}
                                            selectedCategories={selectedCategories}
                                            setSelectedCategories={setSelectedCategories}
                                        />

                                        <NewsContenxt
                                            activeLanguage={activeLanguage}
                                            values={values}
                                            errors={errors}
                                            touched={touched}
                                            setFieldValue={setFieldValue}
                                        />

                                        <SeoKeywords
                                            setKeywordInput={setKeywordInput}
                                            keywordInput={keywordInput}
                                            addKeyword={addKeyword}
                                            seoKeywords={seoKeywords}
                                            removeKeyword={removeKeyword}
                                            seoTitle={seoTitle}
                                            setSeoTitle={setSeoTitle}
                                            seoDescription={seoDescription}
                                            setSeoDescription={setSeoDescription}
                                            allowComments={allowComments}
                                            setAllowComments={setAllowComments}
                                        />

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
                                                    <button
                                                        type="submit"
                                                        disabled={createNewsMutation.isPending}
                                                        onClick={(e) => {
                                                            console.log('🔘 Submit button clicked!');
                                                            console.log('🔍 Form validation errors:', errors);
                                                            console.log('🔍 Form touched fields:', touched);
                                                            console.log('🔍 Form values:', values);
                                                            console.log('🔍 Form is valid:', Object.keys(errors).length === 0);
                                                        }}
                                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center transition-colors"
                                                    >
                                                        <FiSave className="mr-2" size={18} />
                                                        {createNewsMutation.isPending ? 'Publishing...' : 'Publish Article'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {serverError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-red-600">{serverError}</p>
                                            </div>
                                        )}

                                        {/* Debug Section - Remove after fixing */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
                                            <p className="text-sm text-yellow-700">
                                                Form Valid: {Object.keys(errors).length === 0 ? 'Yes' : 'No'}
                                            </p>
                                            {Object.keys(errors).length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-red-600">Validation Errors:</p>
                                                    <ul className="text-xs text-red-600">
                                                        {Object.entries(errors).map(([field, error]) => (
                                                            <li key={field}>• {field}: {error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 space-y-6">
                        {/* Cover Image Preview */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <div className="flex items-center mb-4">
                                <FiImage className="w-5 h-5 text-indigo-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Cover Image</h3>
                            </div>

                            {coverImagePreview ? (
                                <div className="relative mb-4">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCoverImage(null);
                                            setCoverImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FiX size={12} />
                                    </button>
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        Cover Image
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                    <div className="text-center">
                                        <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No cover image</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Buttons */}
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="sidebarCoverImage"
                                />
                                <label
                                    htmlFor="sidebarCoverImage"
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors text-sm"
                                >
                                    <FiUpload className="w-4 h-4 mr-2" />
                                    Upload New Image
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowCoverGallery(true)}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    <FiFolder className="w-4 h-4 mr-2" />
                                    Choose from Gallery
                                </button>
                            </div>
                        </div>

                        {/* SEO Summary */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <div className="flex items-center mb-4">
                                <FiSearch className="w-5 h-5 text-indigo-600 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Article Summary</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Selected Categories */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Selected Categories</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {selectedCategories.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {selectedCategories.map((categoryId) => {
                                                    const category = categories.find(cat => cat.id === categoryId);
                                                    return category ? (
                                                        <span
                                                            key={categoryId}
                                                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                                        >
                                                            {category.name_En || category.name}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No categories selected</p>
                                        )}
                                    </div>
                                </div>

                                {/* SEO Title */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">SEO Title</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-900 truncate">
                                            {seoTitle || 'No SEO title set'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {seoTitle?.length || 0}/70 characters
                                        </p>
                                    </div>
                                </div>

                                {/* SEO Description */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">SEO Description</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-900 line-clamp-3">
                                            {seoDescription || 'No SEO description set'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {seoDescription?.length || 0}/160 characters
                                        </p>
                                    </div>
                                </div>

                                {/* SEO Keywords */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">SEO Keywords</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {seoKeywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {seoKeywords.slice(0, 5).map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                                {seoKeywords.length > 5 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{seoKeywords.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No keywords added</p>
                                        )}
                                    </div>
                                </div>

                                {/* Comments Setting */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Comments</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <FiMessageCircle className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="text-sm text-gray-900">
                                                {allowComments ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cover Image Gallery Modal */}
                <ImageGalleryModal
                    isOpen={showCoverGallery}
                    onClose={() => setShowCoverGallery(false)}
                    onSelectImage={handleCoverImageSelect}
                />

                {/* News Preview Modal - Outside Formik but with current values */}
                {showPreview && currentFormValues && (
                    <NewsPreview
                        isOpen={showPreview}
                        onClose={() => setShowPreview(false)}
                        articleData={{
                            ...currentFormValues,
                            coverImagePreview,
                            seoKeywords,
                            categoryIds: selectedCategories,
                            seoTitle,
                            seoDescription,
                            allowComments
                        }}
                        activeLanguage={activeLanguage}
                    />
                )}
            </div>
        </div>
    );
};

export default AddNews;
