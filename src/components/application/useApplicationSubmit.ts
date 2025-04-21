
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/services/fileStorage';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

export const useApplicationSubmit = (jobId: string) => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: ApplicationFormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    try {
      setSubmitError(null);
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
        throw signupError;
      }

      const candidateId = signupData;
      console.log("Candidate created with ID:", candidateId);

      // Upload resume
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
      console.log("Resume uploaded to:", resumeUrl);
      
      // Upload video
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);
      console.log("Video uploaded to:", videoUrl);

      // Create the application record
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          video_url: videoUrl,
          status: 'pending',
          notes: formData.coverLetter || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (applicationError) {
        console.error("Application insertion error:", applicationError);
        throw applicationError;
      }

      console.log("Application created with ID:", applicationData.id);

      // Extract file path from the resume URL for parsing
      const resumeFilePath = resumeUrl.split('/').slice(-2).join('/');
      console.log("Resume file path for parsing:", resumeFilePath);
      
      // Trigger resume parsing
      try {
        const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-resume', {
          body: {
            filePath: resumeFilePath,
            bucket: 'resume',
            jobId: jobId,
            applicationId: applicationData.id
          }
        });

        if (parseError) {
          console.error("Resume parsing error:", parseError);
          // Don't throw, as the application was already submitted
          toast.error("Resume parsing failed, but application was submitted");
        } else {
          console.log("Resume parsing success:", parseData);
        }
      } catch (parseError) {
        console.error("Error calling parse-resume function:", parseError);
        // Don't throw, as the application was already submitted
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
      setSubmitError(error.message || 'Failed to submit application');
      toast.error('Failed to submit application. Please try again.');
      throw error;
    }
  };

  return handleSubmit;
};
