import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiEye, FiShare2, FiBookmark, FiTrendingUp } from 'react-icons/fi';
import './BannerNews.css';
import { getPublishedArticles } from '../../../api/news-services';
import { getCategories } from '../../../api/category-services';
import { getBanners } from '../../../api/banner-service';
import BannerSlider from './BannerSlider';
import CategoryNews from './CategoryNews';
import TrendingNews from './TrendingNews';
import Advertisement from './Advertisement';
import { demoArticles, demoCategories, demoAdvertisements } from './demoData';

const BannerNewsPage = () => {
    const [bannerNews, setBannerNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trendingNews, setTrendingNews] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Fetch banner news
    const fetchBannerNews = async () => {
        try {
            const response = await getPublishedArticles({ page: 1, pageSize: 5 });
            setBannerNews(response.articles || []);
        } catch (error) {
            console.error('Error fetching banner news:', error);
            // Fallback to demo data
            setBannerNews(demoArticles.slice(0, 5));
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            console.log("Response",response);
            setCategories(response || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to demo data
            setCategories(demoCategories);
        }
    };

    // Fetch trending news
    const fetchTrendingNews = async () => {
        try {
            const response = await getPublishedArticles({ page: 1, pageSize: 10 });
            setTrendingNews(response.articles || []);
        } catch (error) {
            console.error('Error fetching trending news:', error);
            // Fallback to demo data
            setTrendingNews(demoArticles);
        }
    };

    // Fetch advertisements
    const fetchAdvertisements = async () => {
        try {
            const response = await getBanners(1, 5);
            setAdvertisements(response.data?.items || []);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
            // Fallback to demo data
            setAdvertisements(demoAdvertisements);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchBannerNews(),
                fetchCategories(),
                fetchTrendingNews(),
                fetchAdvertisements()
            ]);
            setLoading(false);
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md border-b">
                {/* Top Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Brand */}
                        <div className="flex items-center space-x-4">
                            <img
                                src="/images/logo.jpg"
                                alt="Paile Tech Logo"
                                className="max-w-[80px] max-h-[80px] object-contain rounded-md shadow-sm"
                            />
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                पाइला <span className="text-blue-600">Tech</span>
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-6">
                            {categories.map((item) => (
                                <a
                                    key={item.id}
                                    href="#"
                                    className="relative text-gray-700 font-medium text-base transition duration-300 hover:text-blue-600 
                       after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 
                       after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {item.name_Np}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cover Advertisement Banner */}
                <div className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-center py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-lg md:text-xl font-semibold">
                            📢 Exclusive: Get the Latest News & Updates — Stay Ahead with Paile Tech!
                        </h2>
                    </div>
                </div>
            </header>



            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Banner Slider */}
                        <BannerSlider bannerNews={bannerNews} />

                        {/* Advertisement Banner */}
                        <div className="my-8">
                            <Advertisement
                                advertisements={advertisements.filter(ad => ad.position === 'Header Banner')}
                                position="banner"
                            />
                        </div>

                        {/* Category Navigation */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    All News
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category-wise News */}
                        <CategoryNews
                            selectedCategory={selectedCategory}
                            categories={categories}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Trending News */}
                        <TrendingNews trendingNews={trendingNews} />

                        {/* Sidebar Advertisement */}
                        <div className="mt-8">
                            <Advertisement
                                advertisements={advertisements.filter(ad => ad.position === 'Sidebar')}
                                position="sidebar"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">News Portal</h3>
                            <p className="text-gray-300">Your trusted source for latest news and updates.</p>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">Categories</h4>
                            <ul className="space-y-2">
                                {categories.slice(0, 5).map((category) => (
                                    <li key={category.id}>
                                        <a href="#" className="text-gray-300 hover:text-white">{category.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-300">&copy; 2025 News Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BannerNewsPage;
