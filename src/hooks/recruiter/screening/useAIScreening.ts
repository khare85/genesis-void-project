
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScreeningCandidate, ScreeningState } from '@/types/screening';

export const useAIScreening = () => {
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [candidatesToScreen, setCandidatesToScreen] = useState<ScreeningCandidate[]>([]);

  const runAIScreening = async (candidates: ScreeningCandidate[]) => {
    if (!candidates || candidates.length === 0) {
      toast.error('No candidates to screen');
      return [];
    }

    setScreeningState('running');
    setScreeningProgress(0);
    
    try {
      // Prepare candidates data for screening
      const candidatesForScreening = candidates.map(candidate => ({
        id: candidate.id,
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        skills: candidate.skills,
        experience: candidate.experience,
        education: candidate.education,
        position: candidate.position || candidate.jobRole,
        resume: candidate.resume || ''
      }));

      // Create a progress tracker
      let processedCount = 0;
      const totalCandidates = candidatesForScreening.length;
      const batchSize = 5;
      const screenedCandidates: ScreeningCandidate[] = [];
      
      // Process candidates in batches
      for (let i = 0; i < candidatesForScreening.length; i += batchSize) {
        const batch = candidatesForScreening.slice(i, Math.min(i + batchSize, candidatesForScreening.length));
        
        // Call the Edge Function
        const { data, error } = await supabase.functions.invoke('ai-candidate-screening', {
          body: { candidates: batch }
        });
        
        if (error) {
          console.error('Error calling AI screening function:', error);
          toast.error('Error during AI screening');
          throw error;
        }
        
        // Update progress
        processedCount += batch.length;
        const progress = Math.round((processedCount / totalCandidates) * 100);
        setScreeningProgress(progress);
        
        // Merge results back with original candidate data
        if (data && data.results) {
          const enrichedBatch = data.results.map((result: any) => {
            // Find the original candidate to merge with
            const originalCandidate = candidates.find(c => c.id === result.id);
            if (!originalCandidate) return result;
            
            // Merge AI screening results with original candidate data
            return {
              ...originalCandidate,
              aiSummary: result.aiSummary,
              screeningScore: result.screeningScore,
              screeningNotes: result.screeningNotes,
              matchCategory: result.matchCategory
            };
          });
          
          screenedCandidates.push(...enrichedBatch);
        }
        
        // Small delay to avoid overwhelming the function
        if (i + batchSize < candidatesForScreening.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setScreeningState('completed');
      return screenedCandidates;
      
    } catch (error) {
      console.error('AI Screening error:', error);
      setScreeningState('failed');
      toast.error('AI Screening failed. Please try again.');
      return [];
    }
  };

  return {
    screeningState,
    setScreeningState,
    screeningProgress,
    setScreeningProgress,
    candidatesToScreen,
    setCandidatesToScreen,
    runAIScreening
  };
};
