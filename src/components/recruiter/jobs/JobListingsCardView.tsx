
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Job } from '@/components/recruiter/JobListingItem';
import JobCard from './JobCard';

interface JobListingsCardViewProps {
  jobs: any[];
  isLoading: boolean;
  onStatusChange: (job: Job, status: string) => void;
  onDuplicateJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

const JobListingsCardView: React.FC<JobListingsCardViewProps> = ({
  jobs,
  isLoading,
  onStatusChange,
  onDuplicateJob,
  onDeleteJob
}) => {
  // Convert DbJob to Job before passing to components
  const convertDbJobToJob = (dbJob: any): Job => {
    return {
      ...dbJob,
      postedDate: dbJob.posteddate,
      closingDate: dbJob.closingdate,
      newApplicants: dbJob.newApplicants || 0
    };
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading jobs...</p>
      </div>
    );
  } 
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <h3 className="text-lg font-medium">No jobs found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
        <Button className="mt-4" asChild>
          <Link to="/recruiter/jobs/create">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={convertDbJobToJob(job)}
          onStatusChange={onStatusChange}
          onDuplicateJob={onDuplicateJob}
          onDeleteJob={onDeleteJob}
        />
      ))}
    </div>
  );
};

export default JobListingsCardView;
