import React, { useState } from 'react';
import { 
    FiImage, 
    FiPlus, 
    FiEdit3, 
    FiTrash2, 
    FiEye, 
    FiClock,
    FiUser,
    FiCalendar,
    FiStar,
    FiTrendingUp
} from 'react-icons/fi';

const BannerNews = () => {
    const [activeTab, setActiveTab] = useState('featured');

    // Mock data - replace with actual API calls
    const bannerNews = [
        {
            id: 1,
            title: "Breaking: Major Political Development in Nepal",
            slug: "breaking-major-political-development-nepal",
            summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            coverImage: "https://via.placeholder.com/800x400",
            author: "John Doe",
            publishedAt: "2024-01-15T10:30:00",
            views: 15420,
            status: "active",
            priority: 1,
            category: "Politics"
        },
        {
            id: 2,
            title: "Economic Growth Shows Positive Trends This Quarter",
            slug: "economic-growth-positive-trends-quarter",
            summary: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            coverImage: "https://via.placeholder.com/800x400",
            author: "Jane Smith",
            publishedAt: "2024-01-14T14:20:00",
            views: 8930,
            status: "active",
            priority: 2,
            category: "Economy"
        },
        {
            id: 3,
            title: "Technology Innovation Summit Concludes Successfully",
            slug: "technology-innovation-summit-concludes",
            summary: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            coverImage: "https://via.placeholder.com/800x400",
            author: "Mike Johnson",
            publishedAt: "2024-01-13T09:15:00",
            views: 12350,
            status: "active",
            priority: 3,
            category: "Technology"
        }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiImage className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Banner News</h1>
                                    <p className="text-gray-600 mt-1">Manage featured and trending news for homepage banner</p>
                                </div>
                            </div>
                            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                <FiPlus className="w-5 h-5 mr-2" />
                                Add to Banner
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('featured')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'featured'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <FiStar className="w-4 h-4 mr-2" />
                                            Featured Banner
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('trending')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === 'trending'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <FiTrendingUp className="w-4 h-4 mr-2" />
                                            Trending News
                                        </div>
                                    </button>
                                </nav>
                            </div>

                            {/* Banner News Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bannerNews.map((news) => (
                                        <div key={news.id} className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                                            {/* Image */}
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={news.coverImage}
                                                    alt={news.title}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        Priority {news.priority}
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {news.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                    {news.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {news.summary}
                                                </p>

                                                {/* Meta Info */}
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <FiUser className="w-3 h-3 mr-1" />
                                                            {news.author}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiEye className="w-3 h-3 mr-1" />
                                                            {formatViews(news.views)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiCalendar className="w-3 h-3 mr-1" />
                                                        {formatDate(news.publishedAt)}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                            <FiEye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                            <FiEdit3 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        news.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {news.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More */}
                                <div className="text-center mt-8">
                                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                                        Load More Banner News
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Advertisement Space */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Active Banners</span>
                                        <span className="text-lg font-semibold text-indigo-600">3</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Total Views</span>
                                        <span className="text-lg font-semibold text-green-600">36.7K</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Click Rate</span>
                                        <span className="text-lg font-semibold text-orange-600">12.4%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Advertisement Space 1 */}
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiImage className="w-8 h-8 text-gray-500" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Advertisement Space</h4>
                                <p className="text-sm text-gray-500">300x250 Banner Ad</p>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">Banner news updated</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">New banner added</p>
                                            <p className="text-xs text-gray-500">5 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">Priority changed</p>
                                            <p className="text-xs text-gray-500">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advertisement Space 2 */}
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiImage className="w-8 h-8 text-gray-500" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Advertisement Space</h4>
                                <p className="text-sm text-gray-500">300x600 Skyscraper Ad</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Advertisement Space */}
                <div className="mt-12 mb-8">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiImage className="w-10 h-10 text-gray-500" />
                        </div>
                        <h4 className="text-xl font-medium text-gray-700 mb-3">Advertisement Space</h4>
                        <p className="text-gray-500">728x90 Leaderboard Banner Ad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerNews;