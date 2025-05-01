import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import ResumeOnboardingButton from '@/components/onboarding/ResumeOnboardingButton';
import { isDemoUser } from '@/lib/auth/mockUsers';

const DashboardOnboarding = () => {
  const { user } = useAuth();
  const { isNewUser, startOnboarding, onboardingProgress, setIsNewUser } = useOnboarding();
  const [checkingProfile, setCheckingProfile] = useState(false);

  // We're keeping the component structure but disabling automatic onboarding initialization
  useEffect(() => {
    // This effect is now disabled - onboarding won't start automatically
    console.log('Onboarding popup disabled');
    
    // We'll still set up the state correctly, but won't call startOnboarding()
    if (user && user.role === 'candidate') {
      const isDemo = user.email ? isDemoUser(user.email) : false;
      
      // For real users, still check and store onboarding status but don't start it
      if (!isDemo && !checkingProfile) {
        setCheckingProfile(true);
        const hasGeneratedProfile = localStorage.getItem(`profile_generated_${user.id}`);
        const isOnboardingComplete = localStorage.getItem(`onboarding_completed_${user.id}`);
        
        if (!hasGeneratedProfile && !isOnboardingComplete) {
          console.log("User hasn't generated profile yet, but onboarding is disabled");
          setIsNewUser(true);
        }
      }
    }
  }, [user, isNewUser, setIsNewUser, checkingProfile]);

  return (
    <>
      <OnboardingModal />
      <ResumeOnboardingButton />
    </>
  );
};

export default DashboardOnboarding;
