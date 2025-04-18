
import React from 'react';

interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  category: string;
  level: string;
  logoUrl: string;
  featured: boolean;
}

interface JobSidebarProps {
  job: Job;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job }) => {
  return (
    <div className="bg-white border rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Job Summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
          <p className="font-medium">{job.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
          <p className="font-medium">{job.company}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
          <p className="font-medium">{job.location}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Employment Type</h3>
          <p className="font-medium">{job.type}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Salary Range</h3>
          <p className="font-medium">{job.salary}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Posted Date</h3>
          <p className="font-medium">{job.postedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default JobSidebar;
