
import { useState } from 'react';
import { ScreeningCandidate } from '@/types/screening';
import { toast } from '@/hooks/use-toast';

export const useStatusManager = (
  candidates: ScreeningCandidate[], 
  setCandidates: (candidates: ScreeningCandidate[]) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (candidate: ScreeningCandidate, status: "approved" | "rejected") => {
    setIsUpdating(true);
    
    try {
      // In a real app, this would call an API to update the status
      // Here we're just updating the state
      
      const updatedCandidates = candidates.map(c => {
        if (c.id === candidate.id) {
          return {
            ...c,
            status
          };
        }
        return c;
      });
      
      setCandidates(updatedCandidates);
      
      toast({
        title: `Candidate ${status}`,
        description: `${candidate.name} has been ${status}.`,
      });
      
      // In a real application, you would also update the database
      // Example:
      // await supabase
      //   .from('applications')
      //   .update({ status })
      //   .eq('id', candidate.id);
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update candidate status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    handleStatusChange,
  };
};
