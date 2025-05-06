
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const ResumeOnboardingButton: React.FC = () => {
  const { onboardingProgress, reopenOnboarding, resetOnboarding } = useOnboarding();
  
  // Only show if onboarding has started but is minimized
  if (!onboardingProgress.hasStarted || !onboardingProgress.isMinimized) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 flex gap-2 z-50"
      >
        <Button
          onClick={reopenOnboarding}
          className="bg-primary text-white shadow-lg"
          size="sm"
        >
          Continue Onboarding
        </Button>
        <Button
          onClick={resetOnboarding}
          variant="outline"
          className="shadow-lg"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Start Again
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeOnboardingButton;
