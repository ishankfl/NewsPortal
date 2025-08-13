import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FiClock, FiUser, FiShare2, FiBookmark, FiHeart, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import { getArticleById, getRelatedArticles } from '../../../api/news-services';
import { getBanners } from '../../../api/banner-service';
import { imgServer } from '../../../api/server';
import TrendingNews from './TrendingNews';
import Advertisement from './Advertisement';
import { ViewersHeader } from '../../common/Header';
import { Footer } from '../../common/Footer';
import { useCategories } from '../../../providers/CategoriesProvider';

const SingleNewsPage = () => {
  const { id } = useParams();
  const { categories } = useCategories();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleRes, relatedRes, adsRes] = await Promise.all([
          getArticleById(id),
          getRelatedArticles(id, { pageSize: 4 }),
          getBanners(1, 3)
        ]);

        setArticle(articleRes.data);
        setRelatedNews(relatedRes.items || []);
        setAdvertisements(adsRes.data?.items || []);
        setLikeCount(articleRes.data?.likeCount || 0);
        setCommentCount(articleRes.data?.commentCount || 0);
      } catch (err) {
        console.error('Error fetching news data:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: Add API call to update like count
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Add API call to update bookmark status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center p-4">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-center p-4">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewersHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to News
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <Advertisement 
                advertisements={advertisements.filter(ad => ad.position === "Left Sidebar")}
                position="sidebar"
              />

              {/* Social Sharing */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Share this article</h3>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <FiShare2 className="w-4 h-4 text-gray-700" />
                  </button>
                  {/* Add more social sharing buttons as needed */}
                </div>
              </div>

              {/* Table of Contents (for long articles) */}
              {article.content && article.content.length > 2000 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Table of Contents</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {/* This would be dynamically generated from article headings */}
                    <a href="#section1" className="block hover:text-blue-600">Introduction</a>
                    <a href="#section2" className="block hover:text-blue-600">Key Findings</a>
                    <a href="#section3" className="block hover:text-blue-600">Conclusion</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.categoryId && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === article.categoryId)?.name_En || 'News'}
                    </span>
                  )}
                  {article.tags?.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {article.authorName && (
                      <div className="flex items-center space-x-2">
                        <FiUser className="w-4 h-4" />
                        <span>{article.authorName}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4" />
                      <span>{formatDate(article.publicationDatetime || article.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <FiHeart className="w-4 h-4" />
                      <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>{commentCount}</span>
                    </button>
                    <button 
                      onClick={handleBookmark}
                      className={`${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                      <FiBookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {article.imageUrl && (
                <div className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden">
                  <img
                    src={`${imgServer}${article.imageUrl}`}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {article.imageCaption && (
                    <div className="p-2 text-sm text-gray-500 text-center italic">
                      {article.imageCaption}
                    </div>
                  )}
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                {article.summary && (
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-lg font-medium text-gray-700 italic">
                      {article.summary}
                    </p>
                  </div>
                )}

                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {/* Article Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags?.map(tag => (
                      <span key={tag} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Views: {article.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={handleShare}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                      >
                        <FiShare2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related News</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.map(news => (
                    <div key={news.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        {news.imageUrl ? (
                          <img
                            src={`${imgServer}${news.imageUrl}`}
                            alt={news.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <span className="text-white text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {news.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <FiClock className="w-3 h-3 mr-1" />
                          <span>{formatDate(news.publicationDatetime || news.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({commentCount})</h2>
              <div className="space-y-4">
                {/* Comment form */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Share your thoughts..."
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                      Post Comment
                    </button>
                  </div>
                </div>

                {/* Comment list */}
                <div className="space-y-4">
                  {/* Sample comment - would be replaced with actual comments */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">John Doe</h4>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-gray-700 mt-1">This is a very informative article. Thanks for sharing!</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <button className="hover:text-blue-600">Reply</button>
                          <button className="hover:text-blue-600">Like (5)</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <TrendingNews trendingNews={relatedNews} />

              <Advertisement 
                advertisements={advertisements.filter(ad => ad.position === "Right Sidebar")}
                position="sidebar"
              />

              {/* Newsletter Signup */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-xs text-gray-600 mb-3">Get the latest news delivered to your inbox</p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Advertisement before footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Advertisement 
          advertisements={advertisements.filter(ad => ad.position === "Footer Banner")}
          position="banner"
        />
      </div>

      <Footer categories={categories} />
    </div>
  );
};

export default SingleNewsPage;