
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScreeningCandidate } from "@/types/screening";
import { Play, Maximize } from 'lucide-react';
import { useServices } from '@/hooks/recruiter/screening/useServices';

interface CandidateAvatarProps {
  candidate: ScreeningCandidate;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({ candidate }) => {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const { openVideoDialog } = useServices();
  
  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (candidate.videoIntro) {
      openVideoDialog(candidate.videoIntro, candidate.avatar);
    }
  };
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowPlayButton(true)}
      onMouseLeave={() => setShowPlayButton(false)}
    >
      <Avatar className="h-16 w-16 border">
        <AvatarImage src={candidate.avatar} alt={candidate.name} />
        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      {showPlayButton && candidate.videoIntro && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer"
          onClick={handlePlayVideo}
        >
          <Play className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
};
