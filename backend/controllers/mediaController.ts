import { Request, Response } from 'express';
import Media from '../models/Media';

interface MediaFilter {
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
        const { genre, type, year, query, sortBy, page = 1, limit = 20 } = req.query;

        const filters: MediaFilter = {};
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