
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getParsedResumeJson } from '@/services/resumeParser';

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
      // Look for parsed JSON data in localStorage
      let parsedData = null;
      const onboardingProgress = localStorage.getItem(`onboarding_progress_${userId}`);
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
      if (jsonFilePath) {
        try {
          parsedData = await getParsedResumeJson(jsonFilePath);
          console.log('Successfully retrieved parsed resume data:', parsedData ? 'Data found' : 'No data');
        } catch (e) {
          console.error('Error retrieving parsed JSON data:', e);
        }
      }
      
      // Try using Gemini first
      console.log('Attempting to generate profile using Gemini API with parsed data:', parsedData ? 'Available' : 'Not available');
      const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-profile-from-gemini', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl,
          parsedData // Include any parsed data we found
        }
      });
      
      if (geminiError) {
        console.error('Error generating profile with Gemini:', geminiError);
        throw geminiError;
      }
      
      if (geminiData && geminiData.success) {
        toast.success(geminiData.generated ? 
          'Profile generated successfully with AI' : 
          'Profile already exists and is up to date');
        refreshData();
        return;
      } else {
        console.log('Gemini response was not successful or empty:', geminiData);
      }
      
      // Fallback to OpenAI if Gemini fails
      console.log('Falling back to OpenAI for profile generation with parsed data:', parsedData ? 'Available' : 'Not available');
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: { 
          userId,
          forceRefresh: true,
          resumeUrl,
          parsedData // Include any parsed data we found
        }
      });

      if (error) {
        throw error;
      }
      
      if (data && data.success) {
        toast.success(data.generated ? 
          'Profile generated successfully with AI' : 
          'Profile already exists and is up to date');
        refreshData();
      } else {
        throw new Error(data?.message || 'Failed to generate profile');
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
