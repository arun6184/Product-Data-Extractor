'use client';

import { useSearchParams } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import CategoryGrid from '@/components/category/CategoryGrid';

export default function CategoriesPage() {
    const searchParams = useSearchParams();
    const navigationId = searchParams.get('navigationId') || undefined;
    const parentId = searchParams.get('parentId') || undefined;

    const { categories, isLoading, isError } = useCategories({ navigationId, parentId });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Categories</h1>
                <p className="text-gray-600">
                    Browse our collection of book categories
                </p>
            </div>

            {isError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    Failed to load categories. Please try again later.
                </div>
            )}

            <CategoryGrid categories={categories || []} isLoading={isLoading} />
        </div>
    );
}
