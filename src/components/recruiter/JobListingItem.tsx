
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Edit, 
  Copy, 
  Power, 
  PowerOff,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import JobDateProgressBar from './JobDateProgressBar';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  applicants: number;
  newApplicants: number;
  postedDate: string;
  closingDate?: string;
  status: string;
  type: string;
  priority: string;
}

interface JobListingItemProps {
  job: Job;
  onStatusChange: (job: Job, newStatus: string) => void;
  onDuplicate: (job: Job) => void;
}

const JobListingItem: React.FC<JobListingItemProps> = ({ job, onStatusChange, onDuplicate }) => {
  // Get status badge for a job
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority badge for a job
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Low</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:border-primary hover:bg-muted/30 transition-colors">
      <div className="md:flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-medium">{job.title}</h3>
          <div className="hidden md:flex">{getStatusBadge(job.status)}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{job.type}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{job.applicants}</span>
            <span className="text-muted-foreground ml-1">applicants</span>
            {job.newApplicants > 0 && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                +{job.newApplicants} new
              </Badge>
            )}
          </div>
          
          {job.priority !== 'low' && (
            <div className="hidden sm:block">
              {getPriorityBadge(job.priority)}
            </div>
          )}
        </div>
      </div>
      
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
          
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
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
              <DropdownMenuItem className="text-destructive">
                Delete Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default JobListingItem;
