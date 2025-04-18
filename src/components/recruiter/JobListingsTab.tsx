
import React from 'react';
import JobListingItem, { Job, DbJob } from './JobListingItem';
import JobListingsEmpty from './JobListingsEmpty';

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
    return <div className="py-8 text-center text-muted-foreground">Loading job listings...</div>;
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
