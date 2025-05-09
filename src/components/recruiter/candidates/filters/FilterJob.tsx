
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchJobsByManager } from "@/hooks/recruiter/job-listings/useFetchJobsByManager";

interface FilterJobProps {
  selectedJob: string | null;
  setSelectedJob: (jobId: string | null) => void;
}

export const FilterJob: React.FC<FilterJobProps> = ({ 
  selectedJob, 
  setSelectedJob 
}) => {
  const { jobsData, isLoading } = useFetchJobsByManager();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Loading jobs..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select 
      value={selectedJob || "all"} 
      onValueChange={(value) => setSelectedJob(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Filter by job" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Jobs</SelectItem>
        {jobsData.map((job) => (
          <SelectItem key={job.id} value={job.id}>
            {job.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
