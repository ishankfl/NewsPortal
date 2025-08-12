import React, { useState, useEffect } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';

const Advertisement = ({ advertisements, position }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [closedAds, setClosedAds] = useState(new Set());

    // Filter active advertisements for the specific position
    const activeAds = advertisements?.filter(ad => 
        ad.isActive && !closedAds.has(ad.id)
    ) || [];

    // Auto-rotate ads if multiple ads are available
    useEffect(() => {
        if (activeAds.length > 1) {
            const interval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
            }, 8000); // Change ad every 8 seconds

            return () => clearInterval(interval);
        }
    }, [activeAds.length]);

    const closeAd = (adId) => {
        setClosedAds(prev => new Set([...prev, adId]));
        if (activeAds.length === 1) {
            setIsVisible(false);
        }
    };

    const handleAdClick = (ad) => {
        if (ad.linkUrl) {
            window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
        }
        // Track ad click analytics here if needed
    };

    if (!isVisible || activeAds.length === 0) {
        return null;
    }

    const currentAd = activeAds[currentAdIndex];

    // Different layouts based on position
    const renderBannerAd = () => (
        <div className="relative bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative">
                {/* Close button */}
                <button
                    onClick={() => closeAd(currentAd.id)}
                    className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all"
                >
                    <FiX className="w-4 h-4" />
                </button>

                {/* Ad content */}
                <div 
                    className="cursor-pointer group"
                    onClick={() => handleAdClick(currentAd)}
                >
                    {currentAd.imageUrl ? (
                        <img
                            src={currentAd.imageUrl}
                            alt={currentAd.title || 'Advertisement'}
                            className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-32 md:h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <div className="text-center text-white">
                                <h3 className="text-lg font-semibold">{currentAd.title}</h3>
                                {currentAd.description && (
                                    <p className="text-sm mt-1">{currentAd.description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Overlay content */}
                    {currentAd.imageUrl && (currentAd.title || currentAd.description) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <div className="text-white">
                                {currentAd.title && (
                                    <h3 className="text-lg font-semibold">{currentAd.title}</h3>
                                )}
                                {currentAd.description && (
                                    <p className="text-sm mt-1 opacity-90">{currentAd.description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* External link indicator */}
                    {currentAd.linkUrl && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                            <FiExternalLink className="w-3 h-3" />
                            <span>Ad</span>
                        </div>
                    )}
                </div>

                {/* Ad indicators */}
                {activeAds.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {activeAds.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentAdIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentAdIndex
                                        ? 'bg-white'
                                        : 'bg-white bg-opacity-50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderSidebarAd = () => (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
                {/* Ad label */}
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">ADVERTISEMENT</span>
                        <button
                            onClick={() => closeAd(currentAd.id)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Ad content */}
                <div 
                    className="p-4 cursor-pointer group"
                    onClick={() => handleAdClick(currentAd)}
                >
                    {currentAd.imageUrl ? (
                        <img
                            src={currentAd.imageUrl}
                            alt={currentAd.title || 'Advertisement'}
                            className="w-full h-40 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gradient-to-r from-green-500 to-blue-600 rounded flex items-center justify-center">
                            <div className="text-center text-white">
                                <h3 className="text-sm font-semibold">{currentAd.title}</h3>
                                {currentAd.description && (
                                    <p className="text-xs mt-1">{currentAd.description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Text content below image */}
                    {currentAd.imageUrl && (currentAd.title || currentAd.description) && (
                        <div className="mt-3">
                            {currentAd.title && (
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                    {currentAd.title}
                                </h3>
                            )}
                            {currentAd.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {currentAd.description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Call to action */}
                    {currentAd.linkUrl && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                <span>Learn More</span>
                                <FiExternalLink className="w-3 h-3" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Multiple ads indicator */}
                {activeAds.length > 1 && (
                    <div className="px-4 pb-3">
                        <div className="flex justify-center space-x-1">
                            {activeAds.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentAdIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentAdIndex
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Render based on position
    switch (position) {
        case 'banner':
            return renderBannerAd();
        case 'sidebar':
            return renderSidebarAd();
        default:
            return renderBannerAd();
    }
};

export default Advertisement;
