
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Candidate } from '@/hooks/recruiter/useCandidatesData';
import { useAuth } from '@/lib/auth';

// Mock data for shortlisted candidates when none are found
const mockShortlistedCandidates: Candidate[] = [
  {
    id: "mock-1",
    candidate_id: "mc-1",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Frontend Developer",
    status: "shortlisted",
    profilePic: "/lovable-uploads/edd4b93b-333a-42de-abf0-2ffa16a82666.jpg",
    matchScore: 92,
    appliedDate: new Date().toISOString(),
    company: "TechCorp",
    source: "LinkedIn",
    stage: "Shortlisted",
    folderId: null,
    jobId: "job-1",
    jobTitle: "Senior Frontend Developer"
  },
  {
    id: "mock-2",
    candidate_id: "mc-2",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    phone: "+1 (555) 234-5678",
    position: "UX Designer",
    status: "shortlisted",
    profilePic: "/lovable-uploads/190e648d-5f47-496e-9fb5-ed5e3ac62af5.png",
    matchScore: 85,
    appliedDate: new Date().toISOString(),
    company: "DesignStudio",
    source: "Indeed",
    stage: "Shortlisted",
    folderId: null,
    jobId: "job-2",
    jobTitle: "UX Designer"
  },
  {
    id: "mock-3",
    candidate_id: "mc-3",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+1 (555) 345-6789",
    position: "Data Scientist",
    status: "shortlisted",
    profilePic: "/lovable-uploads/2564f89a-2d91-4251-a6ab-f82d9c9ed4b0.png",
    matchScore: 78,
    appliedDate: new Date().toISOString(),
    company: "DataInsights",
    source: "Referral",
    stage: "Shortlisted",
    folderId: null,
    jobId: "job-3",
    jobTitle: "Data Scientist"
  },
  {
    id: "mock-4",
    candidate_id: "mc-4",
    name: "Sarah Kim",
    email: "sarah.kim@example.com",
    phone: "+1 (555) 456-7890",
    position: "Product Manager",
    status: "shortlisted",
    profilePic: "/lovable-uploads/aca11823-5bec-4b96-b66f-db72aa94e876.png",
    matchScore: 88,
    appliedDate: new Date().toISOString(),
    company: "ProductCo",
    source: "Company Website",
    stage: "Shortlisted",
    folderId: null,
    jobId: "job-1",
    jobTitle: "Senior Frontend Developer"
  }
];

export const useShortlistedCandidates = (jobFilter?: string | null) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter] = useState("shortlisted"); // Fixed to shortlisted
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const [useMockData, setUseMockData] = useState(false);
  
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
        
        if (!applications || applications.length === 0) {
          setUseMockData(true);
          setCandidates(mockShortlistedCandidates);
          setIsLoading(false);
          return;
        }
        
        // Fetch candidate profiles
        const candidateIds = applications?.map(app => app.candidate_id) || [];
        
        if (candidateIds.length === 0) {
          setUseMockData(true);
          setCandidates(mockShortlistedCandidates);
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
        
        setUseMockData(false);
        setCandidates(candidatesList);
      } catch (err: any) {
        console.error("Error fetching candidates:", err);
        setError(err.message);
        setUseMockData(true);
        setCandidates(mockShortlistedCandidates);
        toast({
          title: "Error loading candidates",
          description: "Failed to load candidate data. Showing mock data instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [refreshTrigger, filter, jobFilter, user?.id]);
  
  // Filter candidates based on search query and job if needed
  const filteredCandidates = candidates.filter(candidate => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by job if jobFilter is provided and we're using mock data
    const matchesJob = !jobFilter || !useMockData || candidate.jobId === jobFilter;
    
    return matchesSearch && matchesJob;
  });
  
  return {
    candidates: filteredCandidates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    totalCount: filteredCandidates.length,
    filteredCount: filteredCandidates.length,
    refreshCandidates
  };
};
