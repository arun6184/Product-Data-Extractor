'use client';

import CategoryCard from './CategoryCard';
import CategorySkeleton from '../loading/CategorySkeleton';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
    isLoading: boolean;
}

export default function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <CategorySkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No categories found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    );
}
