
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';

interface CandidateSkill {
  id: string;
  skill_name: string;
  skill_level: number;
}

interface CandidateLanguage {
  id: string;
  language_name: string;
  proficiency: string;
}

interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
}

interface CandidateEducation {
  id: string;
  institution: string;
  degree: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface CandidateProject {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

interface CandidateCertificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
}

export interface CompleteCandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  avatar: string;
  bio: string;
  links: {
    portfolio: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
  };
  skills: CandidateSkill[];
  languages: CandidateLanguage[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  projects: CandidateProject[];
  certificates: CandidateCertificate[];
  applicationDetails: {
    status: string;
    matchScore: number;
    dateApplied: string;
    position: string;
    resume: string;
    videoIntro: string;
    screeningNotes: string;
  } | null;
}

export const useCompleteCandidateProfile = (id: string | undefined) => {
  const [profile, setProfile] = useState<CompleteCandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompleteProfile = async () => {
      if (!id) {
        setLoading(false);
        setError("No candidate ID provided");
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // First try to get the base profile information
        // Use maybeSingle() instead of single() to handle cases where the profile doesn't exist
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
        
        if (!profileData) {
          console.log("No profile found with ID:", id);
          // Try to find an application with this ID or where candidate_id equals this ID
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('*')
            .or(`id.eq.${id},candidate_id.eq.${id}`)
            .maybeSingle();
            
          if (applicationError && applicationError.code !== 'PGRST116') {
            console.error("Error fetching application:", applicationError);
            throw applicationError;
          }
          
          if (applicationData) {
            // Found an application - now fetch the associated profile using candidate_id
            const candidateId = applicationData.candidate_id;
            
            if (!candidateId) {
              throw new Error("Application found but no candidate_id available");
            }
            
            const { data: candidateProfileData, error: candidateProfileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', candidateId)
              .maybeSingle();
              
            if (candidateProfileError) {
              console.error("Error fetching candidate profile:", candidateProfileError);
              throw candidateProfileError;
            }
            
            if (!candidateProfileData) {
              throw new Error("Candidate profile not found");
            }
            
            // Continue with fetching additional data using the found candidate ID
            return await fetchAdditionalData(candidateProfileData, applicationData);
          } else {
            throw new Error("Profile or application not found");
          }
        } else {
          // Profile found directly, continue with fetching additional data
          const { data: applicationData } = await supabase
            .from('applications')
            .select('*')
            .eq('candidate_id', id)
            .maybeSingle();
            
          return await fetchAdditionalData(profileData, applicationData);
        }
      } catch (err: any) {
        console.error('Error fetching complete candidate profile:', err);
        setError(err.message || 'Failed to load candidate profile');
        toast.error('Error loading candidate profile');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchAdditionalData = async (profileData: any, applicationData: any) => {
      // Get skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('candidate_skills')
        .select('*')
        .eq('candidate_id', profileData.id);
        
      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
      }
      
      // Get languages
      const { data: languagesData, error: languagesError } = await supabase
        .from('candidate_languages')
        .select('*')
        .eq('candidate_id', profileData.id);
        
      if (languagesError) {
        console.error("Error fetching languages:", languagesError);
      }
      
      // Get experience
      const { data: experienceData, error: experienceError } = await supabase
        .from('candidate_experience')
        .select('*')
        .eq('candidate_id', profileData.id)
        .order('start_date', { ascending: false });
        
      if (experienceError) {
        console.error("Error fetching experience:", experienceError);
      }
      
      // Get education
      const { data: educationData, error: educationError } = await supabase
        .from('candidate_education')
        .select('*')
        .eq('candidate_id', profileData.id);
        
      if (educationError) {
        console.error("Error fetching education:", educationError);
      }
      
      // Get projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('candidate_projects')
        .select('*')
        .eq('candidate_id', profileData.id);
        
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      }
      
      // Get certificates
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('candidate_certificates')
        .select('*')
        .eq('candidate_id', profileData.id);
        
      if (certificatesError) {
        console.error("Error fetching certificates:", certificatesError);
      }

      // Construct the complete profile
      const completeProfile: CompleteCandidateProfile = {
        id: profileData.id,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown',
        email: profileData.email || 'No email provided',
        phone: profileData.phone || 'No phone provided',
        location: profileData.location || 'Location not specified',
        title: profileData.title || 'Title not specified',
        avatar: profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.id}`,
        bio: profileData.bio || 'No bio available',
        links: {
          portfolio: profileData.portfolio_url,
          github: profileData.github_url,
          linkedin: profileData.linkedin_url,
          twitter: profileData.twitter_url
        },
        skills: skillsData || [],
        languages: languagesData || [],
        experience: experienceData || [],
        education: educationData || [],
        projects: projectsData || [],
        certificates: certificatesData || [],
        applicationDetails: applicationData ? {
          status: applicationData.status || 'pending',
          matchScore: applicationData.match_score || 0,
          dateApplied: applicationData.created_at ? new Date(applicationData.created_at).toLocaleDateString() : 'Unknown',
          position: 'Position not specified', // Would need to join with jobs table to get the position
          resume: applicationData.resume_url || '',
          videoIntro: applicationData.video_url || '',
          screeningNotes: applicationData.notes || ''
        } : null
      };
      
      setProfile(completeProfile);
      return; // This function doesn't need to return anything as we're setting state
    };
    
    if (id) {
      fetchCompleteProfile();
    }
  }, [id]);
  
  return { profile, loading, error };
};
