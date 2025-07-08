import type { Collection, Media, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const token = getAuthToken();
    if (token) {
        headers['x-auth-token'] = token;
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000; // 1 second

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
                // Only retry for connection refused or generic fetch errors
                if (response.status === 0 || errorData.message === 'Failed to fetch') {
                    console.warn(`Attempt ${i + 1} failed for ${endpoint}. Retrying...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue; // Retry the request
                }
                throw new Error(errorData.message || 'API request failed');
            }

            return response.json();
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.warn(`Attempt ${i + 1} failed for ${endpoint} (network error). Retrying...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                continue; // Retry the request
            }
            throw error; // Re-throw other errors immediately
        }
    }
    throw new Error(`Failed to fetch ${endpoint} after ${MAX_RETRIES} retries.`);
}

// This function is kept for seeding purposes, but won't be used by the live app
export const getHomepageData = async (): Promise<Collection[]> => {
    const collections: Collection[] = [];

    // Fetch Featured content for the carousel
    const { media: featured } = await getBrowseMedia({ limit: 8, featured: true });
    if (featured.length > 0) {
        collections.push({ _id: 'featured', title: 'Featured', slug: 'featured', items: featured });
    }

    // Fetch Trending Now (using popular sort as a proxy)
    const { media: trending } = await getBrowseMedia({ limit: 8, sortBy: 'rating_desc' });
    if (trending.length > 0) {
        collections.push({ _id: 'trending', title: 'Trending Now 🔥', slug: 'trending-now', items: trending });
    }

    // Fetch Recently Added
    const { media: recent } = await getBrowseMedia({ limit: 8, sortBy: 'year_desc' });
    if (recent.length > 0) {
        collections.push({ _id: 'recent', title: 'Recently Added', slug: 'recently-added', items: recent });
    }

    // Fetch HOT Action Movies
    const { media: actionMovies } = await getBrowseMedia({ limit: 8, genre: 'Action' });
    if (actionMovies.length > 0) {
        collections.push({ _id: 'action', title: 'HOT Action Movies', slug: 'hot-action-movies', items: actionMovies });
    }

    // Fetch Critically Acclaimed TV
    const { media: acclaimedTv } = await getBrowseMedia({ limit: 8, type: 'tv-show', sortBy: 'rating_desc' });
    if (acclaimedTv.length > 0) {
        collections.push({ _id: 'acclaimed-tv', title: 'Critically Acclaimed TV', slug: 'critically-acclaimed-tv', items: acclaimedTv });
    }

    // Fetch Sci-Fi Worlds
    const { media: sciFiMovies } = await getBrowseMedia({ limit: 8, genre: 'Sci-Fi' });
    if (sciFiMovies.length > 0) {
        collections.push({ _id: 'sci-fi', title: 'Sci-Fi Worlds', slug: 'sci-fi-worlds', items: sciFiMovies });
    }

    // Fetch Midnight Horror Express
    const { media: horrorMovies } = await getBrowseMedia({ limit: 8, genre: 'Horror' });
    if (horrorMovies.length > 0) {
        collections.push({ _id: 'horror', title: 'Midnight Horror Express 🔪', slug: 'midnight-horror-express', items: horrorMovies });
    }

    // Fetch Romantic Love
    const { media: romanticMovies } = await getBrowseMedia({ limit: 8, genre: 'Romance' });
    if (romanticMovies.length > 0) {
        collections.push({ _id: 'romance', title: 'Romantic Love ❤️', slug: 'romantic-love', items: romanticMovies });
    }

    return collections;
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
