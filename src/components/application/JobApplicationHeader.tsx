
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import { Job } from '@/types/job';

interface JobApplicationHeaderProps {
  job: Job;
}

const JobApplicationHeader = ({ job }: JobApplicationHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <Link to={`/careers/${job.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-[#3054A5]">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job Details
        </Link>
      </div>
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Apply for {job.title}</h1>
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{job.type}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobApplicationHeader;
