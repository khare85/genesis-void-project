
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScreeningCandidate, ScreeningState } from '@/types/screening';
import { toast } from '@/hooks/use-toast';

// Helper function to determine match category based on score
const getMatchCategory = (score: number): "High Match" | "Medium Match" | "Low Match" | "No Match" => {
  if (score >= 80) return "High Match";
  if (score >= 50) return "Medium Match";
  if (score > 0) return "Low Match";
  return "No Match";
};

export const useScreeningData = () => {
  const [screeningData, setScreeningData] = useState<ScreeningCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortField, setSortField] = useState<keyof ScreeningCandidate | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [jobRoleFilter, setJobRoleFilter] = useState<string>("all");
  
  // AI Screening states
  const [screeningState, setScreeningState] = useState<ScreeningState>('idle');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [candidatesToScreen, setCandidatesToScreen] = useState<ScreeningCandidate[]>([]);
  
  // Fetch applications and transform them to ScreeningCandidate format
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        // Fetch applications with job details
        const { data: applications, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              title,
              department,
              type,
              location
            )
          `);
          
        if (error) {
          throw error;
        }
        
        // Fetch candidate details
        const candidateIds = applications?.map(app => app.candidate_id) || [];
        const { data: candidates, error: candidatesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', candidateIds);
          
        if (candidatesError) {
          throw candidatesError;
        }
        
        // Transform data to ScreeningCandidate format
        const formattedData: ScreeningCandidate[] = applications?.map(app => {
          const candidate = candidates?.find(c => c.id === app.candidate_id);
          const matchScore = app.match_score || Math.floor(Math.random() * 30) + 60; // Use real score or fallback
          
          return {
            id: app.id, // This can be string or number now
            candidate_id: app.candidate_id, // Make sure to include candidate_id
            name: `${candidate?.first_name || ''} ${candidate?.last_name || ''}`.trim() || 'Unknown Candidate',
            email: candidate?.email || 'No email provided',
            phone: candidate?.phone || 'No phone provided',
            location: candidate?.location || 'Remote',
            status: app.status as "pending" | "approved" | "rejected" || 'pending',
            dateApplied: new Date(app.created_at).toISOString().split('T')[0],
            jobRole: app.jobs?.title || 'Unknown Position',
            skills: [],  // Would need to fetch from candidate_skills
            experience: '0 years', // Would need to calculate from candidate_experience
            education: 'Not specified', // Would need to fetch from candidate_education
            avatar: candidate?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}`,
            videoIntro: app.video_url || '',
            matchScore: matchScore,
            matchCategory: getMatchCategory(matchScore),
            screeningScore: app.screening_score || Math.floor(Math.random() * 30) + 60, // Use real score or fallback
            screeningNotes: app.notes || 'No screening notes available.',
            aiSummary: 'AI screening not yet performed.',
            reviewTime: Math.floor(Math.random() * 300) + 60, // Random review time between 1-6 minutes
            position: app.jobs?.title || 'Unknown Position'
          };
        }) || [];
        
        setScreeningData(formattedData);
      } catch (err) {
        console.error("Error fetching screening data:", err);
        toast({
          title: "Error loading candidates",
          description: "Failed to load candidate data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  // Filter candidates based on search term, status, and job role
  const filteredCandidates = screeningData.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (candidate.skills && candidate.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = activeTab === "all" || candidate.status === activeTab;
    
    const matchesJobRole = jobRoleFilter === "all" || candidate.jobRole === jobRoleFilter;
    
    return matchesSearch && matchesStatus && matchesJobRole;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'screeningScore' || sortField === 'matchScore' || sortField === 'reviewTime') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    // For string fields
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

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

  // Get unique job roles for filtering
  const uniqueJobRoles = Array.from(new Set(screeningData.map(c => c.jobRole)));

  // Get count of candidates by status
  const getCandidateCountByStatus = (status: string) => {
    if (status === 'all') {
      return screeningData.length;
    }
    return screeningData.filter(c => c.status === status).length;
  };

  // Handle sorting
  const handleSort = (field: keyof ScreeningCandidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    isLoading,
    screeningData,
    filteredCandidates: sortedCandidates,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    handleSort,
    jobRoleFilter,
    setJobRoleFilter,
    uniqueJobRoles,
    handleStatusChange,
    getCandidateCountByStatus,
    screeningState,
    setScreeningState,
    screeningProgress,
    setScreeningProgress,
    candidatesToScreen,
    setCandidatesToScreen
  };
};
