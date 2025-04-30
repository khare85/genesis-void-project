
import React from 'react';
import JobListingItem, { Job, DbJob } from './JobListingItem';
import JobListingsEmpty from './JobListingsEmpty';
import { Skeleton } from '@/components/ui/skeleton';

interface JobListingsTabProps {
  isLoading: boolean;
  jobs: DbJob[];
  onStatusChange: (job: Job, newStatus: string) => void;
  onDuplicate: (job: Job) => void;
}

const JobListingsTab: React.FC<JobListingsTabProps> = ({ 
  isLoading, 
  jobs, 
  onStatusChange, 
  onDuplicate 
}) => {
  // Function to map database job to component job
  const mapToComponentJob = (dbJob: DbJob): Job => ({
    id: dbJob.id,
    title: dbJob.title,
    department: dbJob.department || '',
    location: dbJob.location,
    applicants: dbJob.applicants || 0,
    newApplicants: dbJob.newApplicants || 0,
    postedDate: dbJob.posteddate,
    closingDate: dbJob.closingdate,
    status: dbJob.status,
    type: dbJob.type,
    priority: dbJob.priority || 'medium'
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="border rounded-md p-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return <JobListingsEmpty />;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListingItem
          key={job.id}
          job={mapToComponentJob(job)}
          onStatusChange={onStatusChange}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};

export default JobListingsTab;
