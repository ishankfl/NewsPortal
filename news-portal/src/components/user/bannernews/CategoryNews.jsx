import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiShare2, FiBookmark, FiFileText } from 'react-icons/fi';
import { getAllArticles } from '../../../api/news-services';
import { demoArticles } from './demoData';
import { imgServer } from '../../../api/server';

const CategoryNews = ({ selectedCategory, categories }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
        totalCount: 0
    });

    // Fetch news based on selected category
    const fetchCategoryNews = async () => {
        try {
            setLoading(true);

            const queryParams = {
                page: pagination.page,
                pageSize: pagination.pageSize
            };

            if (selectedCategory !== 'all') {
                queryParams.categoryId = selectedCategory;
            }

            const response = await getAllArticles(queryParams);

            setNews(prev => pagination.page === 1 ? response.items || [] : [...prev, ...(response.items || [])]);
            setPagination(prev => ({
                ...prev,
                totalCount: response.totalCount || 0
            }));
        } catch (error) {
            console.error('Error fetching category news:', error);

            const filteredNews = selectedCategory === 'all'
                ? demoArticles
                : demoArticles.filter(article => article.categoryId === selectedCategory);

            setNews(filteredNews);
            setPagination(prev => ({
                ...prev,
                totalCount: filteredNews.length
            }));
        } finally {
            setLoading(false);
        }
    };

    // Reset page when category changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [selectedCategory]);

    useEffect(() => {
        fetchCategoryNews();
    }, [selectedCategory, pagination.page]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getCategoryName = (categoryId) => {
        if (selectedCategory === 'all') return 'All News';
        const category = categories.find(cat => cat.id === categoryId);
        return category ? (category.name_Np || category.name_En) : 'News';
    };

    const loadMore = () => {
        if (pagination.page * pagination.pageSize < pagination.totalCount) {
            setPagination(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
    };

    if (loading && pagination.page === 1) {
        return (
            <div className="space-y-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                        <div className="flex space-x-4">
                            <div className="w-32 h-24 bg-gray-300 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    {getCategoryName(selectedCategory)}
                </h2>
                <span className="text-sm text-gray-500">
                    {pagination.totalCount} articles found
                </span>
            </div>

            {/* No news fallback */}
            {news.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiFileText className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No News Found</h3>
                    <p className="text-gray-500">No articles available in this category.</p>
                </div>
            ) : (
                <>
                    {/* Featured Article */}
                    {news.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    {news[0].coverImageUrl ? (
                                        <img
                                            src={`${imgServer}${news[0].coverImageUrl}`}
                                            alt={news[0].title}
                                            className="w-full h-64 md:h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-64 md:h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white text-lg font-medium">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="md:w-1/2 p-6">
                                    {news[0].categoryName && (
                                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                            {news[0].categoryName}
                                        </span>
                                    )}
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                        {news[0].title}
                                    </h3>
                                    {news[0].summary && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {truncateText(news[0].summary, 150)}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center space-x-4">
                                            {news[0].authorName && (
                                                <div className="flex items-center space-x-1">
                                                    <FiUser className="w-4 h-4" />
                                                    <span>{news[0].authorName}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-1">
                                                <FiClock className="w-4 h-4" />
                                                <span>{formatDate(news[0].publicationDatetime || news[0].createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.slice(1).map((article) => (
                            <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video overflow-hidden">
                                    {article.imageUrl ? (
                                        <img
                                            src={`${imgServer}${article.imageUrl}`}
                                            alt={`${imgServer}${article.imageUrl}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                                            <span className="text-white text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    {article.categoryName && (
                                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium mb-2">
                                            {article.categoryName}
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    {article.summary && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {truncateText(article.summary, 100)}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <FiClock className="w-3 h-3" />
                                            <span>{formatDate(article.publicationDatetime || article.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="hover:text-blue-600">
                                                <FiBookmark className="w-3 h-3" />
                                            </button>
                                            <button className="hover:text-blue-600">
                                                <FiShare2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {pagination.page * pagination.pageSize < pagination.totalCount && (
                        <div className="text-center mt-8">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? 'Loading...' : 'Load More Articles'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryNews;
