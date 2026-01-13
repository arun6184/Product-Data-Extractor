'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId') || undefined;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 20;

    const { products, pagination, isLoading, isError } = useProducts({
        categoryId,
        page,
        limit,
        search: search || undefined,
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
                <p className="text-gray-600">
                    Discover books from World of Books
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field flex-1"
                        />
                        <button type="submit" className="btn-primary">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {isError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    Failed to load products. Please try again later.
                </div>
            )}

            <ProductGrid products={products || []} isLoading={isLoading} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-700">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
