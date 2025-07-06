import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/lazy';
import { getMediaDetails } from '../services/api';
import type { Media } from '../types';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import PlayerSkeleton from '../components/PlayerSkeleton';

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { updateWatchHistory } = useAuth();
  const playerRef = useRef<ReactPlayer>(null);
  const lastProgressUpdate = useRef(0);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMediaDetails(id);
        if (data) {
          setMedia(data);
        } else {
          toast({ title: 'Error', description: 'Media not found.', variant: 'destructive' });
        }
      } catch (error) {
        console.error('Failed to fetch media details:', error);
        toast({ title: 'Error', description: 'Could not load media.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, toast]);
  
  const handleProgress = ({ played }: { played: number }) => {
    if (!playerRef.current) return;
    const duration = playerRef.current.getDuration();
    if (!duration) return;

    // Update every 15 seconds of watch time
    const fifteenSecondsInPercentage = 15 / duration;
    if (id && played > lastProgressUpdate.current + fifteenSecondsInPercentage) {
      updateWatchHistory(id, played);
      lastProgressUpdate.current = played;
    }
  };

  if (loading) {
    return <PlayerSkeleton />;
  }

  if (!media) {
    return <div className="p-10 text-center text-brand-text-dim">Media not found.</div>;
  }
  
  const initialVideoUrl = media.type === 'tv-show' 
    ? media.seasons?.[0]?.episodes?.[0]?.videoSources?.[0]?.url
    : media.videoSources?.[0]?.url;

  if (!initialVideoUrl) {
    return <div className="p-10 text-center text-brand-text-dim">Video for this media is not available.</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center">
       <div className="w-full h-full">
        <ReactPlayer
            ref={playerRef}
            url={initialVideoUrl}
            controls
            playing
            width="100%"
            height="100%"
            onProgress={handleProgress}
            config={{
                file: {
                attributes: {
                    crossOrigin: 'anonymous'
                }
                }
            }}
        />
       </div>
    </div>
  );
};

export default PlayerPage;
