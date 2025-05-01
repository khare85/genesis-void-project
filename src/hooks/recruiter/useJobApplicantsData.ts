
import { useApplicantFetcher } from './applicants/useApplicantFetcher';
import { useApplicantFilters } from './applicants/useApplicantFilters';

export const useJobApplicantsData = (jobId?: string) => {
  // Get applicant data
  const { job, applicants, isLoading, error, totalCount } = useApplicantFetcher(jobId);
  
  // Get filtering and sorting functionality
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortedApplicants,
    filteredCount
  } = useApplicantFilters(applicants);
  
  return {
    job,
    applicants: sortedApplicants,
    isLoading,
    error,
    totalCount,
    filteredCount,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  };
};
