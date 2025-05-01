
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScreeningCandidate } from '@/types/screening';
import { getMatchCategory } from '@/utils/matchCategoryUtils';

export const useJobApplicantsData = (jobId?: string) => {
  const [applicants, setApplicants] = useState<ScreeningCandidate[]>([]);
  const [job, setJob] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      if (!jobId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch the job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
          
        if (jobError) throw jobError;
        setJob(jobData);
        
        // Fetch applications for this job
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              title,
              department,
              location,
              type
            )
          `)
          .eq('job_id', jobId);
          
        if (applicationsError) throw applicationsError;
        
        // Get all candidate IDs from applications
        const candidateIds = applications?.map(app => app.candidate_id) || [];
        
        if (candidateIds.length === 0) {
          setApplicants([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch profiles for these candidates
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', candidateIds);
          
        if (profilesError) throw profilesError;
        
        // Fetch skills for these candidates (if needed)
        const { data: skills, error: skillsError } = await supabase
          .from('candidate_skills')
          .select('*')
          .in('candidate_id', candidateIds);
          
        if (skillsError) throw skillsError;
        
        // Map skills to candidates
        const candidateSkills: Record<string, string[]> = {};
        skills?.forEach(skill => {
          if (!candidateSkills[skill.candidate_id]) {
            candidateSkills[skill.candidate_id] = [];
          }
          candidateSkills[skill.candidate_id].push(skill.skill_name);
        });
        
        // Transform data to ScreeningCandidate format
        const applicantsList: ScreeningCandidate[] = applications?.map(app => {
          const profile = profiles?.find(p => p.id === app.candidate_id);
          const matchScore = app.match_score || Math.floor(Math.random() * 100);
          const stage = Math.floor(Math.random() * 4); // Random stage for demo
          const candidateSkillList = candidateSkills[app.candidate_id] || [];
          
          return {
            id: app.id,
            name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown Candidate',
            email: profile?.email || 'No email provided',
            phone: profile?.phone || 'No phone provided',
            location: profile?.location || 'Remote',
            status: app.status || 'pending',
            dateApplied: app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            jobRole: app.jobs?.title || 'Unknown Position',
            skills: candidateSkillList.length > 0 ? candidateSkillList : ['JavaScript', 'React', 'TypeScript'],
            experience: '3 years', // Would need to calculate from candidate_experience
            education: 'Bachelor\'s Degree', // Would need to fetch from candidate_education
            avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}`,
            videoIntro: app.video_url || 'https://example.com/video1.mp4',
            matchScore: matchScore,
            matchCategory: getMatchCategory(matchScore),
            screeningScore: app.screening_score || Math.floor(Math.random() * 100),
            screeningNotes: app.notes || '',
            aiSummary: '',
            reviewTime: Math.floor(Math.random() * 300) + 60,
            position: app.jobs?.title || 'Unknown Position',
            stage: stage,
            applicationDate: app.created_at ? new Date(app.created_at).toLocaleDateString() : new Date().toLocaleDateString()
          };
        }) || [];
        
        setApplicants(applicantsList);
      } catch (err: any) {
        console.error("Error fetching job applicants:", err);
        setError(err.message);
        toast({
          title: "Error loading applicants",
          description: "Failed to load applicant data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobAndApplicants();
  }, [jobId]);
  
  // Filter applicants based on search and filters
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      applicant.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && applicant.status === filter;
  });
  
  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
      case "oldest":
        return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
      case "match-high":
        return b.matchScore - a.matchScore;
      case "match-low":
        return a.matchScore - b.matchScore;
      default:
        return 0;
    }
  });
  
  return {
    job,
    applicants: sortedApplicants,
    isLoading,
    error,
    totalCount: applicants.length,
    filteredCount: filteredApplicants.length,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  };
};
