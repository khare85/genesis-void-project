
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/components/recruiter/JobListingItem';
import { useAuth } from '@/lib/auth';

export const useJobActions = (refreshJobs: () => Promise<void>) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const { user } = useAuth();
  
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
      
      // Refresh jobs data
      await refreshJobs();
      
      let message = '';
      if (newStatus === 'active') {
        message = `${job.title} has been published and is now accepting applications.`;
      } else if (newStatus === 'closed') {
        message = `${job.title} has been closed and is no longer accepting applications.`;
      } else if (newStatus === 'pending_approval') {
        message = `${job.title} has been submitted for recruiter approval.`;
      }
      
      toast({
        title: `Job status updated`,
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
      
      // Refresh jobs data
      await refreshJobs();
      
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
      const { data: existingJobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', job.id.toString());
        
      if (!existingJobs || existingJobs.length === 0) {
        throw new Error("Original job not found");
      }
      
      const originalJob = existingJobs[0];
      
      // Create database job object
      const dbJob = {
        title: `${job.title} (Copy)`,
        department: job.department,
        location: job.location,
        type: job.type,
        status: 'draft',
        company: originalJob.company,
        posted_by: user?.id || originalJob.posted_by // Set the current user as the creator of the duplicate
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
      
      // Refresh jobs data
      await refreshJobs();
      
      toast({
        title: "Job duplicated",
        description: `${job.title} has been duplicated as a draft.`
      });
    } catch (err) {
      console.error("Failed to duplicate job:", err);
    }
  };
  
  return {
    handleStatusChange,
    handleDuplicateJob,
    confirmDelete,
    handleDeleteJob,
    cancelDelete,
    isDeleteDialogOpen,
    jobToDelete
  };
};
