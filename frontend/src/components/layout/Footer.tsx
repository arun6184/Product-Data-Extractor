export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">📚 World of Books Explorer</h3>
                        <p className="text-sm">
                            Explore and discover books from World of Books with our powerful scraping platform.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="hover:text-primary-400 transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/categories" className="hover:text-primary-400 transition-colors">
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a href="/products" className="hover:text-primary-400 transition-colors">
                                    Products
                                </a>
                            </li>
                            <li>
                                <a href="/history" className="hover:text-primary-400 transition-colors">
                                    Browsing History
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">About</h4>
                        <p className="text-sm">
                            Built with Next.js, NestJS, and Crawlee for educational purposes.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                    <p>&copy; {currentYear} World of Books Explorer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
