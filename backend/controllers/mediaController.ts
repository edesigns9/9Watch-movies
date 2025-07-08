import { Request, Response } from 'express';
import Media from '../models/Media';

interface MediaFilter {
    featured?: boolean;
    genres?: string;
    type?: 'movie' | 'tv-show';
    releaseYear?: number;
    title?: { $regex: string; $options: string };
}

interface SortOptions {
    [key: string]: 1 | -1;
}

// Controller to get all media with filtering and sorting
export const getBrowseMedia = async (req: Request, res: Response) => {
    try {
        const { genre, type, year, query, sortBy, page = 1, limit = 20, featured } = req.query;

        const filters: MediaFilter = {};
        if (featured) filters.featured = JSON.parse(featured as string);
        if (genre && genre !== 'All') filters.genres = genre as string;
        if (type && type !== 'All') filters.type = type as 'movie' | 'tv-show';
        if (year && Number(year) > 0) filters.releaseYear = Number(year);
        if (query) filters.title = { $regex: query as string, $options: 'i' };

        const sortOptions: SortOptions = {};
        if (sortBy === 'rating_desc') sortOptions.rating = -1;
        if (sortBy === 'year_desc') sortOptions.releaseYear = -1;
        if (sortBy === 'title_asc') sortOptions.title = 1;
        
        const media = await Media.find(filters)
            .sort(sortOptions)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Media.countDocuments(filters);

        res.json({
            media,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export const getHomepageCollections = async (req: Request, res: Response) => {
    try {
        const itemLimit = 15;

        const getCollection = async (title: string, slug: string, filter: object, sort: SortOptions = {}) => {
            const media = await Media.find(filter).sort(sort).limit(itemLimit);
            if (media.length === 0) return null;
            return { _id: slug, title, slug, items: media };
        };

        const collections = await Promise.all([
            getCollection('Featured', 'featured', { featured: true }),
            getCollection('Popular Movies', 'popular-movies', { type: 'movie' }, { rating: -1 }),
            getCollection('Popular TV Shows', 'popular-tv-shows', { type: 'tv-show' }, { rating: -1 }),
            getCollection('New Releases', 'new-releases', {}, { releaseYear: -1 }),
            getCollection('Trending Now 🔥', 'trending-now', {}, { rating: -1 }),
            getCollection('Recently Added', 'recently-added', {}, { releaseYear: -1 }),
            getCollection('HOT Action Movies', 'hot-action-movies', { genres: 'Action' }),
            getCollection('Critically Acclaimed TV', 'critically-acclaimed-tv', { type: 'tv-show' }, { rating: -1 }),
            getCollection('Sci-Fi Worlds', 'sci-fi-worlds', { genres: 'Sci-Fi' }),
            getCollection('Midnight Horror Express 🔪', 'midnight-horror-express', { genres: 'Horror' }),
            getCollection('Romantic Love ❤️', 'romantic-love', { genres: 'Romance' }),
            getCollection('Thriller', 'thriller', { genres: 'Thriller' }),
            getCollection('African Movies', 'african-movies', { genres: 'African' }),
            getCollection('Nollywood', 'nollywood', { genres: 'Nollywood' }),
            getCollection('K-Drama', 'k-drama', { genres: 'K-Drama' }),
            getCollection('Black Shows', 'black-shows', { genres: 'Black' }),
            getCollection('Documentary', 'documentary', { genres: 'Documentary' }),
            getCollection('Animation', 'animation', { genres: 'Animation' }),
            getCollection('Comedy', 'comedy', { genres: 'Comedy' }),
            getCollection('Family', 'family', { genres: 'Family' }),
        ]);

        res.json(collections.filter(c => c !== null));

    } catch (error) {
        console.error('Error fetching homepage collections:', error);
        res.status(500).send('Server Error');
    }
};

// Controller to get a single media item by ID
export const getMediaById = async (req: Request, res: Response) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 