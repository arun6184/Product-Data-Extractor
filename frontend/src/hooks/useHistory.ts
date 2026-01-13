import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api, endpoints } from '@/lib/api';
import { getSessionId } from '@/lib/utils';
import type { ViewHistory } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useHistory(limit?: number) {
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    const { data, error, isLoading, mutate } = useSWR<ViewHistory[]>(
        sessionId ? endpoints.history.getAll(sessionId, limit) : null,
        fetcher
    );

    const addToHistory = async (
        entityType: string,
        entityId: string,
        title: string,
        url?: string,
        imageUrl?: string,
        metadata?: Record<string, any>
    ) => {
        if (!sessionId) return;

        try {
            await api.post(endpoints.history.create(), {
                sessionId,
                entityType,
                entityId,
                title,
                url,
                imageUrl,
                metadata,
            });
            mutate();
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    };

    const removeFromHistory = async (id: string) => {
        try {
            await api.delete(endpoints.history.delete(id));
            mutate();
        } catch (error) {
            console.error('Failed to remove from history:', error);
        }
    };

    const clearHistory = async () => {
        if (!sessionId) return;

        try {
            await api.delete(endpoints.history.clearSession(sessionId));
            mutate();
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    return {
        history: data,
        isLoading,
        isError: error,
        addToHistory,
        removeFromHistory,
        clearHistory,
        mutate,
    };
}
