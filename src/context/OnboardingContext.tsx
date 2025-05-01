
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

  // Check local storage for onboarding progress when component mounts
  useEffect(() => {
    if (user?.id) {
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

  const startOnboarding = () => {
    setOnboardingProgress(prev => ({
      ...prev,
      hasStarted: true,
      step: 0,
      isMinimized: false
    }));
    setShowOnboarding(true);
  };

  const nextStep = () => {
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
    setOnboardingProgress(prev => ({
      ...prev,
      hasStarted: false
    }));
    setShowOnboarding(false);
    
    // Mark onboarding as completed in local storage
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, "true");
    }
  };

  const minimizeOnboarding = () => {
    setOnboardingProgress(prev => ({
      ...prev,
      isMinimized: true
    }));
    setShowOnboarding(false);
  };

  const reopenOnboarding = () => {
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
