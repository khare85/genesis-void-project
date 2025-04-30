
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { 
  updateProfileInfo,
  updateSkills,
  updateLanguages,
  updateEducation,
  updateCertificates,
  updateProjects,
  updateExperience
} from './utils/profileMutations';

export const useProfileSaver = (setProfileData: (data: ProfileData) => void) => {
  const { user } = useAuth();

  const saveProfileData = async (formData: ProfileData) => {
    // Skip saving for demo users
    if (!user?.id || Object.values(DEMO_USERS).some(demoUser => demoUser.id === user?.id)) {
      toast.info("Profile updates for demo users are not saved to the database");
      setProfileData(formData);
      return;
    }
    
    try {
      // Update the basic profile
      const { error: profileError } = await updateProfileInfo(user.id, formData);
      if (profileError) throw profileError;

      // Update skills
      const { error: skillsError } = await updateSkills(user.id, formData.skills);
      if (skillsError) throw skillsError;

      // Update languages
      const { error: languagesError } = await updateLanguages(user.id, formData.languages);
      if (languagesError) throw languagesError;

      // Update education
      const { error: educationError } = await updateEducation(user.id, formData.education);
      if (educationError) throw educationError;

      // Update certificates
      const { error: certificatesError } = await updateCertificates(user.id, formData.certificates);
      if (certificatesError) throw certificatesError;

      // Update projects
      const { error: projectsError } = await updateProjects(user.id, formData.projects);
      if (projectsError) throw projectsError;
      
      // Update experience
      const { error: experienceError } = await updateExperience(user.id, formData.experience);
      if (experienceError) throw experienceError;
      
      setProfileData(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to update your profile");
    }
  };

  return { saveProfileData };
};
