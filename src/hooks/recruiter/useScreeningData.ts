
import { useCandidateFetcher } from './screening/useCandidateFetcher';
import { useScreeningFilters } from './screening/useScreeningFilters';
import { useStatusManager } from './screening/useStatusManager';
import { useAIScreening } from './screening/useAIScreening';

export const useScreeningData = () => {
  // Get candidate data
  const { screeningData, setScreeningData, isLoading } = useCandidateFetcher();
  
  // Get filtering and sorting functionality
  const {
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
  } = useScreeningFilters(screeningData);
  
  // Get status management functionality
  const { handleStatusChange } = useStatusManager(screeningData, setScreeningData);
  
  // Get AI screening functionality
  const {
    screeningState,
    setScreeningState,
    screeningProgress,
    setScreeningProgress,
    candidatesToScreen,
    setCandidatesToScreen
  } = useAIScreening();

  return {
    isLoading,
    screeningData,
    setScreeningData,  // Explicitly return setScreeningData
    filteredCandidates: sortedCandidates,
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
    handleStatusChange,
    getCandidateCountByStatus,
    screeningState,
    setScreeningState,
    screeningProgress,
    setScreeningProgress,
    candidatesToScreen,
    setCandidatesToScreen
  };
};
