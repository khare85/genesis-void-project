
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Job } from '@/components/recruiter/JobListingItem';
import JobListingsTableRow from './JobListingsTableRow';
import { DbJob } from '@/components/recruiter/JobListingItem';

interface JobListingsTableProps {
  jobs: any[];
  isLoading: boolean;
  onStatusChange: (job: Job, status: string) => void;
  onDuplicateJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

const JobListingsTable: React.FC<JobListingsTableProps> = ({
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
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-center">Applicants</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <JobListingsTableRow
              key={job.id}
              job={convertDbJobToJob(job)}
              onStatusChange={onStatusChange}
              onDuplicateJob={onDuplicateJob}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobListingsTable;
