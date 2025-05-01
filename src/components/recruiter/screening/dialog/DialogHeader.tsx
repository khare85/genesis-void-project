
import React from 'react';
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScreeningState } from "@/types/screening";

interface DialogHeaderProps {
  screeningState: ScreeningState;
  candidateCount: number;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  screeningState,
  candidateCount
}) => {
  return (
    <UIDialogHeader>
      <DialogTitle>AI Screening</DialogTitle>
      <DialogDescription>
        {screeningState === 'idle' && 
          `Screen ${candidateCount} pending candidates automatically using AI.`}
        {screeningState === 'running' && 
          "AI is analyzing candidate profiles, resumes, and video introductions..."}
        {screeningState === 'completed' && 
          `Successfully screened ${candidateCount} candidates!`}
        {screeningState === 'failed' && 
          "Screening process failed. Please try again."}
      </DialogDescription>
    </UIDialogHeader>
  );
};
