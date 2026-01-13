import useSWR from 'swr';
import { api, endpoints } from '@/lib/api';
import type { Product, PaginatedResponse, ProductDetail, Review } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useProducts(params?: {
    categoryId?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}) {
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
        endpoints.products.getAll(params),
        fetcher
    );

    return {
        products: data?.data,
        pagination: {
            total: data?.total || 0,
            page: data?.page || 1,
            limit: data?.limit || 20,
            totalPages: data?.totalPages || 0,
        },
        isLoading,
        isError: error,
        mutate,
    };
}

export function useProduct(id: string) {
    const { data, error, isLoading } = useSWR<Product>(
        id ? endpoints.products.getOne(id) : null,
        fetcher
    );

    return {
        product: data,
        isLoading,
        isError: error,
    };
}

export function useProductDetail(productId: string) {
    const { data, error, isLoading } = useSWR<ProductDetail>(
        productId ? endpoints.products.getDetails(productId) : null,
        fetcher
    );

    return {
        detail: data,
        isLoading,
        isError: error,
    };
}

export function useProductReviews(productId: string) {
    const { data, error, isLoading } = useSWR<Review[]>(
        productId ? endpoints.products.getReviews(productId) : null,
        fetcher
    );

    return {
        reviews: data,
        isLoading,
        isError: error,
    };
}
