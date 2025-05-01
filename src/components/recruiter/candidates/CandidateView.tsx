
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AIScreeningButton } from "@/components/recruiter/candidates/AIScreeningButton";
import { TalentPoolTable } from "@/components/recruiter/candidates/TalentPoolTable";
import { CandidateTableHeader } from "./CandidateTableHeader";
import { FilterSidebar } from "./FilterSidebar";
import { CandidatesPagination } from "./CandidatesPagination";
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
  onMoveToFolder?: (candidateId: string, folderId: string) => void;
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

  const currentFolderName = folders.find(f => f.id === currentFolder)?.name || "All Candidates";

  return (
    <div className="grid grid-cols-12 gap-6">
      {showFilterSidebar && (
        <div className="col-span-3">
          <FilterSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={toggleFilterSidebar}
          />
        </div>
      )}
      
      <div className={`${showFilterSidebar ? 'col-span-9' : 'col-span-12'}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>
                  {currentFolderName} ({totalCount})
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {selectedCandidates.length > 0 && (
                  <AIScreeningButton
                    selectedCount={selectedCandidates.length}
                    onScreen={() => {
                      console.log("Starting AI screening for:", selectedCandidates);
                    }}
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CandidateTableHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
              totalCount={totalCount}
              onToggleFilters={toggleFilterSidebar}
              showFilterSidebar={showFilterSidebar}
            />

            <div className="mb-4">
              <CandidatesPagination 
                currentPage={1}
                totalItems={totalCount}
                itemsPerPage={20}
                onPageChange={(page) => console.log(`Page changed to ${page}`)}
              />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
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
      </div>
    </div>
  );
};
