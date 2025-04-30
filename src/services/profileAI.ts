
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const generateProfileData = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-profile-data', {
      body: { userId },
    });

    if (error) {
      toast.error(`Failed to generate profile: ${error.message}`);
      return null;
    }

    if (data.error) {
      toast.error(`Failed to generate profile: ${data.error}`);
      return null;
    }

    return data.profile || null;
  } catch (error) {
    toast.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};
