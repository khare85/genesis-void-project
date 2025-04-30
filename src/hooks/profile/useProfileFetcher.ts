
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { getEmptyProfileData } from './utils/profileDataMappers';
import { mapSupabaseToProfileData } from './utils/profileDataMappers';
import {
  fetchProfileInfo,
  fetchSkills,
  fetchLanguages,
  fetchEducation,
  fetchExperience,
  fetchCertificates,
  fetchProjects
} from './utils/profileQueries';

export const useProfileFetcher = (
  setProfileData: (data: ProfileData) => void, 
  setIsLoading: (loading: boolean) => void,
  setShowCompletionGuide: (show: boolean) => void
) => {
  const { user } = useAuth();

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profileData: ProfileData): number => {
    let score = 0;
    let total = 0;

    // Personal info checks (name, title, bio, etc)
    if (profileData.personal.name) score += 1;
    if (profileData.personal.title) score += 1;
    if (profileData.personal.bio) score += 1;
    if (profileData.personal.email) score += 1;
    if (profileData.personal.phone) score += 1;
    if (profileData.personal.location) score += 1;
    total += 6;

    // Links
    if (profileData.personal.links.linkedin) score += 1;
    if (profileData.personal.links.github) score += 1;
    if (profileData.personal.links.portfolio) score += 1;
    total += 3;

    // Education, experience, etc.
    if (profileData.education && profileData.education.length > 0) score += 2;
    if (profileData.experience && profileData.experience.length > 0) score += 2;
    if (profileData.skills && profileData.skills.length > 0) score += 1;
    if (profileData.languages && profileData.languages.length > 0) score += 1;
    if (profileData.projects && profileData.projects.length > 0) score += 2;
    total += 8;

    // Calculate percentage
    return Math.round((score / total) * 100);
  };

  const fetchProfileData = async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching profile");
      return;
    }
    
    // Skip database calls for demo users
    if (Object.values(DEMO_USERS).some(demoUser => demoUser.id === user?.id)) {
      console.log("Demo user detected, using mock data");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    console.log("Fetching profile data for user:", user.id);
    
    try {
      // Fetch all profile data in parallel
      const [
        profileInfoResult,
        skillsResult,
        languagesResult,
        educationResult,
        experienceResult,
        certificatesResult,
        projectsResult
      ] = await Promise.all([
        fetchProfileInfo(user.id),
        fetchSkills(user.id),
        fetchLanguages(user.id),
        fetchEducation(user.id),
        fetchExperience(user.id),
        fetchCertificates(user.id),
        fetchProjects(user.id)
      ]);

      // Handle potential errors from any query
      const errors = [
        profileInfoResult.error,
        skillsResult.error,
        languagesResult.error,
        educationResult.error,
        experienceResult.error,
        certificatesResult.error,
        projectsResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Errors fetching profile data:", errors);
        toast.error("Some profile data could not be loaded");
      }

      // Map Supabase data to ProfileData format
      const mappedData = mapSupabaseToProfileData(
        profileInfoResult.data || {},
        skillsResult.data || [],
        languagesResult.data || [],
        experienceResult.data || [],
        educationResult.data || [],
        certificatesResult.data || [],
        projectsResult.data || [],
        user
      );
      
      console.log("Fetched profile data:", {
        profileInfo: profileInfoResult.data,
        skills: skillsResult.data,
        languages: languagesResult.data,
        education: educationResult.data,
        experience: experienceResult.data,
        certificates: certificatesResult.data,
        projects: projectsResult.data,
      });
      
      // Make sure arrays are initialized
      mappedData.skills = mappedData.skills || [];
      mappedData.languages = mappedData.languages || [];
      mappedData.education = mappedData.education || [];
      mappedData.experience = mappedData.experience || [];
      mappedData.certificates = mappedData.certificates || [];
      mappedData.projects = mappedData.projects || [];
      
      // Update state with fetched data
      setProfileData(mappedData);
      
      // Calculate profile completion
      const completionPercentage = calculateProfileCompletion(mappedData);
      
      // Show completion guide for profiles less than 50% complete
      setShowCompletionGuide(completionPercentage < 50);
      
      console.log(`Profile completion: ${completionPercentage}%`);
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
      toast.error("Failed to load profile data");
      
      // Set empty profile data on error
      setProfileData(getEmptyProfileData(user));
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchProfileData };
};
