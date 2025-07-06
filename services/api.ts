import { homepageData, browseableMedia } from '../data/mockData';
import type { Collection, Media, User } from '../types';

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This is a map for quick lookups, generated from browseableMedia
export const mediaDetailsMap: { [key: string]: Media } = {};
browseableMedia.forEach(media => {
  mediaDetailsMap[media._id] = media;
});

export const getHomepageData = async (): Promise<Collection[]> => {
  await sleep(300);
  return JSON.parse(JSON.stringify(homepageData));
};

export const getMockUser = async (username: string): Promise<User> => {
  await sleep(200);
  return {
    _id: 'user-1',
    username,
    email: `${username.toLowerCase()}@example.com`,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
    watchHistory: [
        { mediaId: 'movie-1', progress: 0.8, lastWatched: new Date(Date.now() - 86400000).toISOString() },
        { mediaId: 'tv-2', progress: 0.3, lastWatched: new Date(Date.now() - 172800000).toISOString() },
    ]
  };
};

export const getBrowseMedia = async (filters: { 
  genre?: string; 
  type?: string; 
  year?: number;
  query?: string;
  sortBy?: string;
}): Promise<Media[]> => {
  await sleep(500);
  let results = [...browseableMedia];
  
  if (filters.query) {
    results = results.filter(m => m.title.toLowerCase().includes(filters.query!.toLowerCase()));
  }
  if (filters.genre && filters.genre !== 'All') {
    results = results.filter(m => m.genres.includes(filters.genre as string));
  }
  if (filters.type && filters.type !== 'All') {
    results = results.filter(m => m.type === filters.type);
  }
  if (filters.year && filters.year > 0) {
      results = results.filter(m => m.releaseYear === filters.year);
  }
  
  // Sorting logic
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'rating_desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'year_desc':
        results.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'title_asc':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
  }
  
  return JSON.parse(JSON.stringify(results));
};

export const getMediaDetails = async (id: string): Promise<Media | null> => {
  await sleep(400);
  const media = mediaDetailsMap[id] || null;
  return media ? JSON.parse(JSON.stringify(media)) : null;
};
