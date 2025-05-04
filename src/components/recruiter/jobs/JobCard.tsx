
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Building } from 'lucide-react';
import { Job } from '@/components/recruiter/JobListingItem';
import JobStatusBadge from './JobStatusBadge';
import PriorityBadge from './PriorityBadge';
import JobActionsMenu from './JobActionsMenu';

interface JobCardProps {
  job: Job;
  onStatusChange: (job: Job, status: string) => void;
  onDuplicateJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onStatusChange,
  onDuplicateJob,
  onDeleteJob
}) => {
  return (
    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Link 
              to={`/recruiter/jobs/${job.id}/applicants`} 
              className="text-lg font-medium hover:text-primary hover:underline"
            >
              {job.title}
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5" />
                {job.company || 'N/A'}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <JobStatusBadge status={job.status} />
              <PriorityBadge priority={job.priority || 'medium'} />
              <Badge variant="outline" className="shadow-sm">{job.type}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Posted: {new Date(job.postedDate || job.posteddate || '').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {job.applicants || 0} applicant{job.applicants !== 1 ? 's' : ''}
                  {job.newApplicants > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs shadow-sm">
                      +{job.newApplicants} new
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <JobActionsMenu 
              job={job}
              onStatusChange={onStatusChange}
              onDuplicateJob={onDuplicateJob}
              onDeleteJob={onDeleteJob}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
