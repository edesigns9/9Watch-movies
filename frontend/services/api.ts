import type { Collection, Media, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (options.headers) {
        // The headers property in RequestInit can be a Headers object, a string[][], or a Record<string, string>.
        // We'll handle the Record<string, string> case for simplicity, but a more robust implementation would handle all cases.
        Object.assign(headers, options.headers);
    }

    const token = getAuthToken();
    if (token) {
        headers['x-auth-token'] = token;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

export const getHomepageData = async (): Promise<Collection[]> => {
    return apiFetch<Collection[]>('/media/homepage');
};

export const getBrowseMedia = async (filters: {
    featured?: boolean;
    genre?: string;
    type?: string;
    year?: number;
    query?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}): Promise<{ media: Media[], totalPages: number, currentPage: number }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 0) {
            params.append(key, String(value));
        }
    });
    return apiFetch(`/media/browse?${params.toString()}`);
};

export const getMediaDetails = async (id: string): Promise<Media | null> => {
    return apiFetch<Media | null>(`/media/${id}`);
};

export const getMyProfile = async (): Promise<User> => {
    return apiFetch<User>('/users/profile');
};

export const updateUserWatchHistory = async (mediaId: string, progress: number): Promise<void> => {
    return apiFetch('/users/history', {
        method: 'POST',
        body: JSON.stringify({ mediaId, progress }),
    });
};
