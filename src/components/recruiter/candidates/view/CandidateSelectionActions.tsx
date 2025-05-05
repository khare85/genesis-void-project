
import React from "react";
import { AIScreeningButton } from "../AIScreeningButton";

interface CandidateSelectionActionsProps {
  selectedCandidates: string[];
  onScreen: () => void;
}

export const CandidateSelectionActions: React.FC<CandidateSelectionActionsProps> = ({
  selectedCandidates,
  onScreen
}) => {
  return (
    <div className="flex items-center gap-2">
      <AIScreeningButton 
        selectedCount={selectedCandidates.length} 
        onScreen={onScreen}
      />
    </div>
  );
};
