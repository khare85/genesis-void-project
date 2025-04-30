
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileData } from '@/types/profile';
import { getDefaultProfileData } from '@/data/defaultProfileData';

export const useProfileState = () => {
  const [profileData, setProfileData] = useState<ProfileData>(getDefaultProfileData());
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Check if completion guide should be shown from URL params
  const checkCompletionGuideFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('complete') === 'true') {
      setShowCompletionGuide(true);
    }
  };

  return {
    profileData,
    setProfileData,
    isLoading,
    setIsLoading,
    showCompletionGuide,
    setShowCompletionGuide,
    checkCompletionGuideFromUrl
  };
};
