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
    FiTrendingUp,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

const BannerNews = () => {
    const [activeTab, setActiveTab] = useState('featured');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Mock data - replace with actual API calls
    const bannerNews = [
        {
            id: 1,
            title: "Breaking: Major Political Development in Nepal",
            subtitle: "Government announces new policies for economic recovery and development initiatives",
            coverImage: "https://via.placeholder.com/1200x600",
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
            subtitle: "Latest financial reports indicate significant improvement in key economic indicators",
            coverImage: "https://via.placeholder.com/1200x600",
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
            subtitle: "Industry leaders discuss future of digital transformation and emerging technologies",
            coverImage: "https://via.placeholder.com/1200x600",
            author: "Mike Johnson",
            publishedAt: "2024-01-13T09:15:00",
            views: 12350,
            status: "active",
            priority: 3,
            category: "Technology"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerNews.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerNews.length) % bannerNews.length);
    };

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
                {/* Header with Logo and Ad Space */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            {/* Logo Section */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiImage className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">News Portal</h1>
                                    <p className="text-gray-600 mt-1">Your trusted source for latest news</p>
                                </div>
                            </div>
                            
                            {/* Header Advertisement Space */}
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FiImage className="w-6 h-6 text-gray-500" />
                                </div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Header Ad Space</h4>
                                <p className="text-xs text-gray-500">468x60 Banner</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Banner Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    {/* Main Banner News */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Tabs */}
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

                            {/* Banner Slider */}
                            <div className="relative h-96 md:h-[500px] overflow-hidden">
                                {bannerNews.map((news, index) => (
                                    <div
                                        key={news.id}
                                        className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                                            index === currentSlide ? 'translate-x-0' : 
                                            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                                        }`}
                                    >
                                        {/* Background Image */}
                                        <div className="relative h-full">
                                            <img
                                                src={news.coverImage}
                                                alt={news.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                            
                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                                <div className="max-w-4xl">
                                                    {/* Category Badge */}
                                                    <div className="mb-4">
                                                        <span className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
                                                            <FiStar className="w-3 h-3 mr-1" />
                                                            {news.category}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Title */}
                                                    <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                                                        {news.title}
                                                    </h2>
                                                    
                                                    {/* Subtitle */}
                                                    <p className="text-lg md:text-xl text-gray-200 mb-4 leading-relaxed">
                                                        {news.subtitle}
                                                    </p>
                                                    
                                                    {/* Meta Info */}
                                                    <div className="flex items-center space-x-6 text-sm text-gray-300">
                                                        <div className="flex items-center">
                                                            <FiUser className="w-4 h-4 mr-2" />
                                                            {news.author}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiCalendar className="w-4 h-4 mr-2" />
                                                            {formatDate(news.publishedAt)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiEye className="w-4 h-4 mr-2" />
                                                            {formatViews(news.views)} views
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Navigation Arrows */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
                                >
                                    <FiChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
                                >
                                    <FiChevronRight className="w-6 h-6" />
                                </button>

                                {/* Slide Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {bannerNews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Admin Actions */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                            <FiPlus className="w-4 h-4 mr-2" />
                                            Add to Banner
                                        </button>
                                        <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <FiEdit3 className="w-4 h-4 mr-2" />
                                            Edit Current
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            {currentSlide + 1} of {bannerNews.length}
                                        </span>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Advertisement */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
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

                {/* Middle Advertisement Space */}
                <div className="mb-12">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiImage className="w-10 h-10 text-gray-500" />
                        </div>
                        <h4 className="text-xl font-medium text-gray-700 mb-2">Middle Advertisement Space</h4>
                        <p className="text-gray-500">728x90 Leaderboard Banner Ad</p>
                    </div>
                </div>

                {/* Secondary News Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {bannerNews.slice(0, 3).map((news) => (
                        <div key={`secondary-${news.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={news.coverImage}
                                    alt={news.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {news.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                                    {news.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {news.subtitle}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <FiUser className="w-3 h-3 mr-1" />
                                        {news.author}
                                    </div>
                                    <div className="flex items-center">
                                        <FiEye className="w-3 h-3 mr-1" />
                                        {formatViews(news.views)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Advertisement Space */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiImage className="w-10 h-10 text-gray-500" />
                        </div>
                        <h4 className="text-xl font-medium text-gray-700 mb-3">Footer Advertisement Space</h4>
                        <p className="text-gray-500">970x250 Billboard Banner Ad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerNews;
