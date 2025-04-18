
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DbJob, Job } from '@/components/recruiter/JobListingItem';

export const useJobListings = () => {
  const [jobsData, setJobsData] = useState<DbJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch jobs from Supabase
  useEffect(() => {
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
          return;
        }
        
        // Transform data to include default values for missing fields
        const transformedData = data.map(job => ({
          ...job,
          applicants: 0,  // Default values since we don't have real applicant counts yet
          newApplicants: 0,
          priority: 'medium', // Default priority
        }));
        
        setJobsData(transformedData);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Filter jobs based on search query and active tab
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && job.status === 'active';
    if (activeTab === 'draft') return matchesSearch && job.status === 'draft';
    if (activeTab === 'closed') return matchesSearch && job.status === 'closed';
    
    return matchesSearch;
  });
  
  // Sort jobs based on selected option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.posteddate || '').getTime() - new Date(a.posteddate || '').getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.posteddate || '').getTime() - new Date(b.posteddate || '').getTime();
    }
    if (sortBy === 'applicants-high') {
      return (b.applicants || 0) - (a.applicants || 0);
    }
    if (sortBy === 'applicants-low') {
      return (a.applicants || 0) - (b.applicants || 0);
    }
    return 0;
  });
  
  // Function to handle job status change
  const handleStatusChange = async (job: Job, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', job.id);
      
      if (error) {
        toast({
          title: "Error updating job status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setJobsData(prevJobs => 
        prevJobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j)
      );
      
      let message = '';
      if (newStatus === 'active') {
        message = `${job.title} has been published and is now accepting applications.`;
      } else if (newStatus === 'closed') {
        message = `${job.title} has been closed and is no longer accepting applications.`;
      }
      
      toast({
        title: `Job ${newStatus === 'active' ? 'published' : 'closed'}`,
        description: message
      });
    } catch (err) {
      console.error("Failed to update job status:", err);
    }
  };
  
  // Function to handle job duplication
  const handleDuplicateJob = async (job: Job) => {
    try {
      // Create database job object
      const dbJob: Partial<DbJob> = {
        title: `${job.title} (Copy)`,
        department: job.department,
        location: job.location,
        type: job.type,
        status: 'draft',
        company: jobsData.find(j => j.id === job.id)?.company || ''
      };
      
      // Create new job with draft status
      const { data, error } = await supabase
        .from('jobs')
        .insert(dbJob)
        .select();
      
      if (error) {
        toast({
          title: "Error duplicating job",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      if (data && data[0]) {
        const newJob: DbJob = {
          ...data[0],
          applicants: 0,
          newApplicants: 0,
          priority: 'medium',
        };
        
        setJobsData(prevJobs => [newJob, ...prevJobs]);
      }
      
      toast({
        title: "Job duplicated",
        description: `${job.title} has been duplicated as a draft.`
      });
    } catch (err) {
      console.error("Failed to duplicate job:", err);
    }
  };
  
  return {
    jobsData,
    isLoading,
    filteredJobs: sortedJobs,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    handleStatusChange,
    handleDuplicateJob
  };
};
