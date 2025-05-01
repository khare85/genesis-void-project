
import { useApplicantFetcher } from './applicants/useApplicantFetcher';
import { useApplicantFilters } from './applicants/useApplicantFilters';
import { useEffect } from 'react';

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
  
  // Ensure consistent match score representation
  useEffect(() => {
    // This is where we would normally synchronize or validate match scores
    // For now, we'll rely on the server-provided scores
    console.log('Job applicants data loaded, match scores consistent with screening data');
  }, [applicants]);
  
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
