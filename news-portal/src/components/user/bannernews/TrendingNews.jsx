import React from 'react';
import { FiTrendingUp, FiClock, FiEye, FiArrowRight } from 'react-icons/fi';

const TrendingNews = ({ trendingNews }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateTitle = (title, maxLength = 60) => {
        if (!title) return '';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <FiTrendingUp className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Trending News</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">Most popular stories right now</p>
            </div>

            {/* Trending News List */}
            <div className="p-4">
                {trendingNews && trendingNews.length > 0 ? (
                    <div className="space-y-4">
                        {trendingNews.slice(0, 8).map((news, index) => (
                            <div key={news.id} className="group cursor-pointer">
                                <div className="flex space-x-3">
                                    {/* Ranking Number */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            index < 3 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* News Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex space-x-3">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-12 rounded overflow-hidden">
                                                    {news.coverImageUrl ? (
                                                        <img
                                                            src={news.coverImageUrl}
                                                            alt={news.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
                                                            <span className="text-white text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                                    {truncateTitle(news.title)}
                                                </h3>
                                                
                                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <FiClock className="w-3 h-3" />
                                                        <span>{formatDate(news.publicationDatetime || news.createdAt)}</span>
                                                    </div>
                                                    {news.viewCount && (
                                                        <div className="flex items-center space-x-1">
                                                            <FiEye className="w-3 h-3" />
                                                            <span>{news.viewCount}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Category Badge */}
                                                {news.categoryName && (
                                                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-1">
                                                        {news.categoryName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Line */}
                                <div className="mt-2 h-px bg-gray-200 group-hover:bg-blue-300 transition-colors"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FiTrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No trending news available</p>
                    </div>
                )}

                {/* View All Button */}
                {trendingNews && trendingNews.length > 8 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                            <span>View All Trending</span>
                            <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Popular Categories */}
            <div className="border-t border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {['Politics', 'Sports', 'Technology', 'Business', 'Entertainment'].map((category) => (
                        <button
                            key={category}
                            className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-xs font-medium transition-colors"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Newsletter Signup */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-xs text-gray-600 mb-3">Get the latest news delivered to your inbox</p>
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendingNews;
