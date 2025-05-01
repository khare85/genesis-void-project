
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Edit, 
  Copy, 
  Power, 
  PowerOff,
  MoreHorizontal,
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Job } from '../JobListingItem';
import JobDateProgressBar from '../JobDateProgressBar';

interface JobActionsProps {
  job: Job;
  onStatusChange: (job: Job, newStatus: string) => void;
  onDuplicate: (job: Job) => void;
  onDelete?: (job: Job) => void; // Added delete function
}

export const JobActions: React.FC<JobActionsProps> = ({ 
  job, 
  onStatusChange, 
  onDuplicate,
  onDelete 
}) => {
  return (
    <div className="flex items-center justify-between md:justify-end gap-2 mt-4 md:mt-0">
      <div className="md:mr-4 hidden md:block">
        <JobDateProgressBar 
          publishedDate={job.postedDate} 
          closingDate={job.closingDate || undefined}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/recruiter/jobs/${job.id}/applicants`}>
            <Users className="h-4 w-4 mr-1.5" />
            Applicants
          </Link>
        </Button>
        
        <Button size="sm" variant="outline" asChild>
          <Link to={`/recruiter/jobs/${job.id}/edit`}>
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Link>
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDuplicate(job)}
        >
          <Copy className="h-4 w-4 mr-1.5" />
          Duplicate
        </Button>
        
        {job.status === 'active' ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onStatusChange(job, 'closed')}
          >
            <PowerOff className="h-4 w-4 mr-1.5" />
            Close
          </Button>
        ) : job.status === 'draft' ? (
          <Button 
            size="sm"
            variant="outline"
            className="text-green-600"
            onClick={() => onStatusChange(job, 'active')}
          >
            <Power className="h-4 w-4 mr-1.5" />
            Publish
          </Button>
        ) : (
          <Button 
            size="sm"
            variant="outline"
            className="text-green-600"
            onClick={() => onStatusChange(job, 'active')}
          >
            <Power className="h-4 w-4 mr-1.5" />
            Reopen
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>More Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(job)} className="text-destructive">
                <Trash className="h-4 w-4 mr-1.5" />
                Delete Job
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
