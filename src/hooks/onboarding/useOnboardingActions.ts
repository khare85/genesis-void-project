
import { useCallback } from 'react';
import { OnboardingProgress } from '@/types/screening';
import { User } from '@/types';
import { toast } from 'sonner';

export const useOnboardingActions = (
  onboardingProgress: OnboardingProgress,
  setShowOnboarding: (show: boolean) => void,
  setIsNewUser: (isNew: boolean) => void,
  user: User | null
) => {
  // Internal function for state updates - moved to the top before any usage
  const setOnboardingProgress = useCallback((updater: (prev: OnboardingProgress) => OnboardingProgress) => {
    // This requires access to the current state which is only available in the parent component
    // We can create a custom event to communicate this back to the parent
    const event = new CustomEvent('update-onboarding-progress', { 
      detail: { updater }
    });
    document.dispatchEvent(event);
  }, []);

  const startOnboarding = useCallback(() => {
    console.log("Starting onboarding flow");
    setShowOnboarding(true);
  }, [setShowOnboarding]);

  const nextStep = useCallback(() => {
    console.log(`Moving to next step: ${Math.min(onboardingProgress.step + 1, 3)}`);
    setOnboardingProgress(prev => ({
      ...prev,
      step: Math.min(prev.step + 1, 3)
    }));
  }, [onboardingProgress.step, setOnboardingProgress]);

  const prevStep = useCallback(() => {
    setOnboardingProgress(prev => ({
      ...prev,
      step: Math.max(prev.step - 1, 0)
    }));
  }, [setOnboardingProgress]);

  const updateResumeData = useCallback((data: Partial<OnboardingProgress['resumeData']> & { jsonFilePath?: string | null }) => {
    setOnboardingProgress(prev => ({
      ...prev,
      resumeData: { 
        ...prev.resumeData, 
        ...data,
        // Add jsonFilePath if provided
        jsonFilePath: data.jsonFilePath !== undefined ? data.jsonFilePath : prev.resumeData.jsonFilePath
      },
      completedSteps: { 
        ...prev.completedSteps, 
        resume: Boolean(data.uploadedUrl || prev.resumeData.uploadedUrl || data.text || prev.resumeData.text) 
      }
    }));
  }, [setOnboardingProgress]);

  const updateVideoData = useCallback((data: Partial<OnboardingProgress['videoData']>) => {
    setOnboardingProgress(prev => ({
      ...prev,
      videoData: { ...prev.videoData, ...data },
      completedSteps: { 
        ...prev.completedSteps, 
        video: Boolean(data.uploadedUrl || prev.videoData.uploadedUrl) 
      }
    }));
  }, [setOnboardingProgress]);

  const completeOnboarding = useCallback(() => {
    console.log("Completing onboarding");
    setOnboardingProgress(prev => ({
      ...prev,
      hasStarted: false
    }));
    setShowOnboarding(false);
    setIsNewUser(false);
    
    // Mark onboarding as completed in local storage
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, "true");
      localStorage.removeItem(`is_new_user_${user.id}`);
    }
  }, [setShowOnboarding, setIsNewUser, user?.id, setOnboardingProgress]);

  const minimizeOnboarding = useCallback(() => {
    console.log("Minimizing onboarding");
    setOnboardingProgress(prev => ({
      ...prev,
      isMinimized: true
    }));
    setShowOnboarding(false);
  }, [setShowOnboarding, setOnboardingProgress]);

  const reopenOnboarding = useCallback(() => {
    console.log("Reopening onboarding");
    setOnboardingProgress(prev => ({
      ...prev,
      isMinimized: false,
      hasStarted: true
    }));
    setShowOnboarding(true);
  }, [setShowOnboarding, setOnboardingProgress]);

  // New resetOnboarding function
  const resetOnboarding = useCallback(() => {
    console.log("Resetting onboarding");
    toast.info("Starting the onboarding process from the beginning");
    
    // Reset to initial step and clear data
    setOnboardingProgress(prev => ({
      ...prev,
      step: 0,
      hasStarted: true,
      isMinimized: false,
      completedSteps: {
        resume: false,
        video: false
      },
      resumeData: {
        file: null,
        text: null,
        uploadedUrl: null,
        jsonFilePath: null
      },
      videoData: {
        blob: null,
        uploadedUrl: null
      }
    }));
    
    // Show the onboarding dialog
    setShowOnboarding(true);
    
    // If user exists, update localStorage to reflect reset
    if (user?.id) {
      localStorage.removeItem(`onboarding_completed_${user.id}`);
      localStorage.setItem(`is_new_user_${user.id}`, "true");
    }
  }, [setShowOnboarding, setOnboardingProgress, user?.id]);

  return {
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    updateResumeData,
    updateVideoData,
    minimizeOnboarding,
    reopenOnboarding,
    resetOnboarding
  };
};
