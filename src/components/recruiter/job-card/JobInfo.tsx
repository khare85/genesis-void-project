
import React from 'react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Job } from '../JobListingItem';

interface JobInfoProps {
  job: Job;
}

export const JobInfo: React.FC<JobInfoProps> = ({ job }) => {
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
  );
};
