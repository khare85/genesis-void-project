import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScreeningCandidate } from "@/types/screening";
interface CandidateInfoProps {
  candidate: ScreeningCandidate;
}
export const CandidateInfo: React.FC<CandidateInfoProps> = ({
  candidate
}) => {
  return <div className="flex-1">
      <h3 className="text-lg font-bold">{candidate.name}</h3>
      <p className="text-sm text-muted-foreground">{candidate.jobRole}</p>
      
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs bg-blue-200">
          {candidate.position}
        </Badge>
        <Badge variant={candidate.status === 'approved' ? "default" : candidate.status === 'rejected' ? "destructive" : "secondary"} className="text-xs">
          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
        </Badge>
      </div>
    </div>;
};