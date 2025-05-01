
import React from "react";
import { FilterSidebar } from "./FilterSidebar";
import { CandidateViewCard } from "./view/CandidateViewCard";
import { Folder } from "./FolderGrid";

interface CandidateViewProps {
  currentFolder: string | null;
  folders: Folder[];
  candidates: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  totalCount: number;
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onMoveToFolder?: (candidateId: string, folderId: string) => Promise<boolean>;
  showFilterSidebar: boolean;
  setShowFilterSidebar: (show: boolean) => void;
}

export const CandidateView: React.FC<CandidateViewProps> = ({
  currentFolder,
  folders,
  candidates,
  isLoading,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  totalCount,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  onMoveToFolder,
  showFilterSidebar,
  setShowFilterSidebar,
}) => {
  const toggleFilterSidebar = () => {
    setShowFilterSidebar(!showFilterSidebar);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {showFilterSidebar && (
        <div className="col-span-12 md:col-span-3">
          <FilterSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={toggleFilterSidebar}
          />
        </div>
      )}
      
      <div className={`col-span-12 ${showFilterSidebar ? 'md:col-span-9' : 'md:col-span-12'}`}>
        <CandidateViewCard
          currentFolder={currentFolder}
          folders={folders}
          candidates={candidates}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={totalCount}
          selectedCandidates={selectedCandidates}
          onSelectCandidate={onSelectCandidate}
          onSelectAll={onSelectAll}
          onMoveToFolder={onMoveToFolder}
          showFilterSidebar={showFilterSidebar}
          onToggleFilters={toggleFilterSidebar}
        />
      </div>
    </div>
  );
};
