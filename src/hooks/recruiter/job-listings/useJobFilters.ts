
import { useState, useCallback } from 'react';
import { DbJob } from '@/components/recruiter/JobListingItem';

export const useJobFilters = (jobsData: DbJob[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
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
  
  // Apply filters and sorting to get final job list
  const getFilteredAndSortedJobs = useCallback(() => {
    return sortJobs(filterJobs(jobsData));
  }, [jobsData, filterJobs, sortJobs]);
  
  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    filteredJobs: getFilteredAndSortedJobs()
  };
};
