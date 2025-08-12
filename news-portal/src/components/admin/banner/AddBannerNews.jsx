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
    FiX,
    FiEdit2
} from 'react-icons/fi';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { getArticles } from '../../../api/news-services';

const AddBannerNews = () => {
    const [serverError, setServerError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNews, setSelectedNews] = useState([]);
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('manage');
    const [editWidgetId, setEditWidgetId] = useState(null);
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch all news articles
    const { data: newsData, isLoading: newsLoading } = useQuery({
        queryKey: ['articles', { search: searchQuery }],
        queryFn: () => getArticles({ page: 1, pageSize: 50, search: searchQuery })
    });

    // Mock data for existing widgets - replace with actual API call
    const existingWidgets = [
        {
            id: 1,
            type: 'PostWidget',
            postId: '498',
            displayType: 'All Fields',
            textLength: 300,
            relatedPosts: '',
            isActive: true
        },
        {
            id: 2,
            type: 'PostWidget',
            postId: '485',
            displayType: 'All Fields',
            textLength: 300,
            relatedPosts: '',
            isActive: true
        }
    ];

    const availableNews = newsData?.items || [];

    const validationSchema = Yup.object({
        widgets: Yup.array().of(
            Yup.object({
                type: Yup.string().required('Type is required'),
                postId: Yup.string().when('type', {
                    is: 'PostWidget',
                    then: Yup.string().required('Post ID is required')
                }),
                displayType: Yup.string().when('type', {
                    is: 'PostWidget',
                    then: Yup.string().required('Display type is required')
                }),
                textLength: Yup.number().when('type', {
                    is: 'PostWidget',
                    then: Yup.number().min(100, 'Text length must be at least 100').required('Text length is required')
                }),
                relatedPosts: Yup.string(),
                isActive: Yup.boolean()
            })
        )
    });

    // Mock mutation - replace with actual API call
    const saveWidgetsMutation = useMutation({
        mutationFn: async (data) => {
            // Simulate API call
            console.log('Saving widgets:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bannerWidgets'] });
            toast.success('Widgets saved successfully!');
            setActiveTab('manage');
            setEditWidgetId(null);
        },
        onError: (error) => {
            console.error('Save widgets error:', error);
            setServerError(error.message || 'Failed to save widgets');
            toast.error(error.message || 'Failed to save widgets');
        }
    });

    const handleAddWidget = (arrayHelpers) => {
        const newWidget = {
            type: 'PostWidget',
            postId: '',
            displayType: 'All Fields',
            textLength: 300,
            relatedPosts: '',
            isActive: true
        };
        
        arrayHelpers.push(newWidget);
        setEditWidgetId(arrayHelpers.form.values.widgets.length - 1);
        setActiveTab('edit');
    };

    const handleEditWidget = (index) => {
        setEditWidgetId(index);
        setActiveTab('edit');
    };

    const handleRemoveWidget = (index, arrayHelpers) => {
        arrayHelpers.remove(index);
        toast.success('Widget removed');
    };

    const initialValues = {
        widgets: existingWidgets
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="mr-2" size={16} />
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiStar className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Manage Banner Widgets</h1>
                                    <p className="text-gray-600 mt-1">Configure widgets to display banner posts</p>
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

                {/* Tabs */}
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-lg ${activeTab === 'manage' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Widgets List
                        </button>
                        <button
                            onClick={() => setActiveTab('add')}
                            className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-lg ${activeTab === 'add' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Add New Widget
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-lg ${activeTab === 'edit' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            disabled={editWidgetId === null}
                        >
                            Edit Widget
                        </button>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await saveWidgetsMutation.mutateAsync(values);
                        } catch (error) {
                            console.error('Submission error:', error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, errors, touched, isSubmitting }) => (
                        <Form className="space-y-8 flex ">
                            {/* Manage Widgets Tab */}
                            {activeTab === 'manage' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <FieldArray name="widgets">
                                        {(arrayHelpers) => (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h2 className="text-xl font-semibold text-gray-900">Widgets to display banner posts</h2>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddWidget(arrayHelpers)}
                                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                    >
                                                        <FiPlus className="w-4 h-4 mr-2" />
                                                        Add Widget
                                                    </button>
                                                </div>

                                                {values.widgets.length === 0 ? (
                                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                        <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Widgets Configured</h3>
                                                        <p className="text-gray-500 mb-4">Start by adding widgets to display banner posts</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddWidget(arrayHelpers)}
                                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            <FiPlus className="w-4 h-4 mr-2" />
                                                            Add First Widget
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {values.widgets.map((widget, index) => (
                                                            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-900">
                                                                            {widget.type} - Post ID: {widget.postId}
                                                                        </h4>
                                                                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                                                            <div>
                                                                                <span className="text-gray-500">Display Type:</span> {widget.displayType}
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500">Text Length:</span> {widget.textLength}
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500">Status:</span> 
                                                                                <span className={`ml-1 ${widget.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                                                                    {widget.isActive ? 'Active' : 'Inactive'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleEditWidget(index)}
                                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                                        >
                                                                            <FiEdit2 className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveWidget(index, arrayHelpers)}
                                                                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                                        >
                                                                            <FiTrash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            )}

                            {/* Add/Edit Widget Tab */}
                            {(activeTab === 'add' || activeTab === 'edit') && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        {activeTab === 'add' ? 'Add New Widget' : 'Edit Widget'}
                                    </h2>

                                    <FieldArray name="widgets">
                                        {(arrayHelpers) => {
                                            const currentWidget = activeTab === 'add' ? 
                                                values.widgets[values.widgets.length - 1] : 
                                                values.widgets[editWidgetId];
                                            
                                            return (
                                                <div className="space-y-6">
                                                    {/* Widget Type */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Widget Type</label>
                                                        <select
                                                            name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.type`}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="PostWidget">Post Widget</option>
                                                            <option value="AdsWidget">Ads Widget</option>
                                                            <option value="VideoWidget">Video Widget</option>
                                                            <option value="Text">Text Widget</option>
                                                        </select>
                                                    </div>

                                                    {/* Post Widget Fields */}
                                                    {currentWidget?.type === 'PostWidget' && (
                                                        <>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Post ID</label>
                                                                <input
                                                                    type="text"
                                                                    name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.postId`}
                                                                    placeholder="Enter post ID"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Type</label>
                                                                <select
                                                                    name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.displayType`}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                                >
                                                                    <option value="All Fields">All Fields</option>
                                                                    <option value="Title Only">Title Only</option>
                                                                    <option value="Excerpt">Excerpt</option>
                                                                    <option value="Featured Image">Featured Image</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Length</label>
                                                                <input
                                                                    type="number"
                                                                    name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.textLength`}
                                                                    placeholder="300"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Related Posts <span className="text-gray-400">(Post IDs with comma separated values)</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.relatedPosts`}
                                                                    placeholder="123, 456, 789"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Status */}
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            name={`widgets.${activeTab === 'add' ? values.widgets.length - 1 : editWidgetId}.isActive`}
                                                            id="isActive"
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                                            Active
                                                        </label>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveTab('manage');
                                                                if (activeTab === 'add') {
                                                                    arrayHelpers.remove(values.widgets.length - 1);
                                                                }
                                                            }}
                                                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting || saveWidgetsMutation.isPending}
                                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center transition-colors"
                                                        >
                                                            <FiSave className="mr-2" size={16} />
                                                            {isSubmitting || saveWidgetsMutation.isPending ? 'Saving...' : 'Save Widget'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </FieldArray>
                                </div>
                            )}

                            {/* Available Widgets */}
                            {activeTab === 'manage' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Widgets</h2>
                                    <p className="text-gray-600 mb-4">To activate widget, click on + (plus), choose the location and click activate</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">Ads Widget</h3>
                                                <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">Display advertisement banners</p>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">Post Widget</h3>
                                                <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">Display posts with various options</p>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">Text Widget</h3>
                                                <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">Custom text content</p>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">Video Widget</h3>
                                                <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">Embed videos in banner</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>   
            </div>
        </div>
    );
};

export default AddBannerNews;