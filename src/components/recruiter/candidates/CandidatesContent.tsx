
import React from "react";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";
import { FolderView } from "@/components/recruiter/candidates/FolderView";
import { CandidateView } from "@/components/recruiter/candidates/CandidateView";

interface CandidatesContentProps {
  showFolderView: boolean;
  currentFolder: string | null;
  folders: Folder[];
  loadingFolders: boolean;
  handleFolderSelect: (folderId: string | null) => void;
  openEditFolderDialog: (folder: Folder) => void;
  openDeleteFolderDialog: (folder: Folder) => void;
  candidates: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  totalCount: number;
  selectedCandidates: string[];
  handleSelectCandidate: (id: string) => void;
  handleSelectAll: (checked: boolean) => void;
  updateCandidateFolder: (candidateId: string, folderId: string) => Promise<boolean>;
  showFilterSidebar: boolean;
  setShowFilterSidebar: (show: boolean) => void;
  defaultFolder?: Folder | null;
}

export const CandidatesContent: React.FC<CandidatesContentProps> = ({
  showFolderView,
  currentFolder,
  folders,
  loadingFolders,
  handleFolderSelect,
  openEditFolderDialog,
  openDeleteFolderDialog,
  candidates,
  isLoading,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  totalCount,
  selectedCandidates,
  handleSelectCandidate,
  handleSelectAll,
  updateCandidateFolder,
  showFilterSidebar,
  setShowFilterSidebar,
  defaultFolder
}) => {
  const filteredCandidatesForFolder = currentFolder === defaultFolder?.id
    ? candidates.filter(c => !c.folderId) // Show unassigned candidates for default folder
    : candidates.filter(c => c.folderId === currentFolder);

  return (
    <>
      {showFolderView ? (
        <FolderView 
          folders={folders}
          loadingFolders={loadingFolders}
          currentFolder={currentFolder}
          onFolderSelect={handleFolderSelect}
          onEditFolder={openEditFolderDialog}
          onDeleteFolder={openDeleteFolderDialog}
        />
      ) : (
        <CandidateView 
          currentFolder={currentFolder}
          folders={folders}
          candidates={filteredCandidatesForFolder}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={filteredCandidatesForFolder.length}
          selectedCandidates={selectedCandidates}
          onSelectCandidate={handleSelectCandidate}
          onSelectAll={handleSelectAll}
          onMoveToFolder={updateCandidateFolder}
          showFilterSidebar={showFilterSidebar}
          setShowFilterSidebar={setShowFilterSidebar}
        />
      )}
    </>
  );
};
