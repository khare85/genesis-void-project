
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileCheck, Check, X } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";

interface ActionButtonsProps {
  candidate: ScreeningCandidate;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  candidate,
  onSelectCandidate,
  onStatusChange
}) => {
  return (
    <div className="flex justify-end gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onSelectCandidate(candidate)}
        title="View Details"
      >
        <FileCheck className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-green-500 hover:text-green-600 hover:bg-green-50"
        onClick={() => onStatusChange(candidate, "approved")}
        disabled={candidate.status === 'approved'}
        title="Approve"
      >
        <Check className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" 
        onClick={() => onStatusChange(candidate, "rejected")}
        disabled={candidate.status === 'rejected'}
        title="Reject"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
