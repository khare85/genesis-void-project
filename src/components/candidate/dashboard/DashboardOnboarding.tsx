
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/context/OnboardingContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import ResumeOnboardingButton from '@/components/onboarding/ResumeOnboardingButton';
import { isDemoUser } from '@/lib/auth/mockUsers';

const DashboardOnboarding = () => {
  const { user } = useAuth();
  const { isNewUser, startOnboarding } = useOnboarding();

  // Check if the user is a new user and start onboarding
  useEffect(() => {
    // Only for candidates
    if (user && user.role === 'candidate') {
      console.log('DashboardOnboarding: checking if user is new', { isNewUser, user });
      
      // Skip onboarding for demo users unless explicitly set as new
      const isDemo = user.email ? isDemoUser(user.email) : false;
      
      if (isNewUser) {
        // Delay a bit to allow dashboard to load first
        const timer = setTimeout(() => {
          console.log('Starting onboarding for new user');
          startOnboarding();
        }, 500);
        
        return () => clearTimeout(timer);
      } else if (!isDemo) {
        // For real users, check if there's an incomplete onboarding process
        const isOnboardingComplete = localStorage.getItem(`onboarding_completed_${user.id}`);
        const onboardingProgress = localStorage.getItem(`onboarding_progress_${user.id}`);
        
        console.log('Checking onboarding status:', { isOnboardingComplete, onboardingProgress });
        
        if (onboardingProgress && !isOnboardingComplete) {
          try {
            const progress = JSON.parse(onboardingProgress);
            // If they started but didn't complete both steps
            if (progress.hasStarted && 
                (!progress.completedSteps.resume || !progress.completedSteps.video)) {
              console.log('Found incomplete onboarding, resuming...');
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
