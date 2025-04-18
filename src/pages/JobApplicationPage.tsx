
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';
import AppHeader from '@/components/shared/AppHeader';
import JobApplicationHeader from '@/components/application/JobApplicationHeader';
import { uploadFileToStorage } from '@/services/fileStorage';
import type { Job } from '@/types/job';
import type { ApplicationFormData } from '@/components/application/schemas/applicationFormSchema';

const JobApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [resumeStorageUrl, setResumeStorageUrl] = useState('');
  const [videoStorageUrl, setVideoStorageUrl] = useState('');
  
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();
        
        if (error) {
          console.error("Error fetching job:", error);
          toast.error("Failed to load job details");
          return;
        }
        
        setJob(data);
      } catch (err) {
        console.error("Error in job fetch:", err);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchJob();
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <p>Loading job details...</p>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/careers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData: ApplicationFormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    try {
      // Upload resume
      setIsUploading(true);
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, job.id);
      setResumeStorageUrl(resumeUrl);
      
      // Upload video
      setIsUploadingVideo(true);
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, job.id);
      setVideoStorageUrl(videoUrl);

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
          job_id: job.id,
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
      throw error; // Re-throw to be caught by the ApplicationForm component
    } finally {
      setIsUploading(false);
      setIsUploadingVideo(false);
    }
  };

  const adaptedJob = {
    ...job,
    salary: job.salary_range || 'Not specified',
    postedDate: job.posteddate || 'Not specified'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="container py-8">
        <JobApplicationHeader job={job} />
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <ApplicationForm 
              onSubmit={handleSubmit}
              isUploading={isUploading}
              isUploadingVideo={isUploadingVideo}
              resumeStorageUrl={resumeStorageUrl}
              videoStorageUrl={videoStorageUrl}
            />
          </div>
          <div>
            <JobSidebar job={adaptedJob} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;
