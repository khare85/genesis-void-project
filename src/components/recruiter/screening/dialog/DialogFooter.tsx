
import React from 'react';
import { DialogFooter as UIDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { ScreeningState } from "@/types/screening";

interface DialogFooterProps {
  screeningState: ScreeningState;
  onCancel: () => void;
  onStart: () => void;
  onViewResults: () => void;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  screeningState,
  onCancel,
  onStart,
  onViewResults
}) => {
  return (
    <UIDialogFooter className="flex sm:justify-between">
      {screeningState === 'idle' && (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onStart}>
            <Zap className="mr-2 h-4 w-4" />
            Start Screening
          </Button>
        </>
      )}
      
      {screeningState === 'running' && (
        <Button variant="outline" className="ml-auto" disabled>
          Processing...
        </Button>
      )}
      
      {screeningState === 'completed' && (
        <>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
          <Button onClick={onViewResults}>
            View Results
          </Button>
        </>
      )}
      
      {screeningState === 'failed' && (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onStart}>
            Try Again
          </Button>
        </>
      )}
    </UIDialogFooter>
  );
};
