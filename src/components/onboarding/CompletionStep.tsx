import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useProfileGenerator } from '@/hooks/profile/useProfileGenerator';
import { useAuth } from '@/lib/auth';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompletionStepProps {
  onComplete: () => void;
  resumeUrl: string | null;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete, resumeUrl }) => {
  const { user } = useAuth();
  const { generateProfileFromResume, isAIGenerating } = useProfileGenerator();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateProfile = async () => {
    if (!resumeUrl) {
      toast.error("No resume found to generate profile from");
      return;
    }

    setIsGenerating(true);
    try {
      await generateProfileFromResume(resumeUrl);
      toast.success("Profile generated successfully!");
      setIsGenerated(true);
    } catch (error) {
      console.error("Error generating profile:", error);
      toast.error("Failed to generate profile. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="max-w-xl mx-auto px-8 py-10 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        variants={checkmarkVariants}
      >
        <Check className="h-12 w-12 text-green-600" />
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-bold mb-4"
        variants={itemVariants}
      >
        Onboarding Complete!
      </motion.h2>
      
      <motion.p 
        className="text-muted-foreground text-lg mb-8"
        variants={itemVariants}
      >
        Thank you for completing your candidate profile setup. You're now ready to explore job opportunities!
      </motion.p>
      
      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="text-left bg-blue-50 border border-blue-100 rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="bg-blue-100 p-1 rounded">✨</span>
            Use AI to complete your profile
          </h3>
          <p className="text-sm mb-4">
            Our AI can automatically extract information from your resume to create a comprehensive profile that will help you stand out to employers.
          </p>
          <Button 
            onClick={handleGenerateProfile} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isGenerating || isAIGenerating || isGenerated}
          >
            {isGenerating || isAIGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Profile...
              </>
            ) : isGenerated ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Profile Generated
              </>
            ) : (
              <>
                Generate My Profile
              </>
            )}
          </Button>
        </div>
        
        <Button 
          onClick={onComplete}
          className="mt-8 px-8 py-6 h-auto text-lg"
        >
          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CompletionStep;
