
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScreeningCandidate } from '@/types/screening';
import { toast } from '@/hooks/use-toast';
import { getMatchCategory, extractMatchCategory } from '@/utils/matchCategoryUtils';

export const useCandidateFetcher = () => {
  const [screeningData, setScreeningData] = useState<ScreeningCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // Fetch candidate skills
        const { data: skills, error: skillsError } = await supabase
          .from('candidate_skills')
          .select('*')
          .in('candidate_id', candidateIds);

        if (skillsError) {
          throw skillsError;
        }

        // Group skills by candidate_id
        const candidateSkills: Record<string, string[]> = {};
        skills?.forEach(skill => {
          if (!candidateSkills[skill.candidate_id]) {
            candidateSkills[skill.candidate_id] = [];
          }
          candidateSkills[skill.candidate_id].push(skill.skill_name);
        });
        
        // Transform data to ScreeningCandidate format
        const formattedData: ScreeningCandidate[] = applications?.map(app => {
          const candidate = candidates?.find(c => c.id === app.candidate_id);
          const matchScore = app.match_score || Math.floor(Math.random() * 30) + 60; // Use real score or fallback
          const candidateSkillList = candidateSkills[app.candidate_id] || [];
          
          // Determine match category
          let matchCategory = getMatchCategory(matchScore);
          
          // Try to extract match category from screening notes, if available
          const extractedCategory = extractMatchCategory(app.notes || '');
          if (extractedCategory) {
            matchCategory = extractedCategory as any;
          }
          
          return {
            id: app.id,
            candidate_id: app.candidate_id,
            name: `${candidate?.first_name || ''} ${candidate?.last_name || ''}`.trim() || 'Unknown Candidate',
            email: candidate?.email || 'No email provided',
            phone: candidate?.phone || 'No phone provided',
            location: candidate?.location || 'Remote',
            status: app.status as "pending" | "approved" | "rejected" || 'pending',
            dateApplied: new Date(app.created_at).toISOString().split('T')[0],
            jobRole: app.jobs?.title || 'Unknown Position',
            skills: candidateSkillList.length > 0 ? candidateSkillList : ['React', 'JavaScript'],
            experience: '3+ years', // Would need to calculate from candidate_experience
            education: 'Bachelor\'s Degree', // Would need to fetch from candidate_education
            avatar: candidate?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.id}`,
            videoIntro: app.video_url || '',
            matchScore,
            matchCategory,
            screeningScore: app.screening_score || Math.floor(Math.random() * 30) + 60, // Use real score or fallback
            screeningNotes: app.notes || 'No screening notes available.',
            aiSummary: 'AI screening not yet performed.',
            reviewTime: Math.floor(Math.random() * 300) + 60, // Random review time between 1-6 minutes
            position: app.jobs?.title || 'Unknown Position',
            stage: 0, // Default stage
            applicationDate: new Date(app.created_at).toLocaleDateString()
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

  return {
    screeningData,
    setScreeningData,
    isLoading
  };
};
