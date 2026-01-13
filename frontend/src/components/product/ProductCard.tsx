'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const discount = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link href={`/products/${product.id}`} className="block">
            <div className="card overflow-hidden group h-full">
                <div className="relative h-64 bg-gray-100">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
                            📖
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{discount}%
                        </div>
                    )}

                    {!product.inStock && (
                        <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                            Out of Stock
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                        {product.title}
                    </h3>

                    {product.author && (
                        <p className="text-xs text-gray-600 mb-2">by {product.author}</p>
                    )}

                    <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-2">
                            {product.rating && (
                                <div className="flex items-center">
                                    <span className="text-yellow-500 text-sm">★</span>
                                    <span className="text-sm text-gray-700 ml-1">{product.rating.toFixed(1)}</span>
                                </div>
                            )}
                            {product.reviewCount > 0 && (
                                <span className="text-xs text-gray-500">({product.reviewCount})</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {product.price && (
                                <span className="text-lg font-bold text-primary-600">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                            {product.originalPrice && product.originalPrice > (product.price || 0) && (
                                <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        {product.condition && (
                            <p className="text-xs text-gray-500 mt-1">Condition: {product.condition}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
