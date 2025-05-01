
import React from "react";

interface JobInfoProps {
  job: any;
}

export const JobInfo: React.FC<JobInfoProps> = ({ job }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Job Description</h3>
      <p className="text-muted-foreground">{job.description || "No description provided."}</p>
    </div>
  );
};
