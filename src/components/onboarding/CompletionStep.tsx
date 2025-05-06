
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getParsedResumeJson } from '@/services/resumeParser';

interface CompletionStepProps {
  onComplete: () => void;
  resumeUrl?: string | null;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onComplete, resumeUrl }) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  
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

  const generateAIProfile = async () => {
    if (!user?.id) {
      toast.error('You need to be logged in to generate an AI profile');
      return;
    }
    
    setIsGenerating(true);

    try {
      // Check for parsed JSON data in localStorage
      const onboardingProgress = localStorage.getItem(`onboarding_progress_${user.id}`);
      let jsonFilePath = null;
      
      if (onboardingProgress) {
        try {
          const progress = JSON.parse(onboardingProgress);
          if (progress.resumeData?.jsonFilePath) {
            jsonFilePath = progress.resumeData.jsonFilePath;
            console.log('Found JSON file path in onboarding progress:', jsonFilePath);
          }
        } catch (e) {
          console.error('Error parsing onboarding progress:', e);
        }
      }
      
      // If we have parsed JSON data, use it directly
      let parsedData = null;
      if (jsonFilePath) {
        try {
          parsedData = await getParsedResumeJson(jsonFilePath);
          console.log('Retrieved parsed resume data successfully:', parsedData ? 'Data found' : 'No data');
        } catch (e) {
          console.error('Error retrieving parsed JSON data:', e);
        }
      }

      // First try with Gemini
      toast.info('Generating AI profile...');
      console.log('Attempting to generate profile using Gemini API with parsed data:', parsedData ? 'Available' : 'Not available');
      
      const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-profile-from-gemini', {
        body: { 
          userId: user.id,
          forceRefresh: true,
          resumeUrl: resumeUrl,
          parsedData: parsedData // Pass the parsed data if available
        }
      });

      if (geminiError) {
        console.error('Error with Gemini:', geminiError);
        throw geminiError;
      } 
      
      if (geminiData && geminiData.success) {
        toast.success('AI profile generated successfully!');
        
        // Mark profile as generated
        localStorage.setItem(`profile_generated_${user.id}`, 'true');
        
        // Mark onboarding as completed
        localStorage.setItem(`onboarding_completed_${user.id}`, "true");
        
        // Complete onboarding
        onComplete();
        
        // Navigate to profile page
        setTimeout(() => {
          navigate('/candidate/profile');
        }, 1000);
        return;
      } else {
        console.log('Gemini response was not successful or empty:', geminiData);
      }

      // Fallback to OpenAI if Gemini fails
      toast.info('Generating AI profile with OpenAI as fallback...');
      console.log('Falling back to OpenAI for profile generation with parsed data:', parsedData ? 'Available' : 'Not available');
      
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: { 
          userId: user.id,
          forceRefresh: true,
          resumeUrl: resumeUrl,
          parsedData: parsedData // Pass the parsed data if available
        }
      });

      if (error) {
        throw error;
      }

      if (data && data.success) {
        toast.success('AI profile generated successfully!');
        
        // Mark profile as generated
        localStorage.setItem(`profile_generated_${user.id}`, 'true');
        
        // Mark onboarding as completed
        localStorage.setItem(`onboarding_completed_${user.id}`, "true");
        
        // Complete onboarding
        onComplete();
        
        // Navigate to profile page
        setTimeout(() => {
          navigate('/candidate/profile');
        }, 1000);
      } else {
        throw new Error(data?.message || 'Failed to generate profile');
      }
    } catch (error) {
      console.error('Failed to generate AI profile:', error);
      toast.error('Failed to generate AI profile. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const completeWithoutAI = () => {
    // Mark onboarding as completed
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, "true");
    }
    
    // Complete onboarding
    onComplete();
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto px-8 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for completing your onboarding. Your profile is ready to be enhanced with AI.
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-medium">Onboarding Completed</h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-green-800">
            You've successfully uploaded your:
          </p>
          <ul className="list-disc list-inside text-sm text-green-800 pl-4">
            <li>Resume information</li>
            <li>Video introduction</li>
          </ul>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="border rounded-lg p-6">
          <h3 className="font-medium mb-2">Generate Your AI-Enhanced Profile</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI will analyze your resume data to create a comprehensive professional profile. 
            This includes extracting your skills, experience, education, and more.
          </p>
          
          <Button 
            onClick={generateAIProfile}
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Profile...
              </>
            ) : (
              'Generate AI-Enhanced Profile'
            )}
          </Button>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={completeWithoutAI}>
            Skip for now
          </Button>
          
          <Button onClick={completeWithoutAI}>
            Complete Onboarding
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompletionStep;
