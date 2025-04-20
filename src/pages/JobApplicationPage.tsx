
import React from 'react';
import { toast } from 'sonner'; 
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';
import AppHeader from '@/components/shared/AppHeader';
import JobApplicationHeader from '@/components/application/JobApplicationHeader';
import { JobApplicationLoading } from '@/components/application/JobApplicationLoading';
import { JobNotFound } from '@/components/application/JobNotFound';
import { useJobApplication } from '@/hooks/useJobApplication';
import { useApplicationSubmit } from '@/components/application/useApplicationSubmit';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const JobApplicationPage = () => {
  const {
    job,
    isLoading,
    isUploading,
    setIsUploading,
    isUploadingVideo,
    setIsUploadingVideo,
    resumeStorageUrl,
    setResumeStorageUrl,
    videoStorageUrl,
    setVideoStorageUrl,
  } = useJobApplication();

  const handleSubmit = useApplicationSubmit(job?.id || '');
  
  // Check if the buckets exist when the page loads
  useEffect(() => {
    const checkBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking buckets:", error);
          return;
        }
        
        const resumeBucketExists = buckets?.some(bucket => bucket.name === 'resume');
        const videoBucketExists = buckets?.some(bucket => bucket.name === 'video');
        
        if (!resumeBucketExists || !videoBucketExists) {
          console.warn("Resume or video storage buckets not found");
          toast.error("Storage configuration issue. Please contact support.", {
            id: "storage-config-warning",
            duration: 5000
          });
        }
      } catch (err) {
        console.error("Error checking storage buckets:", err);
      }
    };
    
    checkBuckets();
  }, []);
  
  if (isLoading) {
    return <JobApplicationLoading />;
  }
  
  if (!job) {
    return <JobNotFound />;
  }

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
