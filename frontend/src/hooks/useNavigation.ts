import useSWR from 'swr';
import { api, endpoints } from '@/lib/api';
import type { Navigation } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useNavigation() {
    const { data, error, isLoading, mutate } = useSWR<Navigation[]>(
        endpoints.navigation.getAll(),
        fetcher
    );

    return {
        navigation: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useNavigationItem(id: string) {
    const { data, error, isLoading } = useSWR<Navigation>(
        id ? endpoints.navigation.getOne(id) : null,
        fetcher
    );

    return {
        navigation: data,
        isLoading,
        isError: error,
    };
}
