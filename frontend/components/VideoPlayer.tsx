
import React from 'react';
import ReactPlayer from 'react-player/lazy';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="relative aspect-video w-full h-full bg-black">
      <ReactPlayer
        url={url}
        controls={true}
        width="100%"
        height="100%"
        playing={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
