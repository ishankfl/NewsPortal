import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FiClock, FiUser, FiShare2, FiBookmark, FiHeart, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import { getArticleById, getRelatedArticles } from '../../../api/news-services';
import { imgServer } from '../../../api/server';
import TrendingNews from '../bannernews/TrendingNews';
import Advertisement from '../bannernews/Advertisement';
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
        title: article?.title,
        text: article?.summary,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Always show header */}
      <ViewersHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Always show back button */}
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
          {/* Left Sidebar - always show */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <Advertisement
                advertisements={advertisements.filter(ad => ad.position === "Left Sidebar")}
                position="sidebar"
              />

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Share this article</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    disabled={!article}
                  >
                    <FiShare2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {article?.content && article.content.length > 2000 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Table of Contents</h3>
                  <div className="space-y-2 text-sm text-gray-600">
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
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-red-600 mb-4">{error}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            ) : !article ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-600 mb-4">Article not found</div>
              </div>
            ) : (
              <>
                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Article content remains the same */}
                  {/* ... (keep all your existing article content JSX) */}
                </article>

                {/* Related News */}
                {relatedNews.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {relatedNews.map(news => (
                        <div key={news.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {/* ... (keep your related news item JSX) */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({commentCount})</h2>
                  {/* ... (keep your comments section JSX) */}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - always show */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <TrendingNews trendingNews={relatedNews} />

              <Advertisement
                advertisements={advertisements.filter(ad => ad.position === "Right Sidebar")}
                position="sidebar"
              />

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

      {/* Advertisement before footer - always show */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Advertisement
          advertisements={advertisements.filter(ad => ad.position === "Footer Banner")}
          position="banner"
        />
      </div>

      {/* Always show footer */}
      <Footer categories={categories} />
    </div>
  );
};

export default SingleNewsPage;