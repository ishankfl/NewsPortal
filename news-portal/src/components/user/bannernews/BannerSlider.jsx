import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FiChevronLeft, FiChevronRight, FiClock, FiUser } from 'react-icons/fi';
import { imgServer } from '../../../api/server';
import { useNavigate } from 'react-router-dom'; // Add this import

const BannerSlider = ({ bannerNews }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const [currentSlide, setCurrentSlide] = useState(0);
    console.log("BannerSlide", bannerNews);
    const handleReadMore = (newsId) => {
        navigate(`/news/${newsId}`); // Navigate to the single news view page
    };
    // Auto-slide functionality
    useEffect(() => {
        if (bannerNews.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % bannerNews.length);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [bannerNews.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerNews.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerNews.length) % bannerNews.length);
    const goToSlide = (index) => setCurrentSlide(index);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!bannerNews || bannerNews.length === 0) {
        return (
            <div className="relative h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No banner news available</p>
            </div>
        );
    }

    return (
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg mb-8">
            {/* Main Slider */}
            <div className="relative h-full">
                {bannerNews.map((news, index) => (
                    <div
                        key={news.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {news.imageUrl ? (
                                <img
                                    src={`${imgServer}${news.imageUrl}`}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex items-end">
                            <div className="p-6 md:p-8 text-white max-w-4xl">
                                {/* Category Badge */}
                                {news.categoryName && (
                                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                                        {news.categoryName}
                                    </span>
                                )}

                                {/* Title (Rich Text) */}
                                <h1
                                    className="text-2xl md:text-4xl font-bold mb-4 leading-tight"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.title) }}
                                ></h1>

                                {/* Summary (Rich Text) */}
                                {news.summary && (
                                    <p
                                        className="text-lg md:text-xl text-gray-200 mb-4 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.summary) }}
                                    ></p>
                                )}

                                {/* Meta Information */}
                                <div className="flex items-center space-x-6 text-sm text-gray-300">
                                    {news.authorName && (
                                        <div className="flex items-center space-x-2">
                                            <FiUser className="w-4 h-4" />
                                            <span>By {news.authorName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <FiClock className="w-4 h-4" />
                                        <span>{formatDate(news.publicationDatetime || news.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Read More Button */}
                                <button
                                    onClick={() => handleReadMore(news.id)}
                                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Read Full Story
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {bannerNews.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                    >
                        <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                    >
                        <FiChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {bannerNews.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {bannerNews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
                        />
                    ))}
                </div>
            )}

            {/* Thumbnail Navigation */}
            {bannerNews.length > 1 && (
                <div className="hidden lg:block absolute right-4 top-4 space-y-2">
                    {bannerNews.slice(0, 4).map((news, index) => (
                        <button
                            key={news.id}
                            onClick={() => goToSlide(index)}
                            className={`block w-20 h-16 rounded overflow-hidden border-2 transition-all ${index === currentSlide ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            {news.imageUrl ? (
                                <img
                                    src={`${imgServer}${news.imageUrl}`}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerSlider;
