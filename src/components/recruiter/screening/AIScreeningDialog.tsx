
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScreeningCandidate, ScreeningState } from "@/types/screening";
import { toast } from "sonner";
import { useAIScreening } from "@/hooks/recruiter/screening/useAIScreening";
import { useOpenAICredits } from "@/hooks/useOpenAICredits";
import { supabase } from "@/integrations/supabase/client";

// Import refactored components
import { DialogHeader } from "./dialog/DialogHeader";
import { IdleStateContent } from "./dialog/IdleStateContent";
import { RunningStateContent } from "./dialog/RunningStateContent";
import { CompletedStateContent } from "./dialog/CompletedStateContent";
import { FailedStateContent } from "./dialog/FailedStateContent";
import { DialogFooter } from "./dialog/DialogFooter";

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
          // Convert to string to fix the type error - candidate.id could be number or string
          match_score: candidate.matchScore || candidate.screeningScore
        })
        .eq('id', String(candidate.id));
    });
    
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating screening results:', error);
    }
  };

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
  
  // Calculate estimated values
  const estimatedCredits = candidatesToScreen.length * 0.02;
  const estimatedTime = Math.ceil(candidatesToScreen.length * 0.5);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader 
          screeningState={screeningState} 
          candidateCount={candidatesToScreen.length}
        />
        
        <div className="py-4">
          {screeningState === 'idle' && (
            <IdleStateContent
              candidateCount={candidatesToScreen.length}
              estimatedCredits={estimatedCredits}
              availableCredits={credits?.availableCredits}
              estimatedTime={estimatedTime}
            />
          )}
          
          {screeningState === 'running' && (
            <RunningStateContent progress={screeningProgress} />
          )}
          
          {screeningState === 'completed' && (
            <CompletedStateContent
              strongMatches={strongMatches}
              mediumMatches={mediumMatches}
              lowMatches={lowMatches}
            />
          )}
          
          {screeningState === 'failed' && <FailedStateContent />}
        </div>
        
        <DialogFooter
          screeningState={screeningState}
          onCancel={resetScreeningState}
          onStart={handleScreeningStart}
          onViewResults={handleViewResults}
        />
      </DialogContent>
    </Dialog>
  );
};
