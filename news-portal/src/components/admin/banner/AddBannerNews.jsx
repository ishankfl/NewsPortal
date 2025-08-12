import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiSave,
    FiArrowLeft,
    FiPlus,
    FiTrash2,
    FiSearch,
    FiImage,
    FiEye,
    FiUser,
    FiCalendar,
    FiStar,
    FiX
} from 'react-icons/fi';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { getArticles } from '../../../api/news-services';

const AddBannerNews = () => {
    const [serverError, setServerError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNews, setSelectedNews] = useState([]);
    const [showNewsModal, setShowNewsModal] = useState(false);
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch all news articles
    const { data: newsData, isLoading: newsLoading } = useQuery({
        queryKey: ['articles', { search: searchQuery }],
        queryFn: () => getArticles({ page: 1, pageSize: 50, search: searchQuery })
    });

    const availableNews = newsData?.items || [];

    const validationSchema = Yup.object({
        bannerNews: Yup.array().of(
            Yup.object({
                newsId: Yup.string().required('News ID is required'),
                priority: Yup.number().min(1, 'Priority must be at least 1').required('Priority is required'),
                isActive: Yup.boolean()
            })
        ).min(1, 'At least one banner news is required')
    });

    // Mock mutation - replace with actual API call
    const createBannerNewsMutation = useMutation({
        mutationFn: async (data) => {
            // Simulate API call
            console.log('Creating banner news:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bannerNews'] });
            toast.success('Banner news created successfully!');
            navigate('/admin/banner');
        },
        onError: (error) => {
            console.error('Create banner news error:', error);
            setServerError(error.message || 'Failed to create banner news');
            toast.error(error.message || 'Failed to create banner news');
        }
    });

    const handleAddNews = (newsItem, arrayHelpers) => {
        const exists = selectedNews.find(item => item.id === newsItem.id);
        if (exists) {
            toast.warning('This news is already added to banner');
            return;
        }

        const newBannerItem = {
            newsId: newsItem.id.toString(),
            priority: selectedNews.length + 1,
            isActive: true,
            newsData: newsItem // Store for display purposes
        };

        arrayHelpers.push(newBannerItem);
        setSelectedNews([...selectedNews, newsItem]);
        setShowNewsModal(false);
        toast.success('News added to banner');
    };

    const handleRemoveNews = (index, arrayHelpers) => {
        const removedItem = selectedNews[index];
        arrayHelpers.remove(index);
        setSelectedNews(selectedNews.filter((_, i) => i !== index));
        toast.success('News removed from banner');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const initialValues = {
        bannerNews: []
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate('/admin/banner')}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="mr-2" size={16} />
                            Back to Banner
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiStar className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Add Banner News</h1>
                                    <p className="text-gray-600 mt-1">Select and configure news articles for banner display</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Selected Items</p>
                                    <p className="text-sm font-medium text-indigo-600">{selectedNews.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <FiStar className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {serverError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const submitData = {
                                        bannerNews: values.bannerNews.map(item => ({
                                            newsId: parseInt(item.newsId),
                                            priority: item.priority,
                                            isActive: item.isActive
                                        }))
                                    };
                                    
                                    await createBannerNewsMutation.mutateAsync(submitData);
                                } catch (error) {
                                    console.error('Submission error:', error);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ values, errors, touched, isSubmitting }) => (
                                <Form className="space-y-8">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold text-gray-900">Banner News Configuration</h2>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewsModal(true)}
                                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <FiPlus className="w-4 h-4 mr-2" />
                                                Add News
                                            </button>
                                        </div>

                                        <FieldArray name="bannerNews">
                                            {(arrayHelpers) => (
                                                <div className="space-y-4">
                                                    {values.bannerNews.length === 0 ? (
                                                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                            <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Banner News Added</h3>
                                                            <p className="text-gray-500 mb-4">Start by adding news articles to your banner</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewsModal(true)}
                                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                            >
                                                                <FiPlus className="w-4 h-4 mr-2" />
                                                                Add First News
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        values.bannerNews.map((item, index) => (
                                                            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                                <div className="flex items-start space-x-4">
                                                                    {/* News Image */}
                                                                    <div className="w-24 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                                                                        {item.newsData?.coverImage ? (
                                                                            <img
                                                                                src={item.newsData.coverImage}
                                                                                alt={item.newsData.title}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <FiImage className="w-6 h-6 text-gray-500" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* News Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                            {item.newsData?.title || `News ID: ${item.newsId}`}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            ID: {item.newsId}
                                                                        </p>
                                                                        {item.newsData && (
                                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                                                <span className="flex items-center">
                                                                                    <FiUser className="w-3 h-3 mr-1" />
                                                                                    {item.newsData.author}
                                                                                </span>
                                                                                <span className="flex items-center">
                                                                                    <FiCalendar className="w-3 h-3 mr-1" />
                                                                                    {formatDate(item.newsData.publishedAt)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Controls */}
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex items-center space-x-2">
                                                                            <label className="text-xs text-gray-600">Priority:</label>
                                                                            <input
                                                                                type="number"
                                                                                name={`bannerNews.${index}.priority`}
                                                                                value={item.priority}
                                                                                onChange={(e) => {
                                                                                    arrayHelpers.replace(index, {
                                                                                        ...item,
                                                                                        priority: parseInt(e.target.value) || 1
                                                                                    });
                                                                                }}
                                                                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                                min="1"
                                                                            />
                                                                        </div>
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                name={`bannerNews.${index}.isActive`}
                                                                                checked={item.isActive}
                                                                                onChange={(e) => {
                                                                                    arrayHelpers.replace(index, {
                                                                                        ...item,
                                                                                        isActive: e.target.checked
                                                                                    });
                                                                                }}
                                                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                            <span className="ml-2 text-xs text-gray-600">Active</span>
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveNews(index, arrayHelpers)}
                                                                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                                        >
                                                                            <FiTrash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}

                                                    {/* News Selection Modal */}
                                                    {showNewsModal && (
                                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                                            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                                                                <div className="p-6 border-b border-gray-200">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="text-xl font-semibold text-gray-900">Select News for Banner</h3>
                                                                        <button
                                                                            onClick={() => setShowNewsModal(false)}
                                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                        >
                                                                            <FiX className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="mt-4">
                                                                        <div className="relative">
                                                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Search news articles..."
                                                                                value={searchQuery}
                                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-6 overflow-y-auto max-h-96">
                                                                    {newsLoading ? (
                                                                        <div className="text-center py-8">
                                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                                                            <p className="text-gray-500 mt-2">Loading news...</p>
                                                                        </div>
                                                                    ) : availableNews.length === 0 ? (
                                                                        <div className="text-center py-8">
                                                                            <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                                            <p className="text-gray-500">No news articles found</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {availableNews.map((news) => (
                                                                                <div
                                                                                    key={news.id}
                                                                                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                                                                                    onClick={() => handleAddNews(news, arrayHelpers)}
                                                                                >
                                                                                    <div className="flex items-start space-x-3">
                                                                                        <div className="w-16 h-12 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                                                                                            {news.coverImage ? (
                                                                                                <img
                                                                                                    src={news.coverImage}
                                                                                                    alt={news.title}
                                                                                                    className="w-full h-full object-cover"
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="w-full h-full flex items-center justify-center">
                                                                                                    <FiImage className="w-4 h-4 text-gray-500" />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                                                {news.title}
                                                                                            </h4>
                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                ID: {news.id} • {formatDate(news.publishedAt)}
                                                                                            </p>
                                                                                            <div className="flex items-center mt-2">
                                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                                                    {news.category || 'Uncategorized'}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </FieldArray>

                                        {errors.bannerNews && typeof errors.bannerNews === 'string' && (
                                            <p className="mt-2 text-sm text-red-600">{errors.bannerNews}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/admin/banner')}
                                                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || createBannerNewsMutation.isPending}
                                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center transition-colors"
                                            >
                                                <FiSave className="mr-2" size={18} />
                                                {isSubmitting || createBannerNewsMutation.isPending ? 'Saving...' : 'Save Banner News'}
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Instructions */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start space-x-2">
                                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                                        <p>Click "Add News" to select articles from your published news</p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                                        <p>Set priority order (1 = highest priority)</p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                                        <p>Toggle active status for each banner item</p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                                        <p>Save to apply changes to your banner</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Total Items</span>
                                        <span className="text-lg font-semibold text-indigo-600">{selectedNews.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Active Items</span>
                                        <span className="text-lg font-semibold text-green-600">
                                            {selectedNews.filter((_, index) => values.bannerNews[index]?.isActive).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBannerNews;