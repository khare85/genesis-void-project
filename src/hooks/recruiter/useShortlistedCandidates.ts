
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Candidate } from '@/hooks/recruiter/useCandidatesData';
import { useAuth } from '@/lib/auth';

export const useShortlistedCandidates = (jobFilter?: string | null) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter] = useState("shortlisted"); // Fixed to shortlisted
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  
  // Add a function to trigger refreshing the candidates data
  const refreshCandidates = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        // Start building the query
        let query = supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            candidate_id,
            job_id,
            match_score,
            folder_id,
            jobs (
              id,
              title,
              posted_by
            )
          `)
          .eq('status', 'shortlisted');
          
        // Add job filter if provided
        if (jobFilter) {
          query = query.eq('job_id', jobFilter);
        } else if (user?.id) {
          // If no specific job is selected, fetch candidates for all jobs created by the current manager
          query = query.eq('jobs.posted_by', user.id);
        }
        
        const { data: applications, error } = await query;
          
        if (error) {
          throw error;
        }
        
        // Fetch candidate profiles
        const candidateIds = applications?.map(app => app.candidate_id) || [];
        
        if (candidateIds.length === 0) {
          setCandidates([]);
          setIsLoading(false);
          return;
        }
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', candidateIds);
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Transform data to Candidate format
        const candidatesList: Candidate[] = applications?.map(app => {
          const profile = profiles?.find(p => p.id === app.candidate_id);
          return {
            id: app.id,
            candidate_id: app.candidate_id,
            name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown Candidate',
            email: profile?.email || 'No email provided',
            phone: profile?.phone || 'No phone provided',
            position: profile?.title || app.jobs?.title || 'Unknown Position',
            status: app.status || 'shortlisted',
            profilePic: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}`,
            matchScore: app.match_score || Math.floor(Math.random() * 100),
            appliedDate: new Date(app.created_at).toISOString(),
            company: profile?.company || 'Not specified',
            source: 'LinkedIn_APPLY',
            stage: 'Shortlisted',
            folderId: app.folder_id,
            jobId: app.job_id,
            jobTitle: app.jobs?.title
          };
        }) || [];
        
        setCandidates(candidatesList);
      } catch (err: any) {
        console.error("Error fetching candidates:", err);
        setError(err.message);
        toast({
          title: "Error loading candidates",
          description: "Failed to load candidate data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [refreshTrigger, filter, jobFilter, user?.id]);
  
  // Filter candidates based on search query
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchQuery === "" || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  return {
    candidates: filteredCandidates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    totalCount: candidates.length,
    filteredCount: filteredCandidates.length,
    refreshCandidates
  };
};
