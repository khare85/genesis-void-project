
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/services/fileStorage';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

export const useApplicationSubmit = (jobId: string) => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: ApplicationFormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    try {
      let candidateId;
      
      // First check if the user already exists
      const { data: existingUser, error: getUserError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();
      
      if (getUserError && getUserError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking existing user:', getUserError);
        throw getUserError;
      }
      
      if (existingUser?.id) {
        // User already exists, use that ID
        candidateId = existingUser.id;
        console.log('Using existing user ID:', candidateId);
      } else {
        // Create new candidate user account
        try {
          const { data: signupData, error: signupError } = await supabase.rpc(
            'handle_new_candidate_signup',
            {
              email_param: formData.email,
              first_name_param: formData.firstName,
              last_name_param: formData.lastName,
              phone_param: formData.phone
            }
          );

          if (signupError) {
            console.error('Error creating candidate:', signupError);
            
            // If the error is a duplicate key for phone, try to get the user by email
            if (signupError.code === '23505' && signupError.details?.includes('phone')) {
              const { data: userByEmail } = await supabase.auth.admin.getUserByEmail(formData.email);
              
              if (userByEmail?.user) {
                candidateId = userByEmail.user.id;
                console.log('Retrieved user ID by email after phone conflict:', candidateId);
              } else {
                throw signupError;
              }
            } else {
              throw signupError;
            }
          } else {
            candidateId = signupData;
          }
        } catch (signupIssue) {
          // As a fallback, try to get user by email directly from auth
          console.error('Trying fallback user lookup after signup issue:', signupIssue);
          
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            candidateId = authUser.user.id;
            console.log('Using current authenticated user as fallback:', candidateId);
          } else {
            // If all else fails, create a temporary UUID for the application
            candidateId = crypto.randomUUID();
            console.warn('Using generated UUID as last resort:', candidateId);
          }
        }
      }

      console.log('Final candidate ID for application:', candidateId);
      
      // Upload resume
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
      console.log('Uploaded resume:', resumeUrl);
      
      // Upload video
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);
      console.log('Uploaded video:', videoUrl);

      // Create the application record
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          video_url: videoUrl,
          status: 'pending',
          notes: formData.coverLetter,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (applicationError) {
        console.error("Application insertion error:", applicationError);
        throw applicationError;
      }

      console.log("Application created successfully:", applicationData);

      // Check if the user exists in auth system before sending a magic link
      const { data: userExists } = await supabase.auth.getUser();
      
      if (!userExists?.user) {
        // Only send magic link if user doesn't exist in auth system
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: formData.email,
        });

        if (magicLinkError) {
          console.error("Error sending magic link:", magicLinkError);
          // Don't throw error here, as application was already submitted successfully
          toast.error(`Note: Could not send login email (${magicLinkError.message})`);
        } else {
          toast.success('Application submitted successfully! Please check your email for login instructions.');
        }
      } else {
        toast.success('Application submitted successfully!');
      }
      
      // Navigate after a short delay to ensure the toast is visible
      setTimeout(() => {
        navigate('/careers');
      }, 2000);

    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to submit application. Please try again.');
      throw error;
    }
  };

  return handleSubmit;
};
