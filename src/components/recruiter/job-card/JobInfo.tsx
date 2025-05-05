
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Job } from '../JobListingItem';

interface JobInfoProps {
  job: Job;
}

export const JobInfo: React.FC<JobInfoProps> = ({ job }) => {
  return (
    <div className="space-y-2">
      <div>
        <Link to={`/recruiter/jobs/${job.id}/applicants`} className="text-lg font-semibold hover:text-primary hover:underline">
          {job.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Badge variant="outline">{job.type}</Badge>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Posted: {new Date(job.postedDate || job.posteddate || '').toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-800">{job.applicants || 0}</span>
            {job.newApplicants > 0 && (
              <div className="inline-flex items-center px-2.5 py-0.5 ml-1 rounded-full bg-gray-100 border border-gray-200">
                <span className="text-xs font-semibold text-gray-700">+{job.newApplicants} new</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
