import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatPrice(price?: number): string {
    if (!price) return 'N/A';
    return `£${price.toFixed(2)}`;
}

export function formatRating(rating?: number): string {
    if (!rating) return 'No rating';
    return `${rating.toFixed(1)} / 5.0`;
}

export function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
