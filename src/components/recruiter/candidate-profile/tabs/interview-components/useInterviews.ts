
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Interview {
  id: string;
  type: string;
  status: string;
  scheduled_at: string;
  duration: number;
  metadata?: any;
}

export const useInterviews = (profileId: string) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        // Get all interviews for this candidate
        const { data: interviewsData, error } = await supabase
          .from('interviews')
          .select(`*`)
          .or(`metadata->candidateId.eq.${profileId}`);
          
        if (error) throw error;
        
        // Process and set interviews
        if (interviewsData) {
          const processed = interviewsData.map(interview => ({
            ...interview,
            // Ensure metadata is always an object even if null/undefined
            metadata: interview.metadata || {}
          }));
          setInterviews(processed);
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profileId) {
      fetchInterviews();
    }
  }, [profileId]);

  return {
    interviews,
    isLoading
  };
};
