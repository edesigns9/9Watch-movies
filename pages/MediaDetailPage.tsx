
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMediaDetails, getHomepageData } from '../services/api';
import type { Media, Collection } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import { StarIcon, DownloadIcon, ShareIcon, PlayIcon } from '../components/icons';
import ContentRow from '../components/ContentRow';

const MediaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<Media | null>(null);
  const [recommendations, setRecommendations] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      // Scroll to top on new page load
      window.scrollTo(0, 0);

      const mediaData = await getMediaDetails(id);
      setMedia(mediaData);

      // Fetch some data for recommendations row
      const allCollections = await getHomepageData();
      if(allCollections.length > 1) {
          // Filter out the current item from recommendations
          const recommendedItems = allCollections[1].items.filter(item => item._id !== id);
          setRecommendations({...allCollections[1], items: recommendedItems});
      }
      
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-brand-text-dim py-20">Loading details...</div>;
  }

  if (!media) {
    return <div className="flex justify-center items-center h-full text-brand-text-dim py-20">Media not found.</div>;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[50vh] text-white">
        <img src={`${IMAGE_BASE_URL}/w1280${media.heroImageUrl}`} alt={media.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent"></div>
      </div>

      {/* Info Section */}
      <div className="p-6 md:p-10 -mt-48 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 lg:w-60 flex-shrink-0">
                <img src={`${IMAGE_BASE_URL}/w500${media.posterImageUrl}`} alt={media.title} className="rounded-lg shadow-2xl w-full aspect-[2/3] object-cover" />
            </div>
            <div className="flex-grow pt-32 md:pt-16">
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{media.title}</h1>
                <div className="flex items-center space-x-4 my-3 text-brand-text-dim">
                    <div className="flex items-center text-yellow-400">
                        <StarIcon className="w-5 h-5 mr-1"/>
                        <span className="font-bold text-white text-lg">{media.rating.toFixed(1)}</span>
                    </div>
                    <span>{media.releaseYear}</span>
                    <span>{media.type === 'tv-show' ? 'TV Show' : 'Movie'}</span>
                </div>
                <div className="flex flex-wrap gap-2 my-4">
                    {media.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 bg-brand-surface-2 text-brand-text-dim text-xs font-semibold rounded-full">{genre}</span>
                    ))}
                </div>
                <p className="text-brand-text-dim max-w-3xl leading-relaxed">{media.synopsis}</p>
                <div className="flex space-x-4 mt-6">
                    <Link to={`/player/${media._id}`} className="flex items-center justify-center bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
                        <PlayIcon className="w-6 h-6 mr-2 fill-current"/> Play
                    </Link>
                    <button className="flex items-center justify-center bg-brand-surface-2 hover:bg-opacity-80 text-white font-semibold py-3 px-6 rounded-lg"><DownloadIcon className="w-5 h-5 mr-2" /> Download</button>
                    <button className="flex items-center justify-center bg-brand-surface-2 hover:bg-opacity-80 text-white font-semibold py-3 px-6 rounded-lg"><ShareIcon className="w-5 h-5 mr-2" /> Share</button>
                </div>
            </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="px-6 md:px-10 mt-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {media.cast.map(member => (
                <div key={member.actorName} className="flex-shrink-0 w-32 text-center">
                    <img src={member.profileImageUrl} alt={member.actorName} className="w-24 h-24 rounded-full object-cover mx-auto mb-2 shadow-lg" />
                    <p className="font-semibold text-sm text-brand-text">{member.actorName}</p>
                    <p className="text-xs text-brand-text-dim">{member.characterName}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.items.length > 0 && (
          <div className="mt-12">
            <ContentRow collection={{...recommendations, title: 'For You'}} />
          </div>
      )}

    </div>
  );
};

export default MediaDetailPage;
