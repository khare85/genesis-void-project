
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfileGenerator = (userId: string | undefined, refreshData: () => void) => {
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const generateProfileFromResume = async (resumeUrl?: string | null) => {
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
    
    setIsAIGenerating(true);
    toast.info('Generating AI profile...');
    
    try {
      // Try using Gemini first
      const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-profile-from-gemini', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl
        }
      });
      
      if (geminiError) {
        console.error('Error generating profile with Gemini:', geminiError);
        throw geminiError;
      }
      
      if (geminiData && geminiData.success) {
        toast.success('Profile generated successfully with AI');
        refreshData();
        return;
      }
      
      // Fallback to OpenAI if Gemini fails
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl
        }
      });

      if (error) {
        throw error;
      }
      
      if (data.success) {
        toast.success('Profile generated successfully with AI');
        refreshData();
      } else {
        throw new Error(data.message || 'Failed to generate profile');
      }
    } catch (error) {
      console.error('Error in AI profile generation:', error);
      toast.error('Failed to generate profile. Please try again later.');
    } finally {
      setIsAIGenerating(false);
    }
  };
  
  return {
    isAIGenerating,
    generateProfileFromResume
  };
};
