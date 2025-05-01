
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
import { toast } from "sonner";
import { useAIScreening } from "@/hooks/recruiter/screening/useAIScreening";
import { useOpenAICredits } from "@/hooks/useOpenAICredits";
import { supabase } from "@/integrations/supabase/client";

interface AIScreeningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidatesToScreen: ScreeningCandidate[];
  setCandidatesToScreen: React.Dispatch<React.SetStateAction<ScreeningCandidate[]>>;
  screeningState: ScreeningState;
  setScreeningState: React.Dispatch<React.SetStateAction<ScreeningState>>;
  onScreeningComplete?: (candidates: ScreeningCandidate[]) => void;
}

export const AIScreeningDialog: React.FC<AIScreeningDialogProps> = ({
  open,
  onOpenChange,
  candidatesToScreen,
  setCandidatesToScreen,
  screeningState,
  setScreeningState,
  onScreeningComplete
}) => {
  const { 
    screeningProgress, 
    setScreeningProgress,
    runAIScreening 
  } = useAIScreening();
  
  // Check for available credits
  const { data: credits } = useOpenAICredits();
  const [screenedCandidates, setScreenedCandidates] = useState<ScreeningCandidate[]>([]);
  
  // Stats for completed screening
  const [strongMatches, setStrongMatches] = useState(0);
  const [mediumMatches, setMediumMatches] = useState(0);
  const [lowMatches, setLowMatches] = useState(0);

  // Run the AI screening process
  const handleScreeningStart = async () => {
    if (candidatesToScreen.length === 0) {
      toast.error('No candidates to screen');
      onOpenChange(false);
      return;
    }

    // Check if we have enough credits
    if (credits && credits.availableCredits < candidatesToScreen.length * 0.02) {
      toast.error('Not enough AI credits to screen all candidates');
      return;
    }

    setScreeningState('running');
    setScreeningProgress(0);
    
    try {
      // Call our AI screening function
      const enrichedCandidates = await runAIScreening(candidatesToScreen);
      
      // Update database with screening results
      await updateScreeningResults(enrichedCandidates);
      
      // Calculate statistics
      let strong = 0, medium = 0, low = 0;
      enrichedCandidates.forEach(candidate => {
        if (candidate.matchCategory === 'High Match') strong++;
        else if (candidate.matchCategory === 'Medium Match') medium++;
        else low++;
      });
      
      setStrongMatches(strong);
      setMediumMatches(medium);
      setLowMatches(low);
      setScreenedCandidates(enrichedCandidates);
      
      // Complete the screening after a short delay
      setScreeningState('completed');
      
      // Notify parent component about completion
      if (onScreeningComplete) {
        onScreeningComplete(enrichedCandidates);
      }
      
      toast.success(`Successfully screened ${candidatesToScreen.length} candidates.`);
      
    } catch (error) {
      console.error('Screening error:', error);
      setScreeningState('failed');
      toast.error('Screening process failed. Please try again.');
    }
  };

  // Update database with screening results
  const updateScreeningResults = async (candidates: ScreeningCandidate[]) => {
    // For applications with id, update the applications table
    const updatePromises = candidates.map(candidate => {
      if (!candidate.id) return Promise.resolve();
      
      return supabase
        .from('applications')
        .update({
          screening_score: candidate.screeningScore,
          notes: candidate.screeningNotes,
          match_score: candidate.matchScore || candidate.screeningScore
        })
        .eq('id', candidate.id);
    });
    
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating screening results:', error);
    }
  };

  // Reset screening state
  const resetScreeningState = () => {
    setScreeningState('idle');
    setScreeningProgress(0);
    onOpenChange(false);
  };
  
  // Handle viewing results
  const handleViewResults = () => {
    resetScreeningState();
    // Additional logic if needed for viewing results
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
            {screeningState === 'failed' && 
              "Screening process failed. Please try again."}
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
                <span>Estimated AI credits needed:</span>
                <span className="font-medium">{(candidatesToScreen.length * 0.02).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Available AI credits:</span>
                <span className="font-medium">{credits?.availableCredits.toFixed(2) || 'Loading...'}</span>
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
                    {screeningProgress > 30 && <p>Processing video introductions...</p>}
                    {screeningProgress > 60 && <p>Generating candidate insights...</p>}
                    {screeningProgress > 80 && <p>Calculating match scores...</p>}
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
                  <div className="font-medium">{strongMatches}</div>
                  <div className="text-xs text-muted-foreground">Strong matches</div>
                </div>
                <div>
                  <div className="font-medium">{mediumMatches}</div>
                  <div className="text-xs text-muted-foreground">Medium matches</div>
                </div>
                <div>
                  <div className="font-medium">{lowMatches}</div>
                  <div className="text-xs text-muted-foreground">Low matches</div>
                </div>
              </div>
            </div>
          )}
          
          {screeningState === 'failed' && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-center">
              <h3 className="font-medium text-destructive">Screening Failed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There was a problem during the AI screening process.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          {screeningState === 'idle' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleScreeningStart}>
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
              <Button onClick={handleViewResults}>
                View Results
              </Button>
            </>
          )}
          
          {screeningState === 'failed' && (
            <>
              <Button variant="outline" onClick={resetScreeningState}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleScreeningStart}>
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
