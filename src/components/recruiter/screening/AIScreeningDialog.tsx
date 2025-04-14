
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";
import { ScreeningCandidate, ScreeningState } from "@/types/screening";
import { useToast } from "@/hooks/use-toast";

interface AIScreeningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidatesToScreen: ScreeningCandidate[];
}

export const AIScreeningDialog: React.FC<AIScreeningDialogProps> = ({
  open,
  onOpenChange,
  candidatesToScreen
}) => {
  const { toast } = useToast();
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);

  // Run the AI screening process
  const runScreening = () => {
    if (candidatesToScreen.length === 0) {
      toast({
        title: "No candidates to screen",
        description: "There are no pending candidates to screen.",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

    setScreeningState('running');
    setScreeningProgress(0);
    
    // Simulate the screening process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete the screening after a short delay
        setTimeout(() => {
          setScreeningState('completed');
          
          // Show toast
          toast({
            title: "AI Screening Completed",
            description: `Successfully screened ${candidatesToScreen.length} candidates.`,
          });
        }, 500);
      }
      setScreeningProgress(progress);
    }, 200);
  };

  // Reset screening state
  const resetScreeningState = () => {
    setScreeningState('idle');
    setScreeningProgress(0);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Screening</DialogTitle>
          <DialogDescription>
            {screeningState === 'idle' && 
              `Screen ${candidatesToScreen.length} pending candidates automatically using AI.`}
            {screeningState === 'running' && 
              "AI is analyzing candidate profiles, resumes, and video introductions..."}
            {screeningState === 'completed' && 
              `Successfully screened ${candidatesToScreen.length} candidates!`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {screeningState === 'idle' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Candidates to screen:</span>
                <span className="font-medium">{candidatesToScreen.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Estimated time:</span>
                <span className="font-medium">{Math.ceil(candidatesToScreen.length * 0.5)} minutes</span>
              </div>
            </div>
          )}
          
          {screeningState === 'running' && (
            <div className="space-y-4">
              <Progress value={screeningProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processing...</span>
                <span>{screeningProgress}%</span>
              </div>
              <div className="mt-4 space-y-2">
                <AIGenerated>
                  <div className="text-xs space-y-1">
                    <p>Analyzing candidate data...</p>
                    <p>Extracting skills from resumes...</p>
                    <p>Comparing with job requirements...</p>
                    {screeningProgress > 50 && <p>Processing video introductions...</p>}
                    {screeningProgress > 80 && <p>Generating candidate insights...</p>}
                    {screeningProgress === 100 && <p>Finalizing reports...</p>}
                  </div>
                </AIGenerated>
              </div>
            </div>
          )}
          
          {screeningState === 'completed' && (
            <div className="space-y-4">
              <div className="rounded-md bg-primary/10 border border-primary/30 p-4 text-center">
                <Zap className="mx-auto h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Screening Complete</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All candidates have been processed and scored
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.8)}</div>
                  <div className="text-xs text-muted-foreground">Strong matches</div>
                </div>
                <div>
                  <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.15)}</div>
                  <div className="text-xs text-muted-foreground">Medium matches</div>
                </div>
                <div>
                  <div className="font-medium">{Math.floor(candidatesToScreen.length * 0.05)}</div>
                  <div className="text-xs text-muted-foreground">Low matches</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          {screeningState === 'idle' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={runScreening}>
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
              <Button variant="outline" onClick={resetScreeningState}>
                Close
              </Button>
              <Button onClick={resetScreeningState}>
                View Results
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
