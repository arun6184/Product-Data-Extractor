'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useHistory } from '@/hooks/useHistory';

export default function HistoryPage() {
    const { history, isLoading, removeFromHistory, clearHistory } = useHistory(50);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton h-24" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Browsing History</h1>
                    <p className="text-gray-600">
                        {history && history.length > 0
                            ? `${history.length} ${history.length === 1 ? 'item' : 'items'} in your history`
                            : 'No items in your history yet'}
                    </p>
                </div>

                {history && history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {!history || history.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📜</div>
                    <p className="text-gray-500 text-lg mb-6">
                        Your browsing history is empty
                    </p>
                    <Link href="/products" className="btn-primary">
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="card p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
                            {item.imageUrl && (
                                <div className="relative h-24 w-20 flex-shrink-0">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <Link
                                    href={item.url || `/products/${item.entityId}`}
                                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 block truncate"
                                >
                                    {item.title}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                    Viewed {new Date(item.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(item.createdAt).toLocaleTimeString()}
                                </p>
                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    {item.entityType}
                                </span>
                            </div>

                            <button
                                onClick={() => removeFromHistory(item.id)}
                                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                aria-label="Remove from history"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
