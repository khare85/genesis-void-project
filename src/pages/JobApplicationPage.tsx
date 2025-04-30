
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '@/components/application/ApplicationForm';
import JobSidebar from '@/components/application/JobSidebar';
import AppHeader from '@/components/shared/AppHeader';
import JobApplicationHeader from '@/components/application/JobApplicationHeader';
import { JobApplicationLoading } from '@/components/application/JobApplicationLoading';
import { JobNotFound } from '@/components/application/JobNotFound';
import { useJobApplication } from '@/hooks/useJobApplication';
import { useApplicationSubmit } from '@/components/application/useApplicationSubmit';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const JobApplicationPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
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
  
  const navigateToLogin = () => {
    // Store the current URL to return after login
    const currentPath = window.location.pathname;
    navigate('/login', { state: { from: currentPath } });
    toast.info('Please log in or create an account to apply for this job');
  };
  
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
            {!isAuthenticated ? (
              <Card className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Login Required</h2>
                <p>You need to be logged in to apply for this position.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={navigateToLogin}
                    className="bg-[#3054A5] hover:bg-[#264785]"
                  >
                    Sign in to Apply
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/careers/${job.id}`)}
                  >
                    View Job Details
                  </Button>
                </div>
              </Card>
            ) : (
              <ApplicationForm 
                onSubmit={handleSubmit}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                isUploadingVideo={isUploadingVideo}
                setIsUploadingVideo={setIsUploadingVideo}
                resumeStorageUrl={resumeStorageUrl}
                setResumeStorageUrl={setResumeStorageUrl}
                videoStorageUrl={videoStorageUrl}
                setVideoStorageUrl={setVideoStorageUrl}
              />
            )}
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
