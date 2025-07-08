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

// This function is kept for seeding purposes, but won't be used by the live app
export const getHomepageData = async (): Promise<Collection[]> => {
    const collections: Collection[] = [];
    const itemLimit = 15; // Increased limit for more items per row

    // Fetch Featured content for the carousel
    const { media: featured } = await getBrowseMedia({ limit: itemLimit, featured: true });
    if (featured.length > 0) {
        collections.push({ _id: 'featured', title: 'Featured', slug: 'featured', items: featured });
    }

    // Fetch Trending Now (using popular sort as a proxy)
    const { media: trending } = await getBrowseMedia({ limit: itemLimit, sortBy: 'rating_desc' });
    if (trending.length > 0) {
        collections.push({ _id: 'trending', title: 'Trending Now 🔥', slug: 'trending-now', items: trending });
    }

    // Fetch Recently Added
    const { media: recent } = await getBrowseMedia({ limit: itemLimit, sortBy: 'year_desc' });
    if (recent.length > 0) {
        collections.push({ _id: 'recent', title: 'Recently Added', slug: 'recently-added', items: recent });
    }

    // Fetch HOT Action Movies
    const { media: actionMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Action' });
    if (actionMovies.length > 0) {
        collections.push({ _id: 'action', title: 'HOT Action Movies', slug: 'hot-action-movies', items: actionMovies });
    }

    // Fetch Critically Acclaimed TV
    const { media: acclaimedTv } = await getBrowseMedia({ limit: itemLimit, type: 'tv-show', sortBy: 'rating_desc' });
    if (acclaimedTv.length > 0) {
        collections.push({ _id: 'acclaimed-tv', title: 'Critically Acclaimed TV', slug: 'critically-acclaimed-tv', items: acclaimedTv });
    }

    // Fetch Sci-Fi Worlds
    const { media: sciFiMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Sci-Fi' });
    if (sciFiMovies.length > 0) {
        collections.push({ _id: 'sci-fi', title: 'Sci-Fi Worlds', slug: 'sci-fi-worlds', items: sciFiMovies });
    }

    // Fetch Midnight Horror Express
    const { media: horrorMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Horror' });
    if (horrorMovies.length > 0) {
        collections.push({ _id: 'horror', title: 'Midnight Horror Express 🔪', slug: 'midnight-horror-express', items: horrorMovies });
    }

    // Fetch Romantic Love
    const { media: romanticMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Romance' });
    if (romanticMovies.length > 0) {
        collections.push({ _id: 'romance', title: 'Romantic Love ❤️', slug: 'romantic-love', items: romanticMovies });
    }

    // Fetch Drama
    const { media: dramaMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Drama' });
    if (dramaMovies.length > 0) {
        collections.push({ _id: 'drama', title: 'Drama', slug: 'drama', items: dramaMovies });
    }

    // Fetch Thriller
    const { media: thrillerMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Thriller' });
    if (thrillerMovies.length > 0) {
        collections.push({ _id: 'thriller', title: 'Thriller', slug: 'thriller', items: thrillerMovies });
    }

    // Fetch Documentary
    const { media: documentaryMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Documentary' });
    if (documentaryMovies.length > 0) {
        collections.push({ _id: 'documentary', title: 'Documentary', slug: 'documentary', items: documentaryMovies });
    }

    // Fetch Comedy
    const { media: comedyMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Comedy' });
    if (comedyMovies.length > 0) {
        collections.push({ _id: 'comedy', title: 'Comedy', slug: 'comedy', items: comedyMovies });
    }

    // Fetch Fantasy
    const { media: fantasyMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Fantasy' });
    if (fantasyMovies.length > 0) {
        collections.push({ _id: 'fantasy', title: 'Fantasy', slug: 'fantasy', items: fantasyMovies });
    }

    // Fetch Adventure
    const { media: adventureMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Adventure' });
    if (adventureMovies.length > 0) {
        collections.push({ _id: 'adventure', title: 'Adventure', slug: 'adventure', items: adventureMovies });
    }

    // Fetch History
    const { media: historyMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'History' });
    if (historyMovies.length > 0) {
        collections.push({ _id: 'history', title: 'History', slug: 'history', items: historyMovies });
    }

    // Fetch War
    const { media: warMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'War' });
    if (warMovies.length > 0) {
        collections.push({ _id: 'war', title: 'War', slug: 'war', items: warMovies });
    }

    // Fetch Crime
    const { media: crimeMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Crime' });
    if (crimeMovies.length > 0) {
        collections.push({ _id: 'crime', title: 'Crime', slug: 'crime', items: crimeMovies });
    }

    // Fetch Reality (assuming 'Reality' is a genre or type)
    const { media: realityShows } = await getBrowseMedia({ limit: itemLimit, genre: 'Reality' });
    if (realityShows.length > 0) {
        collections.push({ _id: 'reality', title: 'Reality', slug: 'reality', items: realityShows });
    }

    // Fetch Sport (assuming 'Sport' is a genre or type)
    const { media: sportMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Sport' });
    if (sportMovies.length > 0) {
        collections.push({ _id: 'sport', title: 'Sport', slug: 'sport', items: sportMovies });
    }

    // Fetch Mystery
    const { media: mysteryMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Mystery' });
    if (mysteryMovies.length > 0) {
        collections.push({ _id: 'mystery', title: 'Mystery', slug: 'mystery', items: mysteryMovies });
    }

    // Fetch Cyberpunk (assuming 'Cyberpunk' is a genre or type)
    const { media: cyberpunkMovies } = await getBrowseMedia({ limit: itemLimit, genre: 'Cyberpunk' });
    if (cyberpunkMovies.length > 0) {
        collections.push({ _id: 'cyberpunk', title: 'Cyberpunk', slug: 'cyberpunk', items: cyberpunkMovies });
    }

    // Fetch African & Black Cinema
    const { media: africanCinema } = await getBrowseMedia({ limit: itemLimit, genre: 'African' }); // Assuming 'African' or similar genre
    if (africanCinema.length > 0) {
        collections.push({ _id: 'african-cinema', title: 'African & Black Cinema', slug: 'african-black-cinema', items: africanCinema });
    }

    // Fetch Made in Africa
    const { media: madeInAfrica } = await getBrowseMedia({ limit: itemLimit, genre: 'African' }); // Assuming 'African' or similar genre
    if (madeInAfrica.length > 0) {
        collections.push({ _id: 'made-in-africa', title: 'Made in Africa', slug: 'made-in-africa', items: madeInAfrica });
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
