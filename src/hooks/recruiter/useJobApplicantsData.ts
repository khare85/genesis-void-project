
import { useApplicantFetcher } from './applicants/useApplicantFetcher';
import { useApplicantFilters } from './applicants/useApplicantFilters';
import { useEffect } from 'react';
import { ScreeningCandidate } from '@/types/screening';

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
    if (!applicants) return;
    
    // For each applicant, make sure we have a consistent match score category
    applicants.forEach((applicant: ScreeningCandidate) => {
      // If no matchCategory is set, calculate it based on the matchScore
      if (!applicant.matchCategory && applicant.matchScore !== undefined) {
        if (applicant.matchScore >= 80) {
          applicant.matchCategory = "High Match";
        } else if (applicant.matchScore >= 50) {
          applicant.matchCategory = "Medium Match";
        } else if (applicant.matchScore > 0) {
          applicant.matchCategory = "Low Match";
        } else {
          applicant.matchCategory = "No Match";
        }
      }
    });
    
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
