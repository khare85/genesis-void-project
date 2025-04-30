
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ProfileData } from '@/types/profile';
import { useProfileState } from './useProfileState';
import { useProfileFetcher } from './useProfileFetcher';
import { useProfileSaver } from './useProfileSaver';
import { useProfileGenerator } from './useProfileGenerator';
import { useGenerateSkillsLanguages } from './useGenerateSkillsLanguages';

export const useProfileData = () => {
  const { user } = useAuth();
  const { 
    profileData, 
    setProfileData, 
    isLoading, 
    setIsLoading, 
    showCompletionGuide, 
    setShowCompletionGuide,
    checkCompletionGuideFromUrl
  } = useProfileState();
  
  const { fetchProfileData } = useProfileFetcher(setProfileData, setIsLoading, setShowCompletionGuide);
  const { saveProfileData } = useProfileSaver(setProfileData);
  const { isAIGenerating, generateProfileFromResume } = useProfileGenerator(user?.id, fetchProfileData);
  const { 
    isGeneratingSkills,
    isGeneratingLanguages,
    generateSkills,
    generateLanguages 
  } = useGenerateSkillsLanguages(setProfileData);

  useEffect(() => {
    if (user?.id) {
      // Immediately mark as loading to prevent showing default data
      setIsLoading(true);
      fetchProfileData();
    }
    
    // Check for query param to force showing the guide
    checkCompletionGuideFromUrl();
  }, [user]);

  return {
    profileData,
    setProfileData,
    isLoading,
    showCompletionGuide,
    setShowCompletionGuide,
    fetchProfileData,
    saveProfileData,
    isAIGenerating,
    generateProfileFromResume,
    isGeneratingSkills,
    isGeneratingLanguages,
    generateSkills,
    generateLanguages
  };
};

// Re-export individual hooks for direct import if needed
export { useProfileState } from './useProfileState';
export { useProfileFetcher } from './useProfileFetcher';
export { useProfileSaver } from './useProfileSaver';
export { useProfileGenerator } from './useProfileGenerator';
export { useGenerateSkillsLanguages } from './useGenerateSkillsLanguages';
