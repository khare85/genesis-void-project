
import { useFetchJobs } from './job-listings/useFetchJobs';
import { useJobFilters } from './job-listings/useJobFilters';
import { useJobActions } from './job-listings/useJobActions';

export const useJobListings = () => {
  // Fetch jobs data
  const { jobsData, isLoading, refreshJobs } = useFetchJobs();
  
  // Handle filtering and sorting
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    filteredJobs
  } = useJobFilters(jobsData);
  
  // Handle job actions (status change, duplicate, delete)
  const {
    handleStatusChange,
    handleDuplicateJob,
    confirmDelete,
    handleDeleteJob,
    cancelDelete,
    isDeleteDialogOpen,
    jobToDelete
  } = useJobActions(refreshJobs);
  
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
    refreshJobs
  };
};
