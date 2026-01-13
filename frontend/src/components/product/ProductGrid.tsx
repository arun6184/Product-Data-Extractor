'use client';

import ProductCard from './ProductCard';
import ProductSkeleton from '../loading/ProductSkeleton';
import type { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
