
import { useState } from 'react';
import { ScreeningCandidate } from '@/types/screening';

export const useScreeningFilters = (screeningData: ScreeningCandidate[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [sortField, setSortField] = useState<keyof ScreeningCandidate | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [jobRoleFilter, setJobRoleFilter] = useState<string>("all");

  // Filter candidates based on search term, status, and job role
  const filteredCandidates = screeningData.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (candidate.skills && candidate.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = activeTab === "all" || candidate.status === activeTab;
    
    const matchesJobRole = jobRoleFilter === "all" || candidate.jobRole === jobRoleFilter;
    
    return matchesSearch && matchesStatus && matchesJobRole;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'screeningScore' || sortField === 'matchScore' || sortField === 'reviewTime') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    // For string fields
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  // Handle sorting
  const handleSort = (field: keyof ScreeningCandidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get unique job roles for filtering
  const uniqueJobRoles = Array.from(new Set(screeningData.map(c => c.jobRole)));

  // Get count of candidates by status
  const getCandidateCountByStatus = (status: string) => {
    if (status === 'all') {
      return screeningData.length;
    }
    return screeningData.filter(c => c.status === status).length;
  };

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    handleSort,
    jobRoleFilter,
    setJobRoleFilter,
    uniqueJobRoles,
    sortedCandidates,
    getCandidateCountByStatus
  };
};
