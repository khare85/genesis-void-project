
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

      // First check if the email is already registered
      // Using a different approach since the filter property is causing an error
      const { data: usersList, error: emailCheckError } = await supabase.auth.admin.listUsers();

      if (emailCheckError) {
        console.log('Error checking existing email:', emailCheckError);
        // Continue with signup attempt as this might be a permission error
      } else if (usersList && usersList.users) {
        // Manually check if email exists in the returned users
        // Fix: Add proper type to avoid "never" type error
        const emailExists = usersList.users.some((user: any) => 
          user.email && user.email.toLowerCase() === formData.email.toLowerCase()
        );
        
        if (emailExists) {
          throw new Error('Email is already registered. Please use a different email or try logging in.');
        }
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
        console.error('Signup error details:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        
        // Handle user signup with database function
        const { error: signupError } = await supabase.rpc('handle_user_signup', {
          user_id: data.user.id,
          user_role: role,
          company_name: formData.company || null,
          first_name: formData.firstName,
          last_name: formData.lastName
        });

        if (signupError) {
          console.error('Error in handle_user_signup RPC:', signupError);
          throw signupError;
        }
        
        // With proper configurations in Supabase, the user should be automatically logged in
        // However, we can explicitly check the session to confirm
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData && sessionData.session) {
          console.log('User is authenticated with session:', sessionData.session);
          
          // Store supabase user as our app user
          const appUser = {
            id: data.user.id,
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            role: 'candidate',
            companyName: formData.company || undefined
          };
          
          localStorage.setItem('persona_ai_user', JSON.stringify(appUser));
          
          toast.success('Account created successfully! You have been signed in.');
          onSuccess();
          
          // Explicitly navigate to the candidate dashboard
          console.log('Navigating to candidate dashboard after successful signup');
          navigate('/candidate/dashboard', { replace: true });
        } else {
          // If no session, try to sign in explicitly
          console.log('No session detected after signup, attempting explicit login');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (signInError) {
            console.error('Sign-in after signup failed:', signInError);
            // Show login error but don't throw - account was created successfully
            toast.error(`Account created but couldn't log you in: ${signInError.message}. Please try logging in.`);
            navigate('/login', { replace: true });
            return;
          }
          
          if (signInData.user) {
            console.log('Explicit login successful after signup:', signInData.user);
            
            // Store supabase user as our app user
            const appUser = {
              id: signInData.user.id,
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
              role: 'candidate',
              companyName: formData.company || undefined
            };
            
            localStorage.setItem('persona_ai_user', JSON.stringify(appUser));
            
            toast.success('Account created successfully! You have been signed in.');
            onSuccess();
            
            // Explicitly navigate to the candidate dashboard
            console.log('Navigating to candidate dashboard after explicit login');
            navigate('/candidate/dashboard', { replace: true });
          }
        }
      } else {
        // No user data returned, but also no error - unusual case
        console.log('No user data returned from signUp, but no error');
        toast.warning('Your account may have been created. Please try logging in.');
        navigate('/login', { replace: true });
      }
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
