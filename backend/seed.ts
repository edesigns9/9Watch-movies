import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Media from './models/Media';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Basic types for TMDB API response
interface TmdbMovie {
    id: number;
    title: string;
}
interface TmdbMovieDetails {
    id: number;
    title: string;
    overview: string;
    genres: { name: string }[];
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    videos: { results: { site: string; type: string; key: string }[] };
}

interface NewMedia {
    title: string;
    type: 'movie' | 'tv-show';
    description: string;
    genres: string[];
    posterUrl: string;
    heroUrl: string;
    trailerUrl: string;
    rating: number;
    releaseYear: number;
    featured: boolean;
    videoSources: { quality: string; url: string }[];
}

const seedDatabase = async () => {
  if (!TMDB_API_KEY) {
    console.error('FATAL: TMDB_API_KEY is not defined in your .env file.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Database connected. Clearing existing media...');
    await Media.deleteMany({});
    console.log('Existing media cleared.');

    console.log('Fetching popular movies from TMDB...');
    const { data: popularMovies } = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    const mediaToSave: NewMedia[] = [];

    for (const movie of popularMovies.results.slice(0, 20) as TmdbMovie[]) { // Get top 20 for seeding
      console.log(`Fetching details for: ${movie.title}`);
      
      const { data: details } = await axios.get<TmdbMovieDetails>(
        `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`
      );

      const trailer = details.videos?.results?.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      );

      const newMedia: NewMedia = {
        title: details.title,
        type: 'movie',
        description: details.overview,
        genres: details.genres.map((g) => g.name),
        posterUrl: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
        heroUrl: `https://image.tmdb.org/t/p/w1280${details.backdrop_path || details.poster_path}`,
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
        rating: details.vote_average,
        releaseYear: new Date(details.release_date).getFullYear(),
        featured: mediaToSave.length < 5, // Feature the first 5 movies
        videoSources: [
            { quality: '1080p', url: `https://mock-stream.vercel.app/api/stream?id=${details.id}&q=1080p` },
            { quality: '720p', url: `https://mock-stream.vercel.app/api/stream?id=${details.id}&q=720p` },
        ],
      };
      console.log(`Seeding: ${newMedia.title}, Featured: ${newMedia.featured}`); // DEBUG LOG
      mediaToSave.push(newMedia);
    }

    console.log(`Ready to insert ${mediaToSave.length} media items into the database.`);
    await Media.insertMany(mediaToSave);
    console.log('Database seeded successfully!');

  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Axios error fetching data from TMDB:', error.response?.data || error.message);
    } else {
        console.error('An unexpected error occurred during seeding:', error);
    }
  } finally {
    console.log('Closing database connection.');
    await mongoose.connection.close();
  }
};

seedDatabase(); 