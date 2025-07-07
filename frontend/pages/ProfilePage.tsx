import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMediaDetails } from '../services/api';
import type { Media } from '../types';
import MediaCard from '../components/MediaCard';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Navigate } from 'react-router-dom';
import { ClockIcon } from '../components/icons';
import { Button } from '../components/ui/button';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [fullWatchHistory, setFullWatchHistory] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryDetails = async () => {
      if (!user || !user.watchHistory || user.watchHistory.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const mediaPromises = user.watchHistory.map(item => getMediaDetails(item.mediaId));
        const mediaItems = await Promise.all(mediaPromises);
        setFullWatchHistory(mediaItems.filter((item): item is Media => item !== null));
      } catch (error) {
        console.error("Failed to fetch full watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryDetails();
  }, [user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }
  
  const clearWatchHistory = async () => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setFullWatchHistory([]);
  };

  if (loading) {
      return <div className="p-6 lg:p-10 text-center">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-10 text-center">
        <p>Could not load user profile. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center space-x-6 mb-10">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-brand-text-dim">{user.email}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Watch History</h2>
            {fullWatchHistory.length > 0 && (
            <Button 
                onClick={clearWatchHistory}
                variant="destructive"
                size="sm"
            >
                Clear History
            </Button>
            )}
        </div>
        {loading ? (
          <div className="text-center py-20 text-brand-text-dim">Loading history...</div>
        ) : fullWatchHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-4 gap-y-8">
            {fullWatchHistory.map(media => (
              <MediaCard key={media._id} media={media} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-surface-2 rounded-lg p-8 text-center">
            <ClockIcon className="w-16 h-16 mx-auto mb-4 text-brand-text-dim opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nothing to see here yet</h3>
            <p className="text-brand-text-dim">Your watch history will appear here once you start watching content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 