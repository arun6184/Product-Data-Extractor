import useSWR from 'swr';
import { api, endpoints } from '@/lib/api';
import type { Category } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useCategories(params?: { navigationId?: string; parentId?: string }) {
    const { data, error, isLoading, mutate } = useSWR<Category[]>(
        endpoints.categories.getAll(params),
        fetcher
    );

    return {
        categories: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useCategory(id: string) {
    const { data, error, isLoading } = useSWR<Category>(
        id ? endpoints.categories.getOne(id) : null,
        fetcher
    );

    return {
        category: data,
        isLoading,
        isError: error,
    };
}

export function useSubcategories(parentId: string) {
    const { data, error, isLoading } = useSWR<Category[]>(
        parentId ? endpoints.categories.getSubcategories(parentId) : null,
        fetcher
    );

    return {
        subcategories: data,
        isLoading,
        isError: error,
    };
}
