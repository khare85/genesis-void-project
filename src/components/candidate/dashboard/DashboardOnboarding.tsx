
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import ResumeOnboardingButton from '@/components/onboarding/ResumeOnboardingButton';

const DashboardOnboarding = () => {
  const { user } = useAuth();
  const { isNewUser, startOnboarding } = useOnboarding();

  // Check if the user is a new user and start onboarding
  useEffect(() => {
    // Only for candidates
    if (user && user.role === 'candidate') {
      if (isNewUser) {
        // Delay a bit to allow dashboard to load first
        const timer = setTimeout(() => {
          startOnboarding();
        }, 500);
        
        return () => clearTimeout(timer);
      } else {
        // Check if there's an incomplete onboarding process
        const isOnboardingComplete = localStorage.getItem(`onboarding_completed_${user.id}`);
        const onboardingProgress = localStorage.getItem(`onboarding_progress_${user.id}`);
        
        if (onboardingProgress && !isOnboardingComplete) {
          try {
            const progress = JSON.parse(onboardingProgress);
            // If they started but didn't complete both steps
            if (progress.hasStarted && 
                (!progress.completedSteps.resume || !progress.completedSteps.video)) {
              // Let them continue from where they left off
              const timer = setTimeout(() => {
                startOnboarding();
              }, 500);
              
              return () => clearTimeout(timer);
            }
          } catch (e) {
            console.error("Error parsing saved onboarding progress:", e);
          }
        }
      }
    }
  }, [user, isNewUser, startOnboarding]);

  return (
    <>
      <OnboardingModal />
      <ResumeOnboardingButton />
    </>
  );
};

export default DashboardOnboarding;
