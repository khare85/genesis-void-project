
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { candidatesData } from '@/data/candidates-data';

export interface Candidate {
  id: string | number;
  candidate_id?: string;
  name: string;
  email?: string; // Make email optional to match candidatesData structure
  phone?: string;
  position: string;
  status: string;
  profilePic?: string;
  matchScore: number;
  appliedDate: string;
  company?: string;
  source?: string;
  stage?: string;
  folderId?: string | null;
  jobId?: string;
  jobTitle?: string;
  location?: string; // Add location to match candidatesData
  education?: string; // Add education to match candidatesData
  experience?: string; // Add experience to match candidatesData
  skills?: string[]; // Add skills to match candidatesData
  videoIntro?: string; // Add videoIntro to match candidatesData
}

export const useCandidatesData = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Try to fetch real candidates data from applications
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            candidate_id,
            jobs(title, id, posted_by)
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          // If there's an error, fall back to mock data but log the error
          console.error('Error fetching candidates:', error);
          setCandidates(candidatesData as Candidate[]);
          return;
        }
        
        if (data && data.length > 0) {
          // If we have real data, use it
          const formattedCandidates = data.map(app => ({
            id: app.candidate_id,
            applicationId: app.id,
            position: app.jobs?.title || 'Unknown Position',
            status: app.status,
            appliedDate: app.created_at,
            // Other fields needed
            name: `Candidate ${app.id.substring(0, 3)}`,
            email: `candidate${app.id.substring(0, 3)}@example.com`,
            matchScore: Math.floor(60 + Math.random() * 40), // Random score between 60-100
          }));
          
          setCandidates(formattedCandidates);
        } else {
          // If no data, fall back to mock data
          setCandidates(candidatesData as Candidate[]);
        }
      } catch (e) {
        // If there's a runtime error, fall back to mock data
        console.error('Error in useCandidatesData:', e);
        setCandidates(candidatesData as Candidate[]);
        setError('Failed to load candidates');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [user?.id]);
  
  const refreshCandidates = () => {
    setIsLoading(true);
    // In a real implementation, this would refetch data
    // For now, we'll just re-set the mock data after a delay
    setTimeout(() => {
      setCandidates(candidatesData as Candidate[]);
      setIsLoading(false);
      toast({
        title: "Candidates refreshed",
        description: "The candidates list has been refreshed"
      });
    }, 500);
  };

  // Filter candidates based on search query and status filter
  const filteredCandidates = candidates.filter(candidate => {
    if (filter !== "all" && candidate.status !== filter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query) ||
        (candidate.email && candidate.email.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  return {
    candidates: filteredCandidates,
    isLoading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount: filteredCandidates.length,
    refreshCandidates
  };
};
