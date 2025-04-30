
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';

export const useProfileSaver = (setProfileData: (data: ProfileData) => void) => {
  const { user } = useAuth();

  // Helper function to format partial dates for PostgreSQL
  const formatDateForDB = (partialDate: string | null): string | null => {
    if (!partialDate) return null;
    
    // If the date is already in YYYY-MM-DD format, return it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(partialDate)) return partialDate;
    
    // If the date is in YYYY-MM format, add '-01' to make it the first day of the month
    if (/^\d{4}-\d{2}$/.test(partialDate)) return `${partialDate}-01`;
    
    // Return null for invalid formats
    return null;
  };

  const saveProfileData = async (formData: ProfileData) => {
    // Skip saving for demo users
    if (!user?.id || Object.values(DEMO_USERS).some(demoUser => demoUser.id === user?.id)) {
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
            start_date: formatDateForDB(edu.startDate),
            end_date: formatDateForDB(edu.endDate),
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
            issue_date: formatDateForDB(cert.issueDate),
            expiry_date: formatDateForDB(cert.expiryDate),
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
      
      // Update experience entries
      if (formData.experience && formData.experience.length > 0) {
        // First delete existing experience entries
        const { error: deleteExperienceError } = await supabase
          .from('candidate_experience')
          .delete()
          .eq('candidate_id', user.id);
          
        if (deleteExperienceError) throw deleteExperienceError;
        
        // Then insert new experience entries
        const { error: insertExperienceError } = await supabase
          .from('candidate_experience')
          .insert(formData.experience.map(exp => ({
            candidate_id: user.id,
            company: exp.company,
            title: exp.title,
            location: exp.location,
            start_date: formatDateForDB(exp.startDate),
            end_date: formatDateForDB(exp.endDate),
            current: exp.current,
            description: exp.description
          })));
          
        if (insertExperienceError) throw insertExperienceError;
      }
      
      setProfileData(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to update your profile");
    }
  };

  return { saveProfileData };
};
