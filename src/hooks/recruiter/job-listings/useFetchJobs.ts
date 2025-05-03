
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DbJob } from '@/components/recruiter/JobListingItem';

// Helper function to fetch applicant counts for a job
export const fetchJobApplicantsCount = async (jobId: string) => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId);
    
  if (error) console.error("Error fetching applicants count:", error);
  return count || 0;
};

// Helper function to fetch new applicants count for a job
export const fetchNewApplicantsCount = async (jobId: string) => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId)
    .eq('status', 'pending');
    
  if (error) console.error("Error fetching new applicants count:", error);
  return count || 0;
};

// Hook to handle fetching jobs from Supabase
export const useFetchJobs = () => {
  const [jobsData, setJobsData] = useState<DbJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posteddate', { ascending: false });
      
      if (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error fetching jobs",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Fetch applicant counts for each job
      const jobsWithApplicants = await Promise.all(
        (data || []).map(async (job) => {
          const applicantsCount = await fetchJobApplicantsCount(job.id);
          const newApplicantsCount = await fetchNewApplicantsCount(job.id);
          
          return {
            ...job,
            applicants: applicantsCount,
            newApplicants: newApplicantsCount,
            priority: job.featured ? 'high' : 'medium' // Default priority based on featured status
          };
        })
      );
      
      setJobsData(jobsWithApplicants);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobsData,
    isLoading,
    refreshJobs: fetchJobs
  };
};
