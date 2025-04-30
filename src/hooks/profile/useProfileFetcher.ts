
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { getDefaultProfileData } from '@/data/defaultProfileData';

export const useProfileFetcher = (
  setProfileData: (data: ProfileData) => void,
  setIsLoading: (loading: boolean) => void,
  setShowCompletionGuide: (show: boolean) => void
) => {
  const { user } = useAuth();

  const fetchProfileData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    // Check if the user is one of the demo users
    const isDemoUser = Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id);
    
    if (isDemoUser) {
      // For demo users, use the mock data
      console.log('Demo user detected, using mock data');
      setProfileData(getDefaultProfileData());
      setIsLoading(false);
      return;
    }
    
    // For real users, fetch their data from Supabase
    try {
      // Get basic profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;

      // Get skills
      const { data: skills, error: skillsError } = await supabase
        .from('candidate_skills')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (skillsError) throw skillsError;

      // Get languages
      const { data: languages, error: languagesError } = await supabase
        .from('candidate_languages')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (languagesError) throw languagesError;

      // Get experience
      const { data: experience, error: experienceError } = await supabase
        .from('candidate_experience')
        .select('*')
        .eq('candidate_id', user.id)
        .order('start_date', { ascending: false });
        
      if (experienceError) throw experienceError;

      // Get education
      const { data: education, error: educationError } = await supabase
        .from('candidate_education')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (educationError) throw educationError;

      // Get certificates
      const { data: certificates, error: certificatesError } = await supabase
        .from('candidate_certificates')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (certificatesError) throw certificatesError;

      // Get projects
      const { data: projects, error: projectsError } = await supabase
        .from('candidate_projects')
        .select('*')
        .eq('candidate_id', user.id);
        
      if (projectsError) throw projectsError;

      // Format data for the profile
      const formattedData: ProfileData = {
        personal: {
          name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || user.name || 'Anonymous User',
          title: profileData?.title || '',
          email: profileData?.email || user.email || '',
          phone: profileData?.phone || '',
          location: profileData?.location || '',
          avatarUrl: profileData?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          bio: profileData?.bio || '',
          links: {
            portfolio: profileData?.portfolio_url || '',
            github: profileData?.github_url || '',
            linkedin: profileData?.linkedin_url || '',
            twitter: profileData?.twitter_url || '',
          }
        },
        skills: skills?.map(skill => ({
          name: skill.skill_name,
          level: skill.skill_level
        })) || [],
        languages: languages?.map(lang => ({
          name: lang.language_name,
          proficiency: lang.proficiency
        })) || [],
        experience: experience?.map((exp) => ({
          id: exp.id,
          company: exp.company,
          title: exp.title,
          location: exp.location,
          startDate: exp.start_date ? exp.start_date.substring(0, 7) : '',
          endDate: exp.end_date ? exp.end_date.substring(0, 7) : null,
          current: exp.current,
          description: exp.description,
          skills: []
        })) || [],
        education: education?.map(edu => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.start_date ? edu.start_date.substring(0, 7) : '',
          endDate: edu.end_date ? edu.end_date.substring(0, 7) : '',
          description: edu.description
        })) || [],
        certificates: certificates?.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date ? cert.issue_date.substring(0, 7) : '',
          expiryDate: cert.expiry_date ? cert.expiry_date.substring(0, 7) : null,
          credentialId: cert.credential_id
        })) || [],
        projects: projects?.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          link: project.link,
          technologies: project.technologies || []
        })) || [],
        resumeUrl: '', // Default empty string
        videoInterview: null
      };

      setProfileData(formattedData);

      // Calculate profile completion for real users
      const isProfileIncomplete = 
        !profileData?.bio || 
        formattedData.skills.length === 0 || 
        formattedData.experience.length === 0 || 
        formattedData.education.length === 0;
        
      setShowCompletionGuide(isProfileIncomplete);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load your profile data");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchProfileData };
};
