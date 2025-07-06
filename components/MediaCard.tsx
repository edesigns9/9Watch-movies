import React from 'react';
import { Link } from 'react-router-dom';
import type { Media } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import { StarIcon } from './icons';
import { cn } from '../lib/utils';

interface MediaCardProps {
  media: Media;
  className?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, className = '' }) => {
  return (
    <Link to={`/media/${media._id}`} className={cn("block group/card flex-shrink-0", className)}>
      <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-brand-surface-2 transition-transform duration-300 transform group-hover/card:scale-105">
        <img
          src={`${IMAGE_BASE_URL}/w500${media.posterImageUrl}`}
          alt={media.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
          {media.releaseYear}
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <StarIcon className="w-3 h-3 text-yellow-400 mr-1" />
            {media.rating.toFixed(1)}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-brand-text font-semibold truncate group-hover/card:text-brand-primary">{media.title}</h3>
        <p className="text-brand-text-dim text-sm truncate">{media.genres.slice(0, 2).join(', ')}</p>
      </div>
    </Link>
  );
};

export default MediaCard;