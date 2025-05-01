
import React from 'react';
import { getMatchBadge } from '../utils/badgeUtils';

interface MatchRatingProps {
  displayedMatchCategory: string;
}

export const MatchRating: React.FC<MatchRatingProps> = ({ displayedMatchCategory }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {getMatchBadge(displayedMatchCategory)}
      <span className="text-xs text-muted-foreground mt-1">Match Rating</span>
    </div>
  );
};
