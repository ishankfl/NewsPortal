import { useCategories } from "../../context/CategoryContext";

export const ViewersHeader = () => {
    const { categories, loading } = useCategories();

    if (loading) {
        return <div className="bg-gray-200 text-center py-3">Loading categories...</div>;
    }

    return (
        <header>
            {/* your header code */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 py-3">
                <div className="max-w-7xl mx-auto px-4">
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
        </header>
    );
};
