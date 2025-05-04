
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CandidateViewHeader } from "@/components/recruiter/candidates/CandidateViewHeader";
import { CandidatesPagination } from "@/components/recruiter/candidates/CandidatesPagination";
import { TalentPoolTable } from "@/components/recruiter/candidates/TalentPoolTable";
import { CandidateViewTitle } from "./CandidateViewTitle";
import { CandidateSelectionActions } from "./CandidateSelectionActions";
import { CandidateEmptyState } from "./CandidateEmptyState";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";

interface CandidateViewCardProps {
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
  onToggleFilters: () => void;
}

export const CandidateViewCard: React.FC<CandidateViewCardProps> = ({
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
  onToggleFilters,
}) => {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CandidateViewTitle 
            currentFolder={currentFolder}
            folders={folders}
            totalCount={totalCount}
          />
          <CandidateSelectionActions 
            selectedCandidates={selectedCandidates}
            onScreen={() => {
              console.log("Starting AI screening for:", selectedCandidates);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CandidateViewHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={totalCount}
          showFilterSidebar={showFilterSidebar}
          onToggleFilters={onToggleFilters}
        />

        <div className="mb-4 mt-4">
          <CandidatesPagination 
            currentPage={1}
            totalItems={totalCount}
            itemsPerPage={20}
            onPageChange={(page) => console.log(`Page changed to ${page}`)}
          />
        </div>

        {isLoading || candidates.length === 0 ? (
          <CandidateEmptyState isLoading={isLoading} />
        ) : (
          <TalentPoolTable
            candidates={candidates}
            selectedCandidates={selectedCandidates}
            onSelectCandidate={onSelectCandidate}
            onSelectAll={onSelectAll}
            currentFolder={currentFolder}
            folders={folders}
            onMoveToFolder={onMoveToFolder}
          />
        )}
      </CardContent>
    </Card>
  );
};
