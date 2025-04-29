
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
}

export const useSignupForm = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Always use 'candidate' as the role for public signups
  const role = 'candidate';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting signup form', { ...formData, role });

    try {
      // Validate the inputs
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // For demo purposes, simulate a successful signup with demo credentials
      if (formData.email.includes('example.com') || formData.email === 'candidate@example.com') {
        console.log('Demo signup detected');
        // Store user in localStorage
        const demoUser = {
          id: 'new-user-id',
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          role: 'candidate',
          avatarUrl: 'https://i.pravatar.cc/150?u=newcandidate',
        };
        
        localStorage.setItem('persona_ai_user', JSON.stringify(demoUser));
        toast.success('Account created successfully! You have been signed in.');
        onSuccess();
        
        // Explicitly navigate to the candidate dashboard
        console.log('Navigating to candidate dashboard after signup');
        navigate('/candidate/dashboard', { replace: true });
        return;
      }

      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email.toLowerCase());
      
      if (checkError) {
        console.error('Error checking existing user:', checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        throw new Error('An account with this email already exists');
      }

      // This is the Supabase implementation - will run for non-demo email addresses
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

      if (error) {
        console.error('Supabase signup error:', error);
        if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        } else {
          throw error;
        }
      }

      if (data.user) {
        // Try calling the RPC but handle the case where it might fail if the user already exists
        try {
          const { error: signupError } = await supabase.rpc('handle_user_signup', {
            user_id: data.user.id,
            user_role: role,
            company_name: formData.company || null,
            first_name: formData.firstName,
            last_name: formData.lastName
          });

          if (signupError && !signupError.message.includes("duplicate key")) {
            throw signupError;
          }
        } catch (rpcError) {
          console.warn('RPC warning (continuing):', rpcError);
          // Continue with the process even if RPC fails, as the user is created
        }
        
        // Try to sign in immediately after signup to ensure the user is logged in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (signInError) throw signInError;

        // Store supabase user as our app user
        const appUser = {
          id: data.user.id,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          role: 'candidate',
          companyName: formData.company || undefined
        };
        
        localStorage.setItem('persona_ai_user', JSON.stringify(appUser));
        
        // Explicitly navigate to the candidate dashboard
        console.log('Navigating to candidate dashboard after supabase signup');
        navigate('/candidate/dashboard', { replace: true });
      }

      toast.success('Account created successfully! You have been signed in.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};
