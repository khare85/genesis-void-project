
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeaderActions } from "@/components/recruiter/candidates/HeaderActions";
import { CandidateViewCard } from "@/components/recruiter/candidates/view/CandidateViewCard";
import { ImportCandidatesDialog } from "@/components/recruiter/candidates/ImportCandidatesDialog";
import { AddCandidateDialog } from "@/components/recruiter/candidates/AddCandidateDialog";
import { useShortlistedCandidates } from "@/hooks/recruiter/useShortlistedCandidates";
import { useCandidateSelection } from "@/hooks/recruiter/useCandidateSelection";
import { Card } from "@/components/ui/card";

const ManagerCandidates: React.FC = () => {
  // State for dialogs
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [importCandidatesDialogOpen, setImportCandidatesDialogOpen] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Custom hooks
  const { 
    candidates, 
    isLoading, 
    searchQuery, 
    setSearchQuery, 
    totalCount, 
    refreshCandidates 
  } = useShortlistedCandidates(selectedJob);
  
  const { 
    selectedCandidates, 
    handleSelectCandidate, 
    handleSelectAll, 
    clearSelection 
  } = useCandidateSelection();

  // Clear selection when candidates change
  useEffect(() => {
    clearSelection();
  }, [candidates, clearSelection]);

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <PageHeader 
        title="Shortlisted Candidates" 
        description="Review candidates shortlisted by your recruitment team"
      />
      
      <HeaderActions 
        onAddCandidate={() => setAddCandidateDialogOpen(true)}
        onImportCandidates={() => setImportCandidatesDialogOpen(true)}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
      />
      
      {/* Candidate List */}
      <CandidateViewCard
        currentFolder={null}
        folders={[]}
        candidates={candidates}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter="shortlisted" // Always show shortlisted
        setFilter={() => {}} // No-op since we only show shortlisted
        totalCount={totalCount}
        selectedCandidates={selectedCandidates}
        onSelectCandidate={handleSelectCandidate}
        onSelectAll={handleSelectAll}
        showFilterSidebar={showFilterSidebar}
        onToggleFilters={() => setShowFilterSidebar(!showFilterSidebar)}
      />

      {/* Empty State */}
      {!isLoading && candidates.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No shortlisted candidates</h3>
          <p className="text-muted-foreground">
            Your recruiters have not shortlisted any candidates for your jobs yet.
          </p>
        </Card>
      )}
      
      {/* Dialogs */}
      <AddCandidateDialog
        open={addCandidateDialogOpen}
        onOpenChange={setAddCandidateDialogOpen}
        onSuccess={refreshCandidates}
      />
      
      <ImportCandidatesDialog
        open={importCandidatesDialogOpen}
        onOpenChange={setImportCandidatesDialogOpen}
        onSuccess={refreshCandidates}
      />
    </div>
  );
};

export default ManagerCandidates;
