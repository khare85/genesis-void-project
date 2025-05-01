
import React from 'react';
import { Mail, Phone, MapPin } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateContactInfoProps {
  candidate: ScreeningCandidate;
}

export const CandidateContactInfo: React.FC<CandidateContactInfoProps> = ({ candidate }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Contact Information</h4>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.location}</span>
        </div>
      </div>
    </div>
  );
};
