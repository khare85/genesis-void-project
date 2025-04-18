
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
      // Create new candidate user account
      const { data: signupData, error: signupError } = await supabase.rpc(
        'handle_new_candidate_signup',
        {
          email_param: formData.email,
          first_name_param: formData.firstName,
          last_name_param: formData.lastName
        }
      );

      if (signupError) {
        console.error('Error creating candidate:', signupError);
        throw signupError;
      }

      const candidateId = signupData;

      // Upload resume
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
      
      // Upload video
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);

      // Create the application record
      const { error: applicationError } = await supabase
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
        });
      
      if (applicationError) {
        console.error("Application insertion error:", applicationError);
        throw applicationError;
      }

      // Send magic link for authentication
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: formData.email,
      });

      if (magicLinkError) {
        console.error("Error sending magic link:", magicLinkError);
        throw magicLinkError;
      }

      toast.success('Application submitted successfully! Please check your email for login instructions.');
      
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
