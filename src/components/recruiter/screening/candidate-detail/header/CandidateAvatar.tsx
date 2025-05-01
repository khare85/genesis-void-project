
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateAvatarProps {
  candidate: ScreeningCandidate;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({ candidate }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowVideo(true)}
      onMouseLeave={() => setShowVideo(false)}
    >
      <Avatar className={`h-16 w-16 border transition-opacity duration-300 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
        <AvatarImage src={candidate.avatar} alt={candidate.name} />
        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      {showVideo && (
        <div className="absolute inset-0 z-10">
          <video 
            src={candidate.videoIntro} 
            className="h-16 w-16 object-cover rounded-full cursor-pointer"
            autoPlay 
            muted 
            onClick={(e) => {
              e.stopPropagation();
              // Open in full screen
              const video = e.target as HTMLVideoElement;
              if (video.requestFullscreen) {
                video.requestFullscreen();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
