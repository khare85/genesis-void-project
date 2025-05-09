
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
      // Fetch jobs posted by the current user (hiring manager)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobsData(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error fetching jobs',
        description: 'Could not load your job listings. Please try again.',
        variant: 'destructive',
      });
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
