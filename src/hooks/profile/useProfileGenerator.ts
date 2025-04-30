
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
      const { data, error } = await supabase.functions.invoke('generate-profile-from-resume', {
        body: {
          userId: userId,
          forceRefresh: true
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to generate profile data");
      }

      toast.success("Profile data generated successfully!");
      
      // Refresh the profile data
      refreshProfileData();
    } catch (error) {
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
