
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company: string | null;
}

export const useEditUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async (userId: string, data: EditUserData) => {
    setIsLoading(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          company: data.company
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: data.role })
        .eq('user_id', userId);

      if (roleError) throw roleError;

      toast.success('User updated successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateUser
  };
};
