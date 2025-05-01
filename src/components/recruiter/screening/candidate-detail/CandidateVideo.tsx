
import React from 'react';

interface CandidateVideoProps {
  videoUrl: string;
  posterUrl: string;
}

export const CandidateVideo: React.FC<CandidateVideoProps> = ({ videoUrl, posterUrl }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Video Introduction</h4>
      <div className="aspect-video bg-muted rounded-md overflow-hidden">
        <video 
          src={videoUrl} 
          controls 
          poster={posterUrl}
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};
