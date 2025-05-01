
import React from 'react';
import { Briefcase, FileText, Calendar } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateApplicationDetailsProps {
  candidate: ScreeningCandidate;
}

export const CandidateApplicationDetails: React.FC<CandidateApplicationDetailsProps> = ({ candidate }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Application Details</h4>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.experience} experience</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.education}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Applied on {candidate.dateApplied}</span>
        </div>
      </div>
    </div>
  );
};
