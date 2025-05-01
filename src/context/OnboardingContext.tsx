
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/lib/auth';
import { OnboardingProgress, OnboardingStep } from '@/types/screening';
import { useOnboardingState } from '@/hooks/onboarding/useOnboardingState';
import { useOnboardingActions } from '@/hooks/onboarding/useOnboardingActions';

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

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    onboardingProgress,
    isNewUser,
    setIsNewUser,
    showOnboarding,
    setShowOnboarding,
    currentStep
  } = useOnboardingState(user);
  
  const {
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    updateResumeData,
    updateVideoData,
    minimizeOnboarding,
    reopenOnboarding
  } = useOnboardingActions(onboardingProgress, setShowOnboarding, setIsNewUser, user);

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
