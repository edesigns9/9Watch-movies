import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getBrowseMedia } from '../services/api';
import type { Media } from '../types';
import MediaCard from '../components/MediaCard';
import MediaCardSkeleton from '../components/MediaCardSkeleton';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ChevronDownIcon } from '../components/icons';

const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Fantasy', 'Cyberpunk', 'War', 'History', 'Reality'];
const years = [0, 2024, 2023, 2022, 2021, 2020, 2019];
const types = [{label: 'All', value: 'All'}, {label: 'Movie', value: 'movie'}, {label: 'TV Show', value: 'tv-show'}];
const sortOptions = [
    { label: 'Rating', value: 'rating_desc' },
    { label: 'Release Year', value: 'year_desc' },
    { label: 'Title (A-Z)', value: 'title_asc' },
];

interface BrowsePageProps {
  initialType?: 'movie' | 'tv-show' | 'All';
}

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const BrowsePage: React.FC<BrowsePageProps> = ({ initialType = 'All' }) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const query = useQuery();
  const searchQuery = query.get('q');
  
  const [filters, setFilters] = useState({
    genre: 'All',
    type: initialType,
    year: 0,
    sortBy: 'rating_desc'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchFilters = { ...filters, query: searchQuery || undefined, page: pagination.page };
        const data = await getBrowseMedia(fetchFilters);
        setMedia(data.media);
        setPagination(prev => ({ ...prev, totalPages: data.totalPages }));
      } catch (error) {
        console.error('Failed to fetch media:', error);
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
  }, [filters, searchQuery, toast, pagination.page]);

  const handleFilterChange = (filterType: keyof typeof filters | 'page', value: string | number) => {
      if (filterType === 'page') {
          setPagination(prev => ({ ...prev, page: value as number }));
      } else {
        setPagination(prev => ({...prev, page: 1})); // Reset to first page on filter change
        setFilters(prev => ({ ...prev, [filterType]: value }));
      }
  };

  const getSortLabel = () => {
      return sortOptions.find(o => o.value === filters.sortBy)?.label || 'Sort By';
  }

  const FilterButton: React.FC<{
    label: string; value: string | number; filterKey: keyof typeof filters;
  }> = ({ label, value, filterKey }) => (
    <Button
      onClick={() => handleFilterChange(filterKey, value)}
      variant={filters[filterKey] === value ? "brand" : "outline"}
      size="sm"
      className={`rounded-full ${filters[filterKey] !== value ? 'bg-brand-surface-2 text-brand-text-dim hover:bg-brand-surface-2/70 border-none' : ''}`}
    >
      {label}
    </Button>
  );

  const renderSkeletons = () => {
    return Array(12).fill(0).map((_, index) => (
      <MediaCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  const renderPageTitle = () => {
    if (searchQuery) {
      return <h1 className="text-3xl font-bold mb-8">Search results for "{searchQuery}"</h1>;
    }
    return <h1 className="text-3xl font-bold mb-8">Browse Content</h1>;
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-4 gap-y-8">
          {renderSkeletons()}
        </div>
      );
    }
    
    if (media.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-xl text-brand-text-dim">No results found.</p>
          {searchQuery && <p className="text-brand-text-dim/80 mt-2">Try a different search term.</p>}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-4 gap-y-8">
        {media.map((item) => (
          <MediaCard key={item._id} media={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-10">
      {renderPageTitle()}

      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-sm font-semibold mr-2">Type</span>
            {types.map(t => <FilterButton key={t.value} label={t.label} value={t.value} filterKey="type" />)}
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-sm font-semibold mr-2">Genre</span>
            {genres.map(g => <FilterButton key={g} label={g} value={g} filterKey="genre" />)}
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-sm font-semibold mr-2">Year</span>
            {years.map(y => <FilterButton key={y} label={y === 0 ? 'All' : y.toString()} value={y} filterKey="year" />)}
          </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 bg-brand-surface-2 text-brand-text-dim hover:bg-brand-surface-2/70 border-none">
                    <span>Sort By: {getSortLabel()}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-brand-surface border-brand-outline">
                {sortOptions.map(option => (
                    <DropdownMenuItem 
                        key={option.value} 
                        onClick={() => handleFilterChange('sortBy', option.value)}
                        className="text-brand-text-dim focus:bg-brand-surface-2 focus:text-brand-text"
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {renderContent()}

      <div className="flex justify-center mt-12">
          {pagination.totalPages > 1 && (
              <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => handleFilterChange('page', pagination.page - 1)} 
                    disabled={pagination.page <= 1}
                    variant="outline"
                  >
                      Previous
                  </Button>
                  <span className="text-brand-text-dim">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button 
                    onClick={() => handleFilterChange('page', pagination.page + 1)} 
                    disabled={pagination.page >= pagination.totalPages}
                    variant="outline"
                  >
                      Next
                  </Button>
              </div>
          )}
      </div>
    </div>
  );
};

export default BrowsePage;
