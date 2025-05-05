
import React from 'react';
import { Link } from 'react-router-dom';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/components/recruiter/JobListingItem';
import JobStatusBadge from './JobStatusBadge';
import PriorityBadge from './PriorityBadge';
import JobActionsMenu from './JobActionsMenu';

interface JobListingsTableRowProps {
  job: Job;
  onStatusChange: (job: Job, status: string) => void;
  onDuplicateJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

const JobListingsTableRow: React.FC<JobListingsTableRowProps> = ({
  job,
  onStatusChange,
  onDuplicateJob,
  onDeleteJob
}) => {
  return (
    <TableRow key={job.id}>
      <TableCell>
        <div>
          <Link 
            to={`/recruiter/jobs/${job.id}/applicants`} 
            className="font-medium hover:text-primary hover:underline"
          >
            {job.title}
          </Link>
          <div className="text-sm text-muted-foreground">{job.location}</div>
        </div>
      </TableCell>
      <TableCell>
        <JobStatusBadge status={job.status} />
      </TableCell>
      <TableCell>{job.company || 'N/A'}</TableCell>
      <TableCell>
        <div className="flex justify-start items-center">
          <div className="font-medium text-gray-800 mr-2">
            {job.applicants || 0}
          </div>
          {job.newApplicants > 0 && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200">
              <span className="text-xs font-semibold text-gray-700">+{job.newApplicants} new</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={job.priority || 'medium'} />
      </TableCell>
      <TableCell>{new Date(job.postedDate || job.posteddate || '').toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <JobActionsMenu 
          job={job}
          onStatusChange={onStatusChange}
          onDuplicateJob={onDuplicateJob}
          onDeleteJob={onDeleteJob}
        />
      </TableCell>
    </TableRow>
  );
};

export default JobListingsTableRow;
