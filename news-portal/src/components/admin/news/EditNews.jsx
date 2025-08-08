import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { imgServer } from '../../../api/server';
import { getCategories } from '../../../api/category-services';
import { getUsers } from '../../../api/user-services';
import { getArticleById, updateArticle } from '../../../api/news-services';
import {
    FiSave,
    FiArrowLeft,
    FiEye,
    FiEdit3
} from 'react-icons/fi';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ImageGalleryModal } from './ImageGalleryModal';
import NewsPreview from './NewsPreview';
import SeoKeywords from './SEOKeywords';
import { NewsContenxt } from './NewsContents';
import { BasicInformation } from './BasicInformation';

const EditNews = () => {
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
    const { id } = useParams();

    // Fetch article data
    const { data: article, isLoading: isLoadingArticle, isError } = useQuery({
        queryKey: ['article', id],
        queryFn: () => getArticleById(id),
        onSuccess: (data) => {
            // Set initial values from fetched data
            setSelectedCategories(data.categoryIds || []);
            setSeoKeywords(data.seoKeywords || []);
            setSeoTitle(data.seoTitle || '');
            setSeoDescription(data.seoDescription || '');
            setAllowComments(data.allowComments !== undefined ? data.allowComments : true);
            if (data.coverImageUrl) {
                setCoverImagePreview(data.coverImageUrl);
            }
        },
        onError: (error) => {
            console.error('Failed to load article:', error);
            toast.error('Failed to load article data');
        }
    });

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

    const updateNewsMutation = useMutation({
        mutationFn: ({ id, data }) => updateArticle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['article', id] });
            toast.success('Article updated successfully!');
            navigate('/admin/news/manage');
        },
        onError: (error) => {
            console.error('Update news error:', error);
            setServerError(error.message || 'Failed to update article');
            toast.error(error.message || 'Failed to update article');
        }
    });

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    if (isLoadingArticle) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading article...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-600">Failed to load article</p>
                        <button
                            onClick={() => navigate('/admin/news/manage')}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Back to News
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const initialValues = {
        title: article.title || '',
        slug: article.slug || '',
        content: article.content || '',
        authorId: article.authorId?.toString() || '',
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
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
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiEdit3 className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
                                    <p className="text-gray-600 mt-1">Update and modify your news article</p>
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
                            enableReinitialize={true}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    console.log('🚀 Form submission started');
                                    console.log('📝 Form values:', values);
                                    
                                    const updateData = {
                                        title: values.title,
                                        content: values.content,
                                        slug: values.slug,
                                        authorId: values.authorId,
                                        publishedAt: values.publishedAt,
                                        categoryIds: selectedCategories,
                                        seoKeywords: seoKeywords,
                                        seoTitle: seoTitle,
                                        seoDescription: seoDescription,
                                        allowComments: allowComments
                                    };
                                    
                                    await updateNewsMutation.mutateAsync({ id, data: updateData });
                                    console.log('✅ Update successful');
                                    
                                } catch (error) {
                                    console.error('❌ Update error:', error);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
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

                                        {/* Action Buttons */}
                                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                            <div className="flex justify-between items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPreview(true)}
                                                    className="flex items-center px-6 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                >
                                                    <FiEye className="mr-2" size={18} />
                                                    Preview
                                                </button>

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
                                                        disabled={updateNewsMutation.isPending}
                                                        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center transition-colors"
                                                    >
                                                        <FiSave className="mr-2" size={18} />
                                                        {updateNewsMutation.isPending ? 'Updating...' : 'Update Article'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>

                {/* News Preview Modal */}
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

export default EditNews;