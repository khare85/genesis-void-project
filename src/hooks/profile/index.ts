
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ProfileData } from '@/types/profile';
import { useProfileState } from './useProfileState';
import { useProfileFetcher } from './useProfileFetcher';
import { useProfileSaver } from './useProfileSaver';
import { useProfileGenerator } from './useProfileGenerator';

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

  useEffect(() => {
    if (user?.id) {
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
    generateProfileFromResume
  };
};
