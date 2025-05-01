
import { supabase } from '@/integrations/supabase/client';
import { ScreeningCandidate } from '@/types/screening';
import { toast } from '@/hooks/use-toast';

export const useStatusManager = (
  screeningData: ScreeningCandidate[], 
  setScreeningData: React.Dispatch<React.SetStateAction<ScreeningCandidate[]>>
) => {
  // Handle status change
  const handleStatusChange = async (candidate: ScreeningCandidate, status: "approved" | "rejected") => {
    try {
      // Convert candidate.id to string if it isn't already
      const candidateId = String(candidate.id);
      
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', candidateId);
      
      if (error) throw error;
      
      // Update local state
      setScreeningData(prevData =>
        prevData.map(c => c.id === candidate.id ? { ...c, status } : c)
      );
      
      toast({
        title: `Candidate ${status}`,
        description: `${candidate.name} has been ${status}.`,
        variant: status === "approved" ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Error updating candidate status:", err);
      toast({
        title: "Error updating status",
        description: "Failed to update candidate status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleStatusChange
  };
};
