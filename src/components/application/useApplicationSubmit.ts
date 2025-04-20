
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/services/fileStorage';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

export const useApplicationSubmit = (jobId: string) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ApplicationFormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    setIsSubmitting(true);
    toast.info('Submitting your application...', { duration: 2000 });

    try {
      console.log('Submitting application for job:', jobId);
      console.log('Form data:', formData);
      console.log('Resume size:', resume.size);
      console.log('Video blob size:', recordedBlob.size);

      // Create new candidate user account
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
        throw new Error(`Failed to create candidate: ${signupError.message}`);
      }

      const candidateId = signupData;
      console.log('Candidate created/found with ID:', candidateId);

      if (!candidateId) {
        throw new Error('No candidate ID was returned from signup function');
      }

      // Upload resume
      let resumeUrl = '';
      try {
        resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
        console.log('Resume uploaded successfully:', resumeUrl);
      } catch (error: any) {
        console.error('Resume upload failed:', error);
        throw new Error(`Resume upload failed: ${error.message}`);
      }
      
      // Upload video
      let videoUrl = '';
      try {
        videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);
        console.log('Video uploaded successfully:', videoUrl);
      } catch (error: any) {
        console.error('Video upload failed:', error);
        throw new Error(`Video upload failed: ${error.message}`);
      }

      // Create the application record
      const { data: application, error: applicationError } = await supabase
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
        .select();
      
      if (applicationError) {
        console.error("Application insertion error:", applicationError);
        throw new Error(`Failed to create application: ${applicationError.message}`);
      }

      console.log("Application created successfully:", application);

      // Process resume with Gemini AI
      console.log("Invoking process-resume function with:", {
        resumeUrl,
        jobId,
        candidateId
      });
      
      const { data: processData, error: processError } = await supabase.functions.invoke('process-resume', {
        body: {
          resumeUrl,
          jobId,
          candidateId
        }
      });

      if (processError) {
        console.error('Error processing resume:', processError);
        toast.error('Application submitted, but resume analysis failed');
      } else {
        console.log('Resume processing result:', processData);
      }

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

    } catch (error: any) {
      console.error('Error during submission:', error);
      toast.error(`Failed to submit application: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return handleSubmit;
};
