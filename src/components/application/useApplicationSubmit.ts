
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
      // Upload resume
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, jobId);
      
      // Upload video
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, jobId);

      // Generate a UUID for the candidate if a profile doesn't exist
      let candidateId: string;
      
      try {
        // Check if profile already exists
        const { data: existingProfiles, error: queryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', formData.email);
        
        if (queryError) {
          console.error("Error checking profile:", queryError);
          throw queryError;
        }
        
        if (existingProfiles && existingProfiles.length > 0) {
          // Update existing profile
          candidateId = existingProfiles[0].id;
          
          await supabase
            .from('profiles')
            .update({
              first_name: formData.firstName,
              last_name: formData.lastName,
              company: formData.currentCompany,
              title: formData.currentPosition,
              phone: formData.phone,
              linkedin_url: formData.linkedIn,
              portfolio_url: formData.portfolio,
              updated_at: new Date().toISOString()
            })
            .eq('id', candidateId);
        } else {
          // For public submissions, create a new profile
          candidateId = crypto.randomUUID();
          
          // Store candidate info in profiles
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: candidateId,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              company: formData.currentCompany,
              title: formData.currentPosition,
              linkedin_url: formData.linkedIn,
              portfolio_url: formData.portfolio
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            throw insertError;
          }
        }
      } catch (profileError) {
        console.error("Error with profile management:", profileError);
        candidateId = crypto.randomUUID(); // Fallback to ensure we can still submit
      }
      
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
      
      toast.success('Application submitted successfully!');
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
