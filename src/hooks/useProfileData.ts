
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { getDefaultProfileData } from '@/data/defaultProfileData';

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(getDefaultProfileData());
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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
      
      // Check if we should show the completion guide for demo users
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('complete') === 'true') {
        setShowCompletionGuide(true);
      } else {
        setShowCompletionGuide(false);
      }
      
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
        resumeUrl: profileData?.resume_url || '',
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

  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
    
    // Check for query param to force showing the guide
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('complete') === 'true') {
      setShowCompletionGuide(true);
    }
  }, [user, location.search]);

  const saveProfileData = async (formData: ProfileData) => {
    // Skip saving for demo users
    if (Object.values(DEMO_USERS).some(demoUser => demoUser.id === user?.id)) {
      toast.info("Profile updates for demo users are not saved to the database");
      setProfileData(formData);
      return;
    }
    
    try {
      // Update the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.personal.bio,
          location: formData.personal.location,
          title: formData.personal.title,
          portfolio_url: formData.personal.links.portfolio,
          github_url: formData.personal.links.github,
          linkedin_url: formData.personal.links.linkedin, 
          twitter_url: formData.personal.links.twitter,
          phone: formData.personal.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      // Update skills - delete old skills and insert new ones
      if (formData.skills && formData.skills.length > 0) {
        // First delete existing skills
        const { error: deleteSkillsError } = await supabase
          .from('candidate_skills')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteSkillsError) throw deleteSkillsError;
        
        // Then insert new skills
        const { error: insertSkillsError } = await supabase
          .from('candidate_skills')
          .insert(formData.skills.map(skill => ({
            candidate_id: user.id,
            skill_name: skill.name,
            skill_level: skill.level
          })));
          
        if (insertSkillsError) throw insertSkillsError;
      }

      // Update languages - delete old languages and insert new ones
      if (formData.languages && formData.languages.length > 0) {
        // First delete existing languages
        const { error: deleteLanguagesError } = await supabase
          .from('candidate_languages')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteLanguagesError) throw deleteLanguagesError;
        
        // Then insert new languages
        const { error: insertLanguagesError } = await supabase
          .from('candidate_languages')
          .insert(formData.languages.map(lang => ({
            candidate_id: user.id,
            language_name: lang.name,
            proficiency: lang.proficiency
          })));
          
        if (insertLanguagesError) throw insertLanguagesError;
      }

      // Update education entries
      if (formData.education && formData.education.length > 0) {
        // First delete existing education entries
        const { error: deleteEducationError } = await supabase
          .from('candidate_education')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteEducationError) throw deleteEducationError;
        
        // Then insert new education entries
        const { error: insertEducationError } = await supabase
          .from('candidate_education')
          .insert(formData.education.map(edu => ({
            candidate_id: user.id,
            institution: edu.institution,
            degree: edu.degree,
            start_date: edu.startDate,
            end_date: edu.endDate,
            description: edu.description
          })));
          
        if (insertEducationError) throw insertEducationError;
      }

      // Update certificates
      if (formData.certificates && formData.certificates.length > 0) {
        // First delete existing certificates
        const { error: deleteCertificatesError } = await supabase
          .from('candidate_certificates')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteCertificatesError) throw deleteCertificatesError;
        
        // Then insert new certificates
        const { error: insertCertificatesError } = await supabase
          .from('candidate_certificates')
          .insert(formData.certificates.map(cert => ({
            candidate_id: user.id,
            name: cert.name,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            expiry_date: cert.expiryDate,
            credential_id: cert.credentialId
          })));
          
        if (insertCertificatesError) throw insertCertificatesError;
      }

      // Update projects
      if (formData.projects && formData.projects.length > 0) {
        // First delete existing projects
        const { error: deleteProjectsError } = await supabase
          .from('candidate_projects')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteProjectsError) throw deleteProjectsError;
        
        // Then insert new projects
        const { error: insertProjectsError } = await supabase
          .from('candidate_projects')
          .insert(formData.projects.map(project => ({
            candidate_id: user.id,
            title: project.title,
            description: project.description,
            link: project.link,
            technologies: project.technologies
          })));
          
        if (insertProjectsError) throw insertProjectsError;
      }
      
      setProfileData(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to update your profile");
    }
  };

  return {
    profileData,
    setProfileData,
    isLoading,
    showCompletionGuide,
    setShowCompletionGuide,
    fetchProfileData,
    saveProfileData
  };
};
