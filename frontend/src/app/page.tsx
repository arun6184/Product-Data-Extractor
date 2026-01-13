import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="text-center mb-16 animate-fade-in">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Explore World of Books
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Discover thousands of books with our powerful scraping platform.
                    Browse categories, search products, and find your next great read.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/categories" className="btn-primary">
                        Browse Categories
                    </Link>
                    <Link href="/products" className="btn-secondary">
                        View All Products
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="card p-6 text-center animate-slide-up">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Extensive Catalog
                    </h3>
                    <p className="text-gray-600">
                        Access thousands of books across multiple categories and genres.
                    </p>
                </div>

                <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="text-5xl mb-4">⚡</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Real-time Scraping
                    </h3>
                    <p className="text-gray-600">
                        On-demand scraping ensures you get the latest product information.
                    </p>
                </div>

                <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Smart Search
                    </h3>
                    <p className="text-gray-600">
                        Find exactly what you're looking for with advanced filtering.
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Exploring?</h2>
                <p className="text-lg mb-6 opacity-90">
                    Dive into our collection and discover your next favorite book.
                </p>
                <Link href="/categories" className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Started
                </Link>
            </section>
        </div>
    );
}
