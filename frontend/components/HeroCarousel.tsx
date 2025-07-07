
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Media } from '../types';
import { IMAGE_BASE_URL } from '../../constants';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface HeroCarouselProps {
  items: Media[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (items.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, items.length]);
  
  if (!items || items.length === 0) {
    return (
        <div className="relative w-full h-[60vh] mb-8 bg-brand-surface-2 flex items-center justify-center">
            <p className="text-brand-text-dim">No featured content available.</p>
        </div>
    );
  }

  const activeItem = items[currentIndex];

  return (
    <div className="relative w-full h-[60vh] mb-8 group">
      <div className="w-full h-full">
        {items.map((item, index) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={`${IMAGE_BASE_URL}/w1280${item.heroImageUrl}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-transparent to-transparent opacity-50"></div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 text-white max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{activeItem.title}</h2>
        <div className="flex items-center space-x-4 my-4 text-brand-text-dim">
            <span>{activeItem.releaseYear}</span>
            <span>•</span>
            <span>{activeItem.type === 'tv-show' ? 'TV Show' : 'Movie'}</span>
            <span>•</span>
            <span>{activeItem.genres.join(', ')}</span>
        </div>
        <p className="text-brand-text-dim mb-6 line-clamp-3">{activeItem.synopsis}</p>
        <Link
          to={`/player/${activeItem._id}`}
          className="inline-flex items-center bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105"
        >
          <PlayIcon className="w-6 h-6 mr-2 fill-current" />
          <span>Play</span>
        </Link>
      </div>

      {items.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Previous slide">
            <ChevronLeftIcon className="w-8 h-8"/>
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Next slide">
            <ChevronRightIcon className="w-8 h-8"/>
          </button>

          <div className="absolute bottom-5 right-5 flex space-x-2">
            {items.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-brand-primary' : 'bg-white/50'}`} aria-label={`Go to slide ${index + 1}`}></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
