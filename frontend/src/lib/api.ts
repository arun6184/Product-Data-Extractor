import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API endpoints
export const endpoints = {
    // Navigation
    navigation: {
        getAll: () => '/navigation',
        getOne: (id: string) => `/navigation/${id}`,
        scrape: () => '/navigation/scrape',
    },

    // Categories
    categories: {
        getAll: (params?: { navigationId?: string; parentId?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return `/categories${query ? `?${query}` : ''}`;
        },
        getOne: (id: string) => `/categories/${id}`,
        getSubcategories: (id: string) => `/categories/${id}/subcategories`,
        scrape: (navigationUrl: string, navigationId: string) =>
            `/categories/scrape?navigationUrl=${navigationUrl}&navigationId=${navigationId}`,
    },

    // Products
    products: {
        getAll: (params?: {
            categoryId?: string;
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
            sortOrder?: 'ASC' | 'DESC';
        }) => {
            const query = new URLSearchParams(params as any).toString();
            return `/products${query ? `?${query}` : ''}`;
        },
        getOne: (id: string) => `/products/${id}`,
        getDetails: (id: string) => `/products/${id}/details`,
        getReviews: (id: string) => `/products/${id}/reviews`,
        scrape: () => '/products/scrape',
        scrapeDetails: (id: string) => `/products/${id}/scrape-details`,
    },

    // History
    history: {
        getAll: (sessionId: string, limit?: number) =>
            `/history?sessionId=${sessionId}${limit ? `&limit=${limit}` : ''}`,
        create: () => '/history',
        delete: (id: string) => `/history/${id}`,
        clearSession: (sessionId: string) => `/history/session/${sessionId}`,
    },
};

export default api;
