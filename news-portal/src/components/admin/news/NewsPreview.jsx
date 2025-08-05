import React, { useState } from 'react';
import { 
    FiX, 
    FiEye, 
    FiCalendar, 
    FiUser, 
    FiTag, 
    FiGlobe,
    FiClock,
    FiShare2,
    FiBookmark,
    FiHeart
} from 'react-icons/fi';

const NewsPreview = ({ isOpen, onClose, articleData, activeLanguage = 'en' }) => {
    console.log("Daaaaaaaaaaaaaaaaaaaaaaaa",
        articleData,
        activeLanguage

    )
    const [previewLanguage, setPreviewLanguage] = useState(activeLanguage);

    if (!isOpen || !articleData) return null;

    const currentTitle = previewLanguage === 'en' ? articleData.title_en : articleData.title_np;
    const currentContent = previewLanguage === 'en' ? articleData.content_en : articleData.content_np;

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get reading time estimate
    const getReadingTime = (content) => {
        if (!content) return '0 min';
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        const wordCount = textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min read`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FiEye className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Article Preview</h2>
                            <p className="text-sm text-gray-600">Preview how your article will look</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Language Toggle */}
                        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                            <button
                                onClick={() => setPreviewLanguage('en')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    previewLanguage === 'en'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <FiGlobe className="w-3 h-3 inline mr-1" />
                                EN
                            </button>
                            <button
                                onClick={() => setPreviewLanguage('np')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    previewLanguage === 'np'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                नेपाली
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-8">
                        {/* Article Header */}
                        <div className="mb-8">
                            {/* Category Badge */}
                            {articleData.categoryId && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                        <FiTag className="w-3 h-3 mr-1" />
                                        Category
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {currentTitle || 'Article Title'}
                            </h1>

                            {/* Article Meta */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <FiUser className="w-4 h-4 mr-2" />
                                    <span>Author</span>
                                </div>
                                <div className="flex items-center">
                                    <FiCalendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(articleData.publishedAt)}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="w-4 h-4 mr-2" />
                                    <span>{getReadingTime(currentContent)}</span>
                                </div>
                            </div>

                            {/* Social Actions */}
                            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                    <FiShare2 className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                    <FiBookmark className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                    <FiHeart className="w-4 h-4" />
                                    <span>Like</span>
                                </button>
                            </div>
                        </div>

                        {/* Cover Image */}
                        {articleData.coverImagePreview && (
                            <div className="mb-8">
                                <img
                                    src={articleData.coverImagePreview}
                                    alt="Article cover"
                                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            {currentContent ? (
                                <div 
                                    className="text-gray-800 leading-relaxed [&_*]:text-justify-supported"
                                    dangerouslySetInnerHTML={{ __html: currentContent }}
                                    style={{
                                        textAlign: 'inherit'
                                    }}
                                />
                            ) : (
                                <div className="text-gray-500 italic text-center py-12">
                                    <FiEye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No content available for preview</p>
                                    <p className="text-sm">Start writing your article content to see the preview</p>
                                </div>
                            )}
                        </div>

                        {/* SEO Keywords */}
                        {articleData.seoKeywords && articleData.seoKeywords.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {articleData.seoKeywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                                        >
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Article Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this article</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <strong>URL Slug:</strong> {articleData.slug || 'Not set'}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> <span className="text-orange-600">Draft</span>
                                    </div>
                                    <div>
                                        <strong>Language:</strong> {previewLanguage === 'en' ? 'English' : 'नेपाली'}
                                    </div>
                                    <div>
                                        <strong>Word Count:</strong> {currentContent ? currentContent.replace(/<[^>]*>/g, '').split(/\s+/).length : 0} words
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Preview Mode • Changes are not saved automatically
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close Preview
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Continue Editing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPreview;
