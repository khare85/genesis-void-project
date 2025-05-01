
import React from "react";
import { AIScreeningButton } from "@/components/recruiter/candidates/AIScreeningButton";

interface CandidateSelectionActionsProps {
  selectedCandidates: string[];
  onScreen: () => void;
}

export const CandidateSelectionActions: React.FC<CandidateSelectionActionsProps> = ({ 
  selectedCandidates, 
  onScreen 
}) => {
  if (selectedCandidates.length === 0) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2">
      <AIScreeningButton
        selectedCount={selectedCandidates.length}
        onScreen={onScreen}
      />
    </div>
  );
};
