
import React, { useEffect } from 'react';
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';
import AppHeader from '@/components/shared/AppHeader';
import JobApplicationHeader from '@/components/application/JobApplicationHeader';
import { JobApplicationLoading } from '@/components/application/JobApplicationLoading';
import { JobNotFound } from '@/components/application/JobNotFound';
import { useJobApplication } from '@/hooks/useJobApplication';
import { useApplicationSubmit } from '@/components/application/useApplicationSubmit';
import { toast } from 'sonner';

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
  
  useEffect(() => {
    // When component mounts, check if we need to scroll to top
    window.scrollTo(0, 0);
  }, []);
  
  // Handle the case when job ID is missing
  useEffect(() => {
    if (!isLoading && !job?.id) {
      toast.error("Job ID is missing. Please return to the careers page.");
    }
  }, [isLoading, job]);
  
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
