// Navigation
export interface Navigation {
    id: string;
    name: string;
    url: string;
    position: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastScrapedAt?: string;
}

// Category
export interface Category {
    id: string;
    name: string;
    slug: string;
    url: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    navigationId?: string;
    productCount: number;
    createdAt: string;
    updatedAt: string;
    lastScrapedAt?: string;
    children?: Category[];
    products?: Product[];
}

// Product
export interface Product {
    id: string;
    sku: string;
    title: string;
    url: string;
    imageUrl?: string;
    price?: number;
    originalPrice?: number;
    condition?: string;
    inStock: boolean;
    author?: string;
    isbn?: string;
    rating?: number;
    reviewCount: number;
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
    lastScrapedAt?: string;
    category?: Category;
    detail?: ProductDetail;
}

// Product Detail
export interface ProductDetail {
    id: string;
    productId: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    language?: string;
    pages?: number;
    format?: string;
    dimensions?: string;
    weight?: string;
    images?: string[];
    specifications?: Record<string, any>;
    relatedProducts?: string[];
    detailedConditionNotes?: string;
    createdAt: string;
    updatedAt: string;
    lastScrapedAt?: string;
}

// Review
export interface Review {
    id: string;
    productId: string;
    reviewerName?: string;
    rating: number;
    title?: string;
    content?: string;
    reviewDate?: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
}

// View History
export interface ViewHistory {
    id: string;
    sessionId: string;
    entityType: string;
    entityId: string;
    title: string;
    url?: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
