export interface VideoSource {
  quality: string;
  url: string;
  format: 'mp4' | 'hls';
  sourceDomain: string;
  sourceUploadedBy: string;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  synopsis: string;
  videoSources: VideoSource[];
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface CastMember {
  actorName: string;
  characterName: string;
  profileImageUrl: string;
}

export interface Media {
  _id: string;
  tmdbId: string;
  title: string;
  type: 'movie' | 'tv-show';
  releaseYear: number;
  synopsis: string;
  posterImageUrl: string;
  heroImageUrl: string;
  genres: string[];
  rating: number;
  cast: CastMember[];
  videoSources: VideoSource[];
  seasons: Season[];
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  items: Media[];
}

export interface WatchHistoryItem {
  mediaId: string;
  progress: number; // 0 to 1
  lastWatched: string; // ISO date string
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
  watchHistory: WatchHistoryItem[];
}
