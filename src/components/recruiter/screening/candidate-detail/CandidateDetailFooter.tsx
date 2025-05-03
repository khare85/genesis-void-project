
import React from 'react';
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateDetailFooterProps {
  candidate: ScreeningCandidate;
  onClose: () => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const CandidateDetailFooter: React.FC<CandidateDetailFooterProps> = ({
  candidate,
  onClose,
  onStatusChange
}) => {
  return (
    <SheetFooter className="flex justify-between sm:justify-between pt-4">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          onClick={() => onStatusChange(candidate, "rejected")}
          disabled={candidate.status === 'rejected'}
          title="Not Selected"
        >
          <X className="mr-2 h-4 w-4" />
          Not Selected
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-green-500 hover:text-green-600 hover:bg-green-50"
          onClick={() => onStatusChange(candidate, "approved")}
          disabled={candidate.status === 'approved'}
          title="Shortlisted"
        >
          <Check className="mr-2 h-4 w-4" />
          Shortlisted
        </Button>
      </div>
      
      <Button variant="outline" size="sm" onClick={onClose}>
        Close
      </Button>
    </SheetFooter>
  );
};
