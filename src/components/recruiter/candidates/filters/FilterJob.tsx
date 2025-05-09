
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

// Mock jobs data
const mockJobs = [
  { id: "job-1", title: "Senior Frontend Developer" },
  { id: "job-2", title: "UX Designer" },
  { id: "job-3", title: "Data Scientist" },
  { id: "job-4", title: "Product Manager" },
  { id: "job-5", title: "DevOps Engineer" }
];

interface FilterJobProps {
  selectedJob: string | null;
  setSelectedJob: (jobId: string | null) => void;
}

export const FilterJob: React.FC<FilterJobProps> = ({ selectedJob, setSelectedJob }) => {
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // Only fetch jobs for the current manager
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('posted_by', user?.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setJobs(data);
        } else {
          // Use mock data if no jobs are found
          setJobs(mockJobs);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs(mockJobs);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [user]);
  
  return (
    <Select
      value={selectedJob || ""}
      onValueChange={(value) => setSelectedJob(value || null)}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Filter by job" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Jobs</SelectItem>
        {jobs.map((job) => (
          <SelectItem key={job.id} value={job.id}>
            {job.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
