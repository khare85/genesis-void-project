
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job } from '@/components/recruiter/JobListingItem';

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
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  // Convert DbJob to Job before passing to components
  const convertDbJobToJob = (dbJob) => {
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
              <TableCell>{getStatusBadge(job.status)}</TableCell>
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
              <TableCell>{getPriorityBadge(job.priority || 'medium')}</TableCell>
              <TableCell>{new Date(job.posteddate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
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
                  <DropdownMenuContent align="end">
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
                    <DropdownMenuItem onClick={() => onDuplicateJob(convertDbJobToJob(job))}>
                      Duplicate
                    </DropdownMenuItem>
                    {job.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(convertDbJobToJob(job), 'closed')}>
                        Deactivate Job
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onStatusChange(convertDbJobToJob(job), 'active')}>
                        Activate Job
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteJob(convertDbJobToJob(job))} 
                      className="text-destructive"
                    >
                      Delete Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobListingsTable;
