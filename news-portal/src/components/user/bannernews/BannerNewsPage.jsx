import React, { useState, useEffect } from "react";
import { getAllArticles, getPublishedArticles } from "../../../api/news-services";
import { getBanners } from "../../../api/banner-service";
import BannerSlider from "./BannerSlider";
import CategoryNews from "./CategoryNews";
import TrendingNews from "./TrendingNews";
import Advertisement from "./Advertisement";
import { demoArticles, demoAdvertisements } from "./demoData";
// import { useCategories } from "../../context/CategoriesProvider"; // <-- use context here
import { useCategories } from "../../../providers/CategoriesProvider";
import { ViewersHeader } from "../../common/Header";
import { Footer } from "../../common/Footer";
const BannerNewsPage = () => {
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const [bannerNews, setBannerNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchBannerNews = async () => {
    try {
      const response = await getAllArticles({ page: 1, pageSize: 4 });
      setBannerNews(response.items || []);
    } catch (error) {
      console.error("Error fetching banner news:", error);
      setBannerNews(demoArticles.slice(0, 5));
    }
  };

  const fetchTrendingNews = async () => {
    try {
      const response = await getAllArticles({ page: 1, pageSize: 3 });
      console.log("Fetching trending news", response)
      setTrendingNews(response.items || []);
    } catch (error) {
      console.error("Error fetching trending news:", error);
      setTrendingNews(demoArticles);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await getBanners(1, 5);
      setAdvertisements(response.data?.items || []);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setAdvertisements(demoAdvertisements);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchBannerNews(), fetchTrendingNews(), fetchAdvertisements()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (categoriesError) {
    return <div className="text-red-600 text-center p-4">Failed to load categories.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can keep ViewersHeader separate or inside this page */}
      <ViewersHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BannerSlider bannerNews={bannerNews} />

            <div className="my-8">
              <Advertisement
                advertisements={advertisements.filter((ad) => ad.position === "Header Banner")}
                position="banner"
              />
            </div>

            {/* Category Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All News
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name_Np || category.name}
                  </button>
                ))}
              </div>
            </div>

            <CategoryNews selectedCategory={selectedCategory} categories={categories} />
          </div>

          <div className="lg:col-span-1">
            <TrendingNews trendingNews={trendingNews} />

            <div className="mt-8">
              <Advertisement
                advertisements={advertisements.filter((ad) => ad.position === "Sidebar")}
                position="sidebar"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer... */}
      <Footer categories={categories}/>
    </div>
  );
};

export default BannerNewsPage;
