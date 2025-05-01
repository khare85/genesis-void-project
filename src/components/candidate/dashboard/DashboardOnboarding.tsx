
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

  // Check if the user is a new user and start onboarding
  useEffect(() => {
    // Only for candidates
    if (user && user.role === 'candidate') {
      console.log('DashboardOnboarding: checking if user is new', { isNewUser, user });
      
      // Skip onboarding for demo users unless explicitly set as new
      const isDemo = user.email ? isDemoUser(user.email) : false;
      
      // Start onboarding immediately for new users
      if (isNewUser && !onboardingProgress.hasStarted) {
        console.log('Starting onboarding for new user immediately');
        startOnboarding();
      } else if (!isDemo) {
        // For real users, check if there's an incomplete onboarding process
        const isOnboardingComplete = localStorage.getItem(`onboarding_completed_${user.id}`);
        const onboardingProgressData = localStorage.getItem(`onboarding_progress_${user.id}`);
        const hasGeneratedProfile = localStorage.getItem(`profile_generated_${user.id}`);
        
        console.log('Checking onboarding status:', { 
          isOnboardingComplete, 
          onboardingProgressData,
          hasGeneratedProfile,
          userId: user.id
        });
        
        if (!checkingProfile && !hasGeneratedProfile && !isOnboardingComplete) {
          setCheckingProfile(true);
          // If they haven't generated their profile yet, mark as new user
          console.log("User hasn't generated profile yet, showing onboarding");
          setIsNewUser(true);
          startOnboarding();
          return;
        }
        
        if (onboardingProgressData && !isOnboardingComplete) {
          try {
            const progress = JSON.parse(onboardingProgressData);
            // If they started but didn't complete both steps and not minimized
            if (progress.hasStarted && 
                (!progress.completedSteps.resume || !progress.completedSteps.video)) {
              console.log('Found incomplete onboarding, resuming...');
              // Only reopen if not explicitly minimized
              if (!progress.isMinimized) {
                const timer = setTimeout(() => {
                  startOnboarding();
                }, 500);
                
                return () => clearTimeout(timer);
              }
            }
          } catch (e) {
            console.error("Error parsing saved onboarding progress:", e);
          }
        }
      }
    }
  }, [user, isNewUser, startOnboarding, onboardingProgress.hasStarted, setIsNewUser, checkingProfile]);

  return (
    <>
      <OnboardingModal />
      <ResumeOnboardingButton />
    </>
  );
};

export default DashboardOnboarding;
