
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CandidateSelectionResult {
  selectedCandidates: string[];
  handleSelectCandidate: (candidateId: string) => void;
  handleSelectAll: (checked: boolean) => void;
  updateCandidateFolder: (candidateId: string, folderId: string) => Promise<boolean>;
  clearSelections: () => void;
}

export const useCandidateSelection = (
  candidates: any[],
  refreshCandidates: () => void
): CandidateSelectionResult => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // Handle candidate selection
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  // Handle select all candidates
  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? candidates.map(c => c.id) : []);
  };

  // Handle moving candidate to folder
  const updateCandidateFolder = async (candidateId: string, folderId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ folder_id: folderId })
        .eq('id', candidateId);
        
      if (error) throw error;
      
      // Clear selection after moving
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
      
      // Refresh candidates
      refreshCandidates();
      
      return true;
    } catch (err: any) {
      console.error("Error updating candidate folder:", err);
      toast({
        title: "Error updating folder",
        description: "Failed to update candidate folder. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedCandidates([]);
  };

  return {
    selectedCandidates,
    handleSelectCandidate,
    handleSelectAll,
    updateCandidateFolder,
    clearSelections
  };
};
