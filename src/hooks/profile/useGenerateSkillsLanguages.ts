
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

export const useGenerateSkillsLanguages = (setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>) => {
  const { user } = useAuth();
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingLanguages, setIsGeneratingLanguages] = useState(false);
  
  const generateSkills = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to generate skills");
      return;
    }
    
    try {
      setIsGeneratingSkills(true);
      toast.info("Generating skills from resume data...");
      
      // Call edge function to generate skills and languages
      const { data, error } = await supabase.functions.invoke('generate-skills-languages', {
        body: { userId: user.id }
      });
      
      if (error) throw new Error(error.message || "Failed to call skills generation function");
      
      if (!data || !data.skills) {
        throw new Error(data?.message || "No skills could be identified from your resume");
      }
      
      if (data.skills.length === 0) {
        toast.warning("No skills could be identified from your resume");
        return;
      }
      
      // Update profile data with new skills - using functional update pattern for proper typing
      setProfileData((currentData) => ({
        ...currentData,
        skills: [...data.skills]
      }));
      
      toast.success(`${data.skills.length} skills were identified from your resume`);
    } catch (error: any) {
      console.error("Error generating skills:", error);
      toast.error(`Failed to generate skills: ${error.message || "Unknown error"}`);
    } finally {
      setIsGeneratingSkills(false);
    }
  };
  
  const generateLanguages = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to generate languages");
      return;
    }
    
    try {
      setIsGeneratingLanguages(true);
      toast.info("Generating languages from resume data...");
      
      // Call edge function to generate skills and languages
      const { data, error } = await supabase.functions.invoke('generate-skills-languages', {
        body: { userId: user.id }
      });
      
      if (error) throw new Error(error.message || "Failed to call languages generation function");
      
      if (!data || !data.languages) {
        throw new Error(data?.message || "No languages could be identified from your resume");
      }
      
      if (data.languages.length === 0) {
        toast.warning("No languages could be identified from your resume");
        return;
      }
      
      // Update profile data with new languages - using functional update pattern for proper typing
      setProfileData((currentData) => ({
        ...currentData,
        languages: [...data.languages]
      }));
      
      toast.success(`${data.languages.length} languages were identified from your resume`);
    } catch (error: any) {
      console.error("Error generating languages:", error);
      toast.error(`Failed to generate languages: ${error.message || "Unknown error"}`);
    } finally {
      setIsGeneratingLanguages(false);
    }
  };
  
  return { 
    isGeneratingSkills, 
    isGeneratingLanguages, 
    generateSkills, 
    generateLanguages 
  };
};
