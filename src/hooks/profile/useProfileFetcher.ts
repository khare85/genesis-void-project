
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { getDefaultProfileData } from '@/data/defaultProfileData';
import { fetchProfileInfo, fetchSkills, fetchLanguages, fetchExperience, fetchEducation, fetchCertificates, fetchProjects } from './utils/profileQueries';
import { mapSupabaseToProfileData, getEmptyProfileData } from './utils/profileDataMappers';

export const useProfileFetcher = (
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>,
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
      console.log('Fetching real user data for:', user.id);
      
      // Fetch all profile data in parallel
      const [
        profileResult,
        skillsResult,
        languagesResult,
        experienceResult,
        educationResult,
        certificatesResult,
        projectsResult
      ] = await Promise.all([
        fetchProfileInfo(user.id),
        fetchSkills(user.id),
        fetchLanguages(user.id),
        fetchExperience(user.id),
        fetchEducation(user.id),
        fetchCertificates(user.id),
        fetchProjects(user.id)
      ]);
      
      // Check for errors
      if (profileResult.error) throw profileResult.error;
      if (skillsResult.error) throw skillsResult.error;
      if (languagesResult.error) throw languagesResult.error;
      if (experienceResult.error) throw experienceResult.error;
      if (educationResult.error) throw educationResult.error;
      if (certificatesResult.error) throw certificatesResult.error;
      if (projectsResult.error) throw projectsResult.error;
      
      // Map data to ProfileData format
      const formattedData = mapSupabaseToProfileData(
        profileResult.data,
        skillsResult.data,
        languagesResult.data,
        experienceResult.data,
        educationResult.data,
        certificatesResult.data,
        projectsResult.data,
        user
      );

      setProfileData(formattedData);

      // Calculate profile completion for real users
      const isProfileIncomplete = 
        !profileResult.data?.bio || 
        formattedData.skills.length === 0 || 
        formattedData.experience.length === 0 || 
        formattedData.education.length === 0;
        
      setShowCompletionGuide(isProfileIncomplete);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load your profile data");
      
      // If we can't load data, initialize with empty data
      setProfileData(getEmptyProfileData(user));
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchProfileData };
};
