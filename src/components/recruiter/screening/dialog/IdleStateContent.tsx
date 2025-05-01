
import React from 'react';

interface IdleStateContentProps {
  candidateCount: number;
  estimatedCredits: number;
  availableCredits: number | undefined;
  estimatedTime: number;
}

export const IdleStateContent: React.FC<IdleStateContentProps> = ({
  candidateCount,
  estimatedCredits,
  availableCredits,
  estimatedTime
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span>Candidates to screen:</span>
        <span className="font-medium">{candidateCount}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Estimated AI credits needed:</span>
        <span className="font-medium">{estimatedCredits.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Available AI credits:</span>
        <span className="font-medium">{availableCredits?.toFixed(2) || 'Loading...'}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Estimated time:</span>
        <span className="font-medium">{estimatedTime} minutes</span>
      </div>
    </div>
  );
};
