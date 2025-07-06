import mongoose, { Schema, Document } from 'mongoose';

// Interface and Schema for VideoSource
export interface IVideoSource {
  quality: string;
  url: string;
}
const VideoSourceSchema = new Schema<IVideoSource>({
  quality: { type: String, required: true },
  url: { type: String, required: true },
});

// Interface and Schema for Episode
export interface IEpisode {
  episodeNumber: number;
  title: string;
  videoSources: IVideoSource[];
}
const EpisodeSchema = new Schema<IEpisode>({
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  videoSources: [VideoSourceSchema],
});

// Interface and Schema for Season
export interface ISeason {
  seasonNumber: number;
  episodes: IEpisode[];
}
const SeasonSchema = new Schema<ISeason>({
  seasonNumber: { type: Number, required: true },
  episodes: [EpisodeSchema],
});

// Main Media Interface and Schema
export interface IMedia extends Document {
  title: string;
  type: 'movie' | 'tv-show';
  description: string;
  genres: string[];
  posterUrl: string;
  trailerUrl: string;
  rating: number;
  releaseYear: number;
  videoSources?: IVideoSource[]; // For movies
  seasons?: ISeason[]; // For TV shows
}

const MediaSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['movie', 'tv-show'] },
  description: { type: String, required: true },
  genres: [{ type: String, required: true }],
  posterUrl: { type: String, required: true },
  trailerUrl: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseYear: { type: Number, required: true },
  videoSources: [VideoSourceSchema], // For movies
  seasons: [SeasonSchema], // For TV shows
}, { timestamps: true });

export default mongoose.model<IMedia>('Media', MediaSchema); 