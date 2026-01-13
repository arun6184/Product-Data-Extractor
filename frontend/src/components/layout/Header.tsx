import Link from 'next/link';
import NavigationMenu from '@/components/navigation/NavigationMenu';

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
                        📚 World of Books Explorer
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Categories
                        </Link>
                        <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Products
                        </Link>
                        <Link href="/history" className="text-gray-700 hover:text-primary-600 transition-colors">
                            History
                        </Link>
                    </nav>
                </div>

                <NavigationMenu />
            </div>
        </header>
    );
}
