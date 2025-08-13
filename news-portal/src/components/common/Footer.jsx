export const Footer = ({categories}) => {
    {/* Footer */ }
    return (<footer className="bg-gray-800 text-white py-12">
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
    </footer>)
}