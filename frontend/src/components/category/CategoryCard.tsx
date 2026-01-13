'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/products?categoryId=${category.id}`} className="block">
            <div className="card overflow-hidden group">
                {category.imageUrl && (
                    <div className="relative h-48 bg-gray-100">
                        <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                    </h3>

                    {category.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {category.description}
                        </p>
                    )}

                    {category.productCount > 0 && (
                        <p className="text-xs text-gray-500 mt-3">
                            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
