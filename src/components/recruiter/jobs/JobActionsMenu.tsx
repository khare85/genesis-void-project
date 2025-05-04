
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/components/recruiter/JobListingItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface JobActionsMenuProps {
  job: Job;
  onStatusChange: (job: Job, status: string) => void;
  onDuplicateJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

const JobActionsMenu: React.FC<JobActionsMenuProps> = ({
  job,
  onStatusChange,
  onDuplicateJob,
  onDeleteJob
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white z-50">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/recruiter/jobs/${job.id}/applicants`}>
            View Applicants
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/recruiter/jobs/${job.id}/edit`}>
            Edit Job
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicateJob(job)}>
          Duplicate
        </DropdownMenuItem>
        {job.status === 'active' ? (
          <DropdownMenuItem onClick={() => onStatusChange(job, 'closed')}>
            Deactivate Job
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onStatusChange(job, 'active')}>
            Activate Job
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDeleteJob(job)} 
          className="text-destructive"
        >
          Delete Job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobActionsMenu;
