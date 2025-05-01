
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Candidate {
  id: string;
  candidate_id: string;  // Added to store the actual candidate ID
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  profilePic: string;
  matchScore: number;
  appliedDate: string;
  company: string;
  source: string;
  stage: string;
  folderId: string | null;
}

export const useCandidatesData = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add a function to trigger refreshing the candidates data
  const refreshCandidates = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        // Fetch applications with job details
        const { data: applications, error } = await supabase
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
              title
            )
          `);
          
        if (error) {
          throw error;
        }
        
        // Fetch candidate profiles
        const candidateIds = applications?.map(app => app.candidate_id) || [];
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
            status: app.status || 'new',
            profilePic: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}`,
            matchScore: app.match_score || Math.floor(Math.random() * 100),
            appliedDate: new Date(app.created_at).toISOString(),
            company: profile?.company || 'Not specified',
            source: 'LinkedIn_APPLY',
            stage: 'Applied',
            folderId: app.folder_id
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
  }, [refreshTrigger]);
  
  // Update candidate folder
  const updateCandidateFolder = async (candidateId: string, folderId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ folder_id: folderId })
        .eq('id', candidateId);
        
      if (error) throw error;
      
      // Update local state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, folderId } 
            : candidate
        )
      );
      
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
  
  // Filter candidates based on search query and status
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchQuery === "" || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = filter === "all" || candidate.status === filter;
    
    return matchesSearch && matchesStatus;
  });
  
  return {
    candidates: filteredCandidates,
    isLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount: candidates.length,
    filteredCount: filteredCandidates.length,
    updateCandidateFolder,
    refreshCandidates
  };
};
