
import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';

const ResumeOnboardingButton: React.FC = () => {
  const { onboardingProgress, reopenOnboarding } = useOnboarding();
  
  // Only show when onboarding has started but is minimized
  if (!onboardingProgress.hasStarted || !onboardingProgress.isMinimized) {
    return null;
  }
  
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={reopenOnboarding}
        className="bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
          <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          <path d="M22 12h-4" />
        </svg>
        Continue Onboarding
      </button>
    </motion.div>
  );
};

export default ResumeOnboardingButton;
