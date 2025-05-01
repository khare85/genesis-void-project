
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import WelcomeStep from './WelcomeStep';
import ResumeStep from './ResumeStep';
import VideoStep from './VideoStep';
import CompletionStep from './CompletionStep';
import { OnboardingStep, OnboardingProgress } from '@/types/screening';
import { useOnboarding } from '@/context/OnboardingContext';
import { X } from 'lucide-react';

const OnboardingModal: React.FC = () => {
  const { 
    onboardingProgress, 
    currentStep, 
    nextStep, 
    completeOnboarding,
    updateResumeData,
    updateVideoData,
    minimizeOnboarding,
    showOnboarding
  } = useOnboarding();

  const handleGetStarted = () => {
    nextStep();
  };

  const handleResumeComplete = (
    resumeFile: File | null,
    resumeText: string | null,
    resumeUrl: string | null
  ) => {
    updateResumeData({ file: resumeFile, text: resumeText, uploadedUrl: resumeUrl });
    nextStep();
  };

  const handleVideoComplete = (videoBlob: Blob | null, videoUrl: string | null) => {
    updateVideoData({ blob: videoBlob, uploadedUrl: videoUrl });
    nextStep();
  };

  const handleCompletion = () => {
    completeOnboarding();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onGetStarted={handleGetStarted} />;
      case 'resume':
        return (
          <ResumeStep 
            onComplete={handleResumeComplete}
            initialFile={onboardingProgress.resumeData.file}
            initialText={onboardingProgress.resumeData.text}
            initialUrl={onboardingProgress.resumeData.uploadedUrl}
          />
        );
      case 'video':
        return (
          <VideoStep 
            onComplete={handleVideoComplete}
            initialBlob={onboardingProgress.videoData.blob}
            initialUrl={onboardingProgress.videoData.uploadedUrl}
          />
        );
      case 'completion':
        return (
          <CompletionStep 
            onComplete={handleCompletion} 
            resumeUrl={onboardingProgress.resumeData.uploadedUrl}
          />
        );
      default:
        return <WelcomeStep onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <Dialog open={showOnboarding} onOpenChange={(open) => {
      if (!open) minimizeOnboarding();
    }}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Progress indicator */}
          {currentStep !== 'welcome' && currentStep !== 'completion' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: currentStep === 'resume' ? '50%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
          
          {/* Close button */}
          <button
            onClick={minimizeOnboarding}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
