
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'candidate' | 'hiring_manager' | 'recruiter';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  company: string;
}

export const useSignupForm = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'candidate',
    company: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (['hiring_manager', 'recruiter'].includes(formData.role) && !formData.company) {
        throw new Error('Company name is required for Hiring Manager and Recruiter roles');
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: signupError } = await supabase.rpc('handle_user_signup', {
          user_id: data.user.id,
          user_role: formData.role,
          company_name: formData.company || null,
          first_name: formData.firstName,
          last_name: formData.lastName
        });

        if (signupError) throw signupError;
      }

      toast.success('Account created successfully! Please check your email to confirm your account.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleRoleChange,
    handleSubmit
  };
};
