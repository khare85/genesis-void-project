import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { OnboardingProgress, OnboardingStep } from '@/types/screening';

interface OnboardingContextType {
  onboardingProgress: OnboardingProgress;
  currentStep: OnboardingStep;
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  updateResumeData: (data: Partial<OnboardingProgress['resumeData']>) => void;
  updateVideoData: (data: Partial<OnboardingProgress['videoData']>) => void;
  reopenOnboarding: () => void;
  minimizeOnboarding: () => void;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  showOnboarding: boolean;
}

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
    uploadedUrl: null
  },
  videoData: {
    blob: null,
    uploadedUrl: null
  },
  isMinimized: false
};

const ONBOARDING_STEPS: OnboardingStep[] = ['welcome', 'resume', 'video', 'completion'];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>(defaultOnboardingProgress);

  // Determine the current onboarding step
  const currentStep = ONBOARDING_STEPS[onboardingProgress.step] || 'welcome';

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

  const startOnboarding = () => {
    console.log("Starting onboarding flow");
    setOnboardingProgress(prev => ({
      ...prev,
      hasStarted: true,
      step: 0,
      isMinimized: false
    }));
    setShowOnboarding(true);
  };

  const nextStep = () => {
    console.log(`Moving to next step: ${ONBOARDING_STEPS[Math.min(onboardingProgress.step + 1, ONBOARDING_STEPS.length - 1)]}`);
    setOnboardingProgress(prev => ({
      ...prev,
      step: Math.min(prev.step + 1, ONBOARDING_STEPS.length - 1)
    }));
  };

  const prevStep = () => {
    setOnboardingProgress(prev => ({
      ...prev,
      step: Math.max(prev.step - 1, 0)
    }));
  };

  const updateResumeData = (data: Partial<OnboardingProgress['resumeData']>) => {
    setOnboardingProgress(prev => ({
      ...prev,
      resumeData: { ...prev.resumeData, ...data },
      completedSteps: { 
        ...prev.completedSteps, 
        resume: Boolean(data.uploadedUrl || prev.resumeData.uploadedUrl || data.text || prev.resumeData.text) 
      }
    }));
  };

  const updateVideoData = (data: Partial<OnboardingProgress['videoData']>) => {
    setOnboardingProgress(prev => ({
      ...prev,
      videoData: { ...prev.videoData, ...data },
      completedSteps: { 
        ...prev.completedSteps, 
        video: Boolean(data.uploadedUrl || prev.videoData.uploadedUrl) 
      }
    }));
  };

  const completeOnboarding = () => {
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
  };

  const minimizeOnboarding = () => {
    console.log("Minimizing onboarding");
    setOnboardingProgress(prev => ({
      ...prev,
      isMinimized: true
    }));
    setShowOnboarding(false);
  };

  const reopenOnboarding = () => {
    console.log("Reopening onboarding");
    setOnboardingProgress(prev => ({
      ...prev,
      isMinimized: false
    }));
    setShowOnboarding(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingProgress,
        currentStep,
        startOnboarding,
        nextStep,
        prevStep,
        completeOnboarding,
        updateResumeData,
        updateVideoData,
        reopenOnboarding,
        minimizeOnboarding,
        isNewUser,
        setIsNewUser,
        showOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
