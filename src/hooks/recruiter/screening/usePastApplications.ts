
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScreeningCandidate } from '@/types/screening';

export const usePastApplications = (candidateId: string) => {
  const [pastApplications, setPastApplications] = useState<ScreeningCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPastApplications = async () => {
      setIsLoading(true);
      try {
        const { data: applications, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              title,
              department,
              type,
              location,
              company
            )
          `)
          .eq('candidate_id', candidateId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching past applications:', error);
          setIsLoading(false);
          return;
        }
        
        if (!applications || applications.length === 0) {
          setPastApplications([]);
          setIsLoading(false);
          return;
        }
        
        // Format application data
        const formattedApplications: ScreeningCandidate[] = applications.map(app => ({
          id: app.id,
          candidate_id: app.candidate_id,
          name: '',
          email: '',
          phone: '',
          location: '',
          status: app.status as "pending" | "approved" | "rejected",
          jobRole: app.jobs?.title || 'Unknown Position',
          company: app.jobs?.company || 'Unknown Company',
          skills: [],
          experience: '',
          education: '',
          avatar: '',
          videoIntro: '',
          matchScore: app.match_score || 0,
          screeningScore: app.screening_score || 0,
          position: app.jobs?.title || 'Unknown Position',
          applicationDate: new Date(app.created_at).toLocaleDateString(),
        }));
        
        setPastApplications(formattedApplications);
      } catch (err) {
        console.error("Error in usePastApplications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (candidateId) {
      fetchPastApplications();
    }
  }, [candidateId]);

  return { pastApplications, isLoading };
};
