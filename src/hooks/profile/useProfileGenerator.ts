
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfileGenerator = (userId: string | undefined, refreshProfileData: () => void) => {
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const generateProfileFromResume = async () => {
    if (!userId) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    setIsAIGenerating(true);
    toast.info("AI is processing your resume data...");

    try {
      // Generate the main profile data
      console.log("Generating profile from resume for user:", userId);
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: {
          userId: userId,
          forceRefresh: true
        }
      });

      if (error) {
        console.error("Error generating profile:", error);
        throw new Error(error.message);
      }

      if (!data.success) {
        console.error("Profile generation unsuccessful:", data);
        throw new Error(data.message || "Failed to generate profile data");
      }
      
      // Now generate skills and languages
      console.log("Generating skills and languages...");
      const { data: skillsData, error: skillsError } = await supabase.functions.invoke('generate-skills-languages', {
        body: { 
          userId: userId,
          ensureEnglishLanguage: true // Pass flag to ensure English is added if no languages
        }
      });
      
      if (skillsError) {
        console.error("Error generating skills and languages:", skillsError);
        // We still continue because the main profile was generated
        toast.warning("Profile generated but skills/languages could not be generated.");
      } else {
        console.log("Skills and languages generated:", skillsData);
      }
      
      // Refresh the profile data to get all the new data
      refreshProfileData();
      toast.success("Profile generated successfully including skills and languages!");
    } catch (error: any) {
      console.error("Error generating profile:", error);
      toast.error(`Failed to generate profile: ${error.message || "Unknown error"}`);
    } finally {
      setIsAIGenerating(false);
    }
  };

  return {
    isAIGenerating,
    generateProfileFromResume
  };
};
