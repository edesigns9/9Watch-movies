import React, { useState, useEffect } from 'react';
import { getHomepageData } from '../services/api';
import type { Collection } from '../types';
import HeroCarousel from '../components/HeroCarousel';
import ContentRow from '../components/ContentRow';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';

const HomePage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getHomepageData();
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Create empty collections for skeleton loading state
  const emptyCollections = loading ? [
    { _id: 'loading-1', title: 'Trending Now', slug: 'trending', items: [] },
    { _id: 'loading-2', title: 'Popular Movies', slug: 'popular-movies', items: [] },
    { _id: 'loading-3', title: 'Top TV Shows', slug: 'top-tv', items: [] },
  ] : [];

  const displayCollections = loading ? emptyCollections : collections;
  const heroItems = loading ? [] : (collections[0]?.items || []);

  return (
    <div className="w-full">
      {loading ? (
        <div className="relative h-[60vh] bg-brand-surface-2">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <HeroCarousel items={heroItems} />
      )}
      
      <div className="py-4">
        {displayCollections.map(collection => (
          <ContentRow 
            key={collection._id} 
            collection={collection} 
            isLoading={loading} 
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
