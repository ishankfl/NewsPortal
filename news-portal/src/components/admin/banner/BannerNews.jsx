import React, { useState, useEffect } from 'react';
import {
    FiImage, FiPlus, FiEdit3, FiTrash2, FiChevronLeft, FiChevronRight,
    FiFileText, FiType, FiVideo, FiSettings
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import banner service
import {
    getBanners,
    deleteBanner,
    updateBannerStatus,
    assignBannerToPosition,
    removeBannerFromPosition
} from '../../../api/banner-service';

const BannerNews = () => {
    const navigate = useNavigate();
    const [bannerWidgets, setBannerWidgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalItems: 0
    });

    const availableWidgets = [
        { id: 'ads', name: 'Ads Widget', icon: FiImage, description: 'Display advertisement banners' },
        { id: 'post', name: 'Post Widget', icon: FiFileText, description: 'Show featured news posts' },
        { id: 'text', name: 'Text', icon: FiType, description: 'Custom text content' },
        { id: 'video', name: 'Video Widget', icon: FiVideo, description: 'Embed video content' }
    ];

    // Fetch banner widgets
    const fetchBannerWidgets = async () => {
        try {
            setLoading(true);
            const { data } = await getBanners(pagination.page, pagination.pageSize);
            setBannerWidgets(data?.items || []);
            setPagination(prev => ({ ...prev, totalItems: data?.totalItems || 0 }));
        } catch (error) {
            toast.error('Failed to fetch banner widgets');
            console.error('Error fetching banners:', error);
            setBannerWidgets([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Delete banner
    const handleDelete = async (id) => {
        try {
            await deleteBanner(id);
            toast.success('Banner deleted successfully');
            fetchBannerWidgets();
        } catch (error) {
            toast.error('Failed to delete banner');
            console.error(error);
        }
    };

    // Toggle status
    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateBannerStatus(id, !currentStatus);
            toast.success('Banner status updated');
            fetchBannerWidgets();
        } catch (error) {
            toast.error('Failed to update banner status');
            console.error(error);
        }
    };

    // Assign to position
    const assignToPosition = async (bannerId, positionId) => {
        try {
            await assignBannerToPosition(bannerId, positionId);
            toast.success('Banner assigned to position');
            fetchBannerWidgets();
        } catch (error) {
            toast.error('Failed to assign banner');
            console.error(error);
        }
    };

    // Remove from position
    const removeFromPositionHandler = async (bannerId, positionId) => {
        try {
            await removeBannerFromPosition(bannerId, positionId);
            toast.success('Banner removed from position');
            fetchBannerWidgets();
        } catch (error) {
            toast.error('Failed to remove banner');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBannerWidgets();
    }, [pagination.page]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Manage Widgets</h1>
                        <p className="text-sm text-gray-600 mt-1">गृह पृष्ठ Manage Widgets</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/banner/add')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Add Widget
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Banner Posts Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Banner Posts</h2>
                            <p className="text-sm text-gray-500">Widgets to display banner posts</p>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : bannerWidgets.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Banner News Found</h3>
                                    <p className="text-gray-500 mb-6">You haven't created any banner news widgets yet. Get started by adding your first banner news.</p>
                                    <button
                                        onClick={() => navigate('/admin/banner/add')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4 mr-2" />
                                        Add First Banner News
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {bannerWidgets.map((widget) => (
                                            <div key={widget.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                                <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
                                                    {widget.imageUrl ? (
                                                        <img
                                                            src={widget.imageUrl}
                                                            alt={widget.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FiImage className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                            {widget.type}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <button
                                                                onClick={() => navigate(`/admin/banner/edit/${widget.id}`)}
                                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <FiEdit3 className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(widget.id)}
                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <FiTrash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {widget.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>{widget.position}</span>
                                                        <button
                                                            onClick={() => toggleStatus(widget.id, widget.isActive)}
                                                            className={`px-2 py-1 rounded-full ${widget.isActive
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {widget.isActive ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pagination */}
                                    <div className="flex items-center justify-between mt-6">
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                                            disabled={pagination.page === 1}
                                            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                                        >
                                            <FiChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            Page {pagination.page} of {Math.ceil(pagination.totalItems / pagination.pageSize)}
                                        </span>
                                        <button
                                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                            disabled={pagination.page * pagination.pageSize >= pagination.totalItems}
                                            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                                        >
                                            Next
                                            <FiChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Available Widgets Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Available Widgets</h2>
                        <p className="text-sm text-gray-500">To activate widget, click on + (plus), choose the location and click activate</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {availableWidgets.map((widget) => (
                                <div key={widget.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <widget.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">{widget.name}</h3>
                                        <p className="text-xs text-gray-500 mb-4">{widget.description}</p>
                                        <button
                                            onClick={() => navigate(`/admin/banner/add?type=${widget.id}`)}
                                            className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <FiPlus className="w-3 h-3 mr-1" />
                                            Add Widget
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Widget Locations */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Widget Locations</h2>
                        <p className="text-sm text-gray-500">Manage widget placement across your site</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Header Banner Position */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Header Banner</h3>
                                <div className="space-y-2">
                                    {bannerWidgets
                                        .filter(w => w.position === 'Header Banner')
                                        .sort((a, b) => a.priority - b.priority)
                                        .map(widget => (
                                            <div key={widget.id} className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-900">{widget.title}</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => removeFromPosition(widget.id, 1)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FiSettings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Priority: {widget.priority}
                                                </div>
                                            </div>
                                        ))}
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded p-3 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            // Open modal to assign banner to this position
                                        }}
                                    >
                                        Drop widget here
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Position */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Sidebar</h3>
                                <div className="space-y-2">
                                    {bannerWidgets
                                        .filter(w => w.position === 'Sidebar')
                                        .sort((a, b) => a.priority - b.priority)
                                        .map(widget => (
                                            <div key={widget.id} className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-900">{widget.title}</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => removeFromPosition(widget.id, 2)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            <FiSettings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Priority: {widget.priority}
                                                </div>
                                            </div>
                                        ))}
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded p-3 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            // Open modal to assign banner to this position
                                        }}
                                    >
                                        Drop widget here
                                    </div>
                                </div>
                            </div>

                            {/* Footer Banner Position */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Footer Banner</h3>
                                <div className="space-y-2">
                                    {bannerWidgets
                                        .filter(w => w.position === 'Footer Banner')
                                        .sort((a, b) => a.priority - b.priority)
                                        .map(widget => (
                                            <div key={widget.id} className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-purple-900">{widget.title}</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => removeFromPosition(widget.id, 3)}
                                                            className="text-purple-600 hover:text-purple-800"
                                                        >
                                                            <FiSettings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Priority: {widget.priority}
                                                </div>
                                            </div>
                                        ))}
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded p-3 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            // Open modal to assign banner to this position
                                        }}
                                    >
                                        Drop widget here
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

export default BannerNews;

