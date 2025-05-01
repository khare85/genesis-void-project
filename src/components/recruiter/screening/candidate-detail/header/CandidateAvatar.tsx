
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateAvatarProps {
  candidate: ScreeningCandidate;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({ candidate }) => {
  return (
    <Avatar className="h-16 w-16 border">
      <AvatarImage src={candidate.avatar} alt={candidate.name} />
      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
