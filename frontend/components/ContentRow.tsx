import React, { useRef } from 'react';
import type { Collection } from '../types';
import MediaCard from './MediaCard';
import MediaCardSkeleton from './MediaCardSkeleton';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ContentRowProps {
  collection: Collection;
  isLoading?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ collection, isLoading = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <MediaCardSkeleton key={`skeleton-${index}`} className="w-40 md:w-44 lg:w-48" />
      ));
    }
    
    return collection.items.map(media => (
      <MediaCard key={media._id} media={media} className="w-40 md:w-44 lg:w-48" />
    ));
  };

  return (
    <div className="mb-10 group/row">
      <div className="flex justify-between items-center px-6 lg:px-10 mb-4">
        <h2 className="text-2xl font-bold text-brand-text">{collection.title}</h2>
        <a href="#" className="text-sm font-semibold text-brand-text-dim hover:text-brand-primary">
          More &gt;
        </a>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-brand-bg to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-8 h-8 text-white bg-black/50 rounded-full p-1" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar px-6 lg:px-10"
        >
          {renderContent()}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-brand-bg to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-8 h-8 text-white bg-black/50 rounded-full p-1" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;