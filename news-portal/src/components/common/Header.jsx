// import { getCategories } from '../../../api/category-services';
import { useState } from "react";
import { getCategories } from "../../api/category-services";
import { useEffect } from "react";
export const ViewersHeader = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            console.log("Response", response);
            setCategories(response || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to demo data
            // setCategories(demoCategories);
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                // fetchBannerNews(),
                fetchCategories(),
                // fetchTrendingNews(),
                // fetchAdvertisements()
            ]);
            setLoading(false);
        };

        fetchAllData();
    }, []);
    return (
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

                    {/* Header Advertisement */}
                    <div className="hidden md:block flex-1 mx-8">
                        <div className="bg-gray-100 border border-gray-300 rounded-lg h-16 flex items-center justify-center text-gray-600 text-lg font-medium">
                            📰 Advertisement Banner
                        </div>
                    </div>

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

            {/* Category Navigation Bar */}
            <div className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="hidden md:flex space-x-6 justify-center">
                        {categories.map((item) => (
                            <a
                                key={item.id}
                                href="#"
                                className="relative text-white font-medium text-base transition duration-300 hover:text-yellow-300 
                       after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 
                       after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {item.name_Np}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </header>)

}