'use client';

import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation';

export default function NavigationMenu() {
    const { navigation, isLoading, isError } = useNavigation();

    if (isLoading) {
        return (
            <div className="py-3 border-t">
                <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton  h-6 w-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !navigation || navigation.length === 0) {
        return null;
    }

    return (
        <div className="py-3 border-t overflow-x-auto">
            <nav className="flex space-x-6">
                {navigation.map((item) => (
                    <Link
                        key={item.id}
                        href={`/categories?navigationId=${item.id}`}
                        className="text-sm text-gray-600 hover:text-primary-600 whitespace-nowrap transition-colors font-medium"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
