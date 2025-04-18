
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
import type { Job, FormData } from '@/types/job';

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

  const handleSubmit = async (formData: FormData, resume: File | null, recordedBlob: Blob | null) => {
    if (!resume || !recordedBlob) {
      !resume && toast.error('Please upload your resume');
      !recordedBlob && toast.error('Please record your introduction video');
      return;
    }

    try {
      setIsUploading(true);
      const resumeUrl = await uploadFileToStorage(resume, 'resume', formData.email, job.id);
      setResumeStorageUrl(resumeUrl);
      
      setIsUploadingVideo(true);
      const videoUrl = await uploadFileToStorage(recordedBlob, 'video', formData.email, job.id);
      setVideoStorageUrl(videoUrl);

      // Check if candidate exists - Fix the excessively deep type instantiation error
      const { data: candidates, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email);
      
      // Extract the existing candidate if found
      const existingCandidate = candidates && candidates.length > 0 ? candidates[0] : null;

      let candidateId: string;
      
      if (existingCandidate) {
        candidateId = existingCandidate.id;
        await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.currentCompany,
            title: formData.currentPosition,
            updated_at: new Date().toISOString()
          })
          .eq('id', candidateId);
      } else {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          email_confirm: true,
          user_metadata: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        });
        
        if (authError || !authData.user) {
          throw new Error("Failed to create candidate account");
        }
        
        candidateId = authData.user.id;
        await supabase
          .from('profiles')
          .insert({
            id: candidateId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.currentCompany,
            title: formData.currentPosition
          });
      }
      
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          video_url: videoStorageUrl,
          status: 'pending',
          notes: formData.coverLetter
        });
      
      if (applicationError) {
        throw applicationError;
      }
      
      toast.success('Application submitted successfully!');
      setTimeout(() => {
        navigate('/careers');
      }, 2000);
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsUploading(false);
      setIsUploadingVideo(false);
    }
  };

  // Add required properties for JobSidebar component
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
