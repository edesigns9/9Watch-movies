import React from 'react';
import { Skeleton } from './ui/skeleton';

interface MediaCardSkeletonProps {
  className?: string;
}

const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`block flex-shrink-0 ${className}`}>
      <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-brand-surface-2">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default MediaCardSkeleton; 