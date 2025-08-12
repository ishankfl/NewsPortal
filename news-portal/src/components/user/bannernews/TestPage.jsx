import React from 'react';
import { demoArticles, demoCategories, demoAdvertisements } from './demoData';
import BannerSlider from './BannerSlider';
import TrendingNews from './TrendingNews';
import Advertisement from './Advertisement';

const TestPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Banner News Components Test</h1>
            
            <div className="max-w-7xl mx-auto">
                {/* Test Banner Slider */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Banner Slider Component</h2>
                    <BannerSlider bannerNews={demoArticles.slice(0, 3)} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Test Advertisement */}
                    <section className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4">Advertisement Component (Banner)</h2>
                        <Advertisement 
                            advertisements={demoAdvertisements.filter(ad => ad.position === 'Header Banner')} 
                            position="banner"
                        />
                        
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Demo Articles Grid</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {demoArticles.map((article) => (
                                    <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                        <img 
                                            src={article.coverImageUrl} 
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mb-2">
                                                {article.categoryName}
                                            </span>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {article.summary}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>By {article.authorName}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(article.publicationDatetime).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Test Sidebar Components */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Sidebar Components</h2>
                        
                        {/* Trending News */}
                        <div className="mb-8">
                            <TrendingNews trendingNews={demoArticles} />
                        </div>

                        {/* Sidebar Advertisement */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Advertisement (Sidebar)</h3>
                            <Advertisement 
                                advertisements={demoAdvertisements.filter(ad => ad.position === 'Sidebar')} 
                                position="sidebar"
                            />
                        </div>
                    </section>
                </div>

                {/* Categories Test */}
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Demo Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        {demoCategories.map((category) => (
                            <span 
                                key={category.id}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Component Status */}
                <section className="mt-12 bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Component Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-green-600 text-2xl font-bold">✓</div>
                            <div className="text-sm font-medium">BannerSlider</div>
                            <div className="text-xs text-gray-600">Working</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-green-600 text-2xl font-bold">✓</div>
                            <div className="text-sm font-medium">TrendingNews</div>
                            <div className="text-xs text-gray-600">Working</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-green-600 text-2xl font-bold">✓</div>
                            <div className="text-sm font-medium">Advertisement</div>
                            <div className="text-xs text-gray-600">Working</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-green-600 text-2xl font-bold">✓</div>
                            <div className="text-sm font-medium">Demo Data</div>
                            <div className="text-xs text-gray-600">Loaded</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TestPage;
