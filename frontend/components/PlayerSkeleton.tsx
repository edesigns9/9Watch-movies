import React from 'react';

const PlayerSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-black flex flex-col">
      <div className="w-full h-full bg-brand-surface animate-pulse" />
      <div className="p-6">
        <div className="h-8 w-3/4 bg-brand-surface-2 rounded-md animate-pulse mb-4"></div>
        <div className="h-4 w-1/2 bg-brand-surface-2 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default PlayerSkeleton; 