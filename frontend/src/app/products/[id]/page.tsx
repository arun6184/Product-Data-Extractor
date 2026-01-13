'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useProduct, useProductDetail, useProductReviews } from '@/hooks/useProducts';
import { useHistory } from '@/hooks/useHistory';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const { product, isLoading: productLoading } = useProduct(productId);
    const { detail, isLoading: detailLoading } = useProductDetail(productId);
    const { reviews } = useProductReviews(productId);
    const { addToHistory } = useHistory();

    // Add to browsing history
    useEffect(() => {
        if (product) {
            addToHistory('product', product.id, product.title, product.url, product.imageUrl);
        }
    }, [product, addToHistory]);

    if (productLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="skeleton h-12 w-3/4" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="skeleton h-96" />
                        <div className="space-y-4">
                            <div className="skeleton h-8 w-1/2" />
                            <div className="skeleton h-6 w-full" />
                            <div className="skeleton h-6 w-full" />
                            <div className="skeleton h-12 w-1/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Product Image */}
                <div className="card p-6">
                    <div className="relative aspect-[3/4] mb-4">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300 text-9xl">
                                📖
                            </div>
                        )}
                    </div>

                    {detail?.images && detail.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {detail.images.slice(1, 5).map((img, idx) => (
                                <div key={idx} className="relative aspect-square">
                                    <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover rounded" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                    {product.author && (
                        <p className="text-lg text-gray-700 mb-4">by {product.author}</p>
                    )}

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                <span className="text-yellow-500 text-xl">★</span>
                                <span className="text-lg font-semibold ml-1">{product.rating.toFixed(1)}</span>
                            </div>
                            {product.reviewCount > 0 && (
                                <span className="text-gray-600">({product.reviewCount} reviews)</span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-6">
                        {product.price && (
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-bold text-primary-600">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="text-2xl text-gray-500 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                            SAVE {formatPrice(product.originalPrice - product.price)}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Condition */}
                    {product.condition && (
                        <div className="mb-4">
                            <span className="text-sm text-gray-700 font-semibold">Condition:</span>
                            <span className="ml-2 text-sm text-gray-600">{product.condition}</span>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.inStock ? (
                            <span className="text-green-600 font-semibold">✓ In Stock</span>
                        ) : (
                            <span className="text-red-600 font-semibold">✗ Out of Stock</span>
                        )}
                    </div>

                    {/* Description */}
                    {detail?.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{detail.description}</p>
                        </div>
                    )}

                    {/* Product Details */}
                    <div className="card p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                        <dl className="space-y-2 text-sm">
                            {product.isbn && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">ISBN:</dt>
                                    <dd className="text-gray-700">{product.isbn}</dd>
                                </div>
                            )}
                            {detail?.publisher && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">Publisher:</dt>
                                    <dd className="text-gray-700">{detail.publisher}</dd>
                                </div>
                            )}
                            {detail?.publicationDate && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">Published:</dt>
                                    <dd className="text-gray-700">{detail.publicationDate}</dd>
                                </div>
                            )}
                            {detail?.language && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">Language:</dt>
                                    <dd className="text-gray-700">{detail.language}</dd>
                                </div>
                            )}
                            {detail?.pages && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">Pages:</dt>
                                    <dd className="text-gray-700">{detail.pages}</dd>
                                </div>
                            )}
                            {detail?.format && (
                                <div className="flex">
                                    <dt className="font-semibold w-32">Format:</dt>
                                    <dd className="text-gray-700">{detail.format}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="card p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    {review.reviewerName && (
                                        <span className="text-sm text-gray-700 font-semibold">{review.reviewerName}</span>
                                    )}
                                    {review.reviewDate && (
                                        <span className="text-xs text-gray-500">{review.reviewDate}</span>
                                    )}
                                </div>
                                {review.title && (
                                    <h4 className="font-semibold mb-2">{review.title}</h4>
                                )}
                                {review.content && (
                                    <p className="text-gray-700">{review.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
