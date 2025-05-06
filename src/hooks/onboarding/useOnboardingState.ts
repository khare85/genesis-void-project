
import { useState, useEffect } from 'react';
import { OnboardingProgress, OnboardingStep } from '@/types/screening';
import { User } from '@/types';

const defaultOnboardingProgress: OnboardingProgress = {
  hasStarted: false,
  step: 0,
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
  },
  isMinimized: false
};

const ONBOARDING_STEPS: OnboardingStep[] = ['welcome', 'resume', 'video', 'completion'];

export const useOnboardingState = (user: User | null) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>(defaultOnboardingProgress);

  // Determine the current onboarding step
  const currentStep = ONBOARDING_STEPS[onboardingProgress.step] || 'welcome';

  // Handle custom events from the actions hook
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      const { updater } = event.detail;
      setOnboardingProgress(current => updater(current));
    };

    // Add event listener
    document.addEventListener('update-onboarding-progress', handleProgressUpdate as EventListener);
    
    return () => {
      // Clean up event listener
      document.removeEventListener('update-onboarding-progress', handleProgressUpdate as EventListener);
    };
  }, []);

  // Check local storage for onboarding progress and isNewUser status when component mounts
  useEffect(() => {
    if (user?.id) {
      // Check for isNewUser flag
      const newUserFlag = localStorage.getItem(`is_new_user_${user.id}`);
      if (newUserFlag === 'true') {
        console.log("Found new user flag in localStorage", user.id);
        setIsNewUser(true);
        // Remove the flag so it's only used once
        localStorage.removeItem(`is_new_user_${user.id}`);
      }
      
      const savedProgress = localStorage.getItem(`onboarding_progress_${user.id}`);
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          // Filter out non-serializable data like File and Blob
          const sanitizedProgress = {
            ...parsedProgress,
            resumeData: {
              ...parsedProgress.resumeData,
              file: null
            },
            videoData: {
              ...parsedProgress.videoData,
              blob: null
            }
          };
          setOnboardingProgress(sanitizedProgress);
          
          // If onboarding has started but not completed, show it
          if (sanitizedProgress.hasStarted && 
              !sanitizedProgress.isMinimized && 
              (!sanitizedProgress.completedSteps.resume || !sanitizedProgress.completedSteps.video)) {
            console.log("Found incomplete onboarding progress, showing onboarding", sanitizedProgress);
            setShowOnboarding(true);
          }
        } catch (e) {
          console.error("Error parsing saved onboarding progress:", e);
        }
      }
    }
  }, [user?.id]);

  // Save progress to local storage when it changes
  useEffect(() => {
    if (user?.id && onboardingProgress.hasStarted) {
      // Create a copy without File and Blob objects for storage
      const storageCopy = {
        ...onboardingProgress,
        resumeData: {
          ...onboardingProgress.resumeData,
          file: null
        },
        videoData: {
          ...onboardingProgress.videoData,
          blob: null
        }
      };
      localStorage.setItem(`onboarding_progress_${user.id}`, JSON.stringify(storageCopy));
    }
  }, [onboardingProgress, user?.id]);

  // Save isNewUser status to localStorage when it changes
  useEffect(() => {
    if (user?.id && isNewUser) {
      console.log("Setting isNewUser flag in localStorage", user.id);
      localStorage.setItem(`is_new_user_${user.id}`, 'true');
    }
  }, [isNewUser, user?.id]);

  return {
    onboardingProgress,
    setOnboardingProgress,
    isNewUser,
    setIsNewUser,
    showOnboarding,
    setShowOnboarding,
    currentStep
  };
};
