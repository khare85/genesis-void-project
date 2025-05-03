
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DbJob, Job } from '@/components/recruiter/JobListingItem';

// Helper functions
const fetchJobApplicantsCount = async (jobId: string) => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId);
    
  if (error) console.error("Error fetching applicants count:", error);
  return count || 0;
};

const fetchNewApplicantsCount = async (jobId: string) => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId)
    .eq('status', 'pending');
    
  if (error) console.error("Error fetching new applicants count:", error);
  return count || 0;
};

export const useJobListings = () => {
  const [jobsData, setJobsData] = useState<DbJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  
  // Fetch jobs from Supabase
  useEffect(() => {
    fetchJobs();
  }, []);
  
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
  
  // Filter jobs based on search query and active tab
  const filterJobs = useCallback((jobs: DbJob[]) => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'active') return matchesSearch && job.status === 'active';
      if (activeTab === 'draft') return matchesSearch && job.status === 'draft';
      if (activeTab === 'closed') return matchesSearch && job.status === 'closed';
      
      return matchesSearch;
    });
  }, [searchQuery, activeTab]);
  
  // Sort jobs based on selected option
  const sortJobs = useCallback((jobs: DbJob[]) => {
    return [...jobs].sort((a, b) => {
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
  }, [sortBy]);
  
  // Function to handle job status change
  const handleStatusChange = async (job: Job, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', job.id.toString()); 
      
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
  
  // Function to handle job deletion with confirmation
  const confirmDelete = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobToDelete.id.toString());
      
      if (error) {
        toast({
          title: "Error deleting job",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      setJobsData(prevJobs => prevJobs.filter(j => j.id !== jobToDelete.id));
      
      toast({
        title: "Job deleted",
        description: `${jobToDelete.title} has been deleted successfully.`
      });
      
      // Reset the dialog state
      setJobToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };
  
  // Cancel delete operation
  const cancelDelete = () => {
    setJobToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  // Function to handle job duplication
  const handleDuplicateJob = async (job: Job) => {
    try {
      // Create database job object - adding required company field
      const originalJob = jobsData.find(j => j.id === job.id);
      if (!originalJob) {
        throw new Error("Original job not found");
      }
      
      const dbJob = {
        title: `${job.title} (Copy)`,
        department: job.department,
        location: job.location,
        type: job.type,
        status: 'draft',
        company: originalJob.company // Ensure company field is included and not undefined
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
  
  // Apply filters and sorting to get final job list
  const filteredJobs = sortJobs(filterJobs(jobsData));
  
  return {
    jobsData,
    isLoading,
    filteredJobs,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    handleStatusChange,
    handleDuplicateJob,
    confirmDelete,
    handleDeleteJob,
    cancelDelete,
    isDeleteDialogOpen,
    jobToDelete,
    refreshJobs: fetchJobs
  };
};
