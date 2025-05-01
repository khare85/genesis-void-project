
import React from 'react';
import { ScreeningCandidate } from "@/types/screening";
import { CandidateAvatar } from './header/CandidateAvatar';
import { CandidateInfo } from './header/CandidateInfo';
import { MatchRating } from './header/MatchRating';

interface CandidateHeaderProps {
  candidate: ScreeningCandidate;
  displayedMatchCategory: string;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({ 
  candidate, 
  displayedMatchCategory 
}) => {
  return (
    <div className="flex items-start gap-4">
      <CandidateAvatar candidate={candidate} />
      <CandidateInfo candidate={candidate} />
      <MatchRating displayedMatchCategory={displayedMatchCategory} />
    </div>
  );
};
