
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

export const useFetchJobsByManager = () => {
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        console.error("No user ID available");
        setJobsData([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch jobs posted by the current user (hiring manager)
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications:applications(id, status, candidate_id, created_at)
        `)
        .eq('posted_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process job data to include applicant count
      const processedJobs = (data || []).map(job => ({
        ...job,
        applicants: job.applications ? job.applications.length : 0,
        newApplicants: job.applications ? 
          job.applications.filter((app: any) => 
            new Date(app.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length : 0
      }));
      
      setJobsData(processedJobs);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error fetching jobs',
        description: 'Could not load your job listings. Please try again.',
        variant: 'destructive',
      });
      setJobsData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch jobs on component mount or when user changes
  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);
  
  // Function to refresh jobs data
  const refreshJobs = () => {
    fetchJobs();
  };
  
  return { jobsData, isLoading, refreshJobs };
};
