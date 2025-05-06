
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
      // First check if we have parsed data in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('ai_parsed_data')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
      }
      
      let parsedData = null;
      
      // If we have parsed data in the profile, use it
      if (profileData?.ai_parsed_data) {
        try {
          // Check if it's already a JSON object
          if (typeof profileData.ai_parsed_data === 'object') {
            parsedData = profileData.ai_parsed_data;
          } else {
            // Try to parse as JSON
            parsedData = JSON.parse(profileData.ai_parsed_data);
          }
          console.log('Using parsed resume data from profiles table:', parsedData ? 'Data found' : 'No data');
        } catch (e) {
          console.error('Error parsing profile data:', e);
          // If it's not valid JSON, it might be raw text that needs to be parsed
          console.log('Profile data may contain raw text, will use for generation');
        }
      }
      
      // If we don't have parsed data in the profile, check localStorage
      if (!parsedData) {
        // Look for parsed JSON data in localStorage
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
            
            // Save to profile if we found it
            if (parsedData) {
              await supabase
                .from('profiles')
                .update({ 
                  ai_parsed_data: JSON.stringify(parsedData),
                  updated_at: new Date().toISOString()
                })
                .eq('id', userId);
              console.log('Saved parsed data to profile table');
            }
          } catch (e) {
            console.error('Error retrieving parsed JSON data:', e);
          }
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
