import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { imgServer, server } from '../../../api/server';
import { getCategories } from '../../../api/category-services';
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
import SeoKeywords from './SEOKeywords';
import { NewsContenxt } from './NewsContents';
import { BasicInformation } from './BasicInformation';

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
        queryFn: getCategories
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
                            {/* sdfkljsdlkfj flsjd flksdj flkj sdfk sdklf jsdkl jsdk fksld flksd fjlk */}
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
                            />

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
