
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface InterviewPrepData {
  commonQuestions: Array<{ question: string; answer: string }>;
  behavioralQuestions: Array<{ question: string; framework: string }>;
  keySkills: string[];
  technicalTips: string;
  questionsToAsk: string[];
}

export const useInterviewPrep = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [prepData, setPrepData] = useState<InterviewPrepData | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');

  const generateInterviewPrep = async (customJobTitle?: string) => {
    if (!user?.id) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-prep', {
        body: {
          userId: user.id,
          jobTitle: customJobTitle || ''
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate interview preparation');
      }

      setPrepData(data.prepData);
      setJobTitle(data.jobTitle);
      toast.success('Interview preparation content generated!');
      
      return data.prepData;
    } catch (error: any) {
      console.error('Error generating interview prep:', error);
      toast.error(`Failed to generate interview preparation: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    prepData,
    jobTitle,
    generateInterviewPrep
  };
};
