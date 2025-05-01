
import React from 'react';
import { JobInfo } from './job-card/JobInfo';
import { JobActions } from './job-card/JobActions';

// Updated Job interface to match the props passed from RecruiterJobListings
export interface Job {
  id: string | number;
  title: string;
  department: string;
  location: string;
  applicants: number;
  newApplicants: number;
  postedDate?: string;
  posteddate?: string; // Keep this for compatibility
  closingDate?: string;
  closingdate?: string; // Keep this for compatibility
  status: string;
  type: string;
  priority: string;
}

// Database job type for internal use
export interface DbJob {
  id: string;
  title: string;
  department: string;
  location: string;
  posteddate: string;
  closingdate?: string;
  status: string;
  type: string;
  company: string;
  priority?: string;
  applicants?: number;
  newApplicants?: number;
}

interface JobListingItemProps {
  job: Job;
  onStatusChange: (job: Job, newStatus: string) => void;
  onDuplicate: (job: Job) => void;
}

const JobListingItem: React.FC<JobListingItemProps> = ({ job, onStatusChange, onDuplicate }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:border-primary hover:bg-muted/30 transition-colors">
      <JobInfo job={job} />
      <JobActions job={job} onStatusChange={onStatusChange} onDuplicate={onDuplicate} />
    </div>
  );
};

export default JobListingItem;
