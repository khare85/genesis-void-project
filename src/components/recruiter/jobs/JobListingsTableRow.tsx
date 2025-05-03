
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
      <TableCell>{job.department || 'N/A'}</TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center items-center gap-1">
          <span>{job.applicants || 0}</span>
          {job.newApplicants > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{job.newApplicants} new
            </Badge>
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
