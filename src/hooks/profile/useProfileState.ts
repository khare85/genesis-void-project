
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileData } from '@/types/profile';
import { useAuth } from '@/lib/auth';
import { DEMO_USERS } from '@/lib/auth/mockUsers';
import { getDefaultProfileData } from '@/data/defaultProfileData';

export const useProfileState = () => {
  const { user } = useAuth();
  const isDemoUser = user ? Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id) : false;
  
  // Initialize with empty data for real users
  const initialProfileData: ProfileData = isDemoUser 
    ? getDefaultProfileData() 
    : {
        personal: {
          name: user?.name || '',
          title: '',
          email: user?.email || '',
          phone: '',
          location: '',
          avatarUrl: user?.avatarUrl || '',
          bio: '',
          links: { portfolio: '', github: '', linkedin: '', twitter: '' }
        },
        skills: [],
        languages: [],
        experience: [],
        education: [],
        certificates: [],
        projects: [],
        resumeUrl: '',
        videoInterview: null
      };
  
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
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
