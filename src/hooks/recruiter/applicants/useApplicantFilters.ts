
import { useState, useMemo } from 'react';
import { ScreeningCandidate } from '@/types/screening';

export const useApplicantFilters = (applicants: ScreeningCandidate[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  
  // Filter applicants based on search and filters
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch = 
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        applicant.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (filter === "all") return matchesSearch;
      return matchesSearch && applicant.status === filter;
    });
  }, [applicants, searchQuery, filter]);
  
  // Sort applicants
  const sortedApplicants = useMemo(() => {
    return [...filteredApplicants].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
        case "oldest":
          return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
        case "match-high":
          return b.matchScore - a.matchScore;
        case "match-low":
          return a.matchScore - b.matchScore;
        default:
          return 0;
      }
    });
  }, [filteredApplicants, sortBy]);
  
  return {
    filteredCount: filteredApplicants.length,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortedApplicants
  };
};
