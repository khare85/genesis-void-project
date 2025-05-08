
import React from "react";
import { Users } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { FolderHeader } from "@/components/recruiter/candidates/FolderHeader";
import { AddCandidateDialog } from "@/components/recruiter/candidates/AddCandidateDialog";
import { ImportCandidatesDialog } from "@/components/recruiter/candidates/ImportCandidatesDialog";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { useFolderManagement } from "@/hooks/recruiter/useFolderManagement";
import { useCandidateSelection } from "@/hooks/recruiter/useCandidateSelection";
import { useRecruiterCandidatesState } from "@/hooks/recruiter/useRecruiterCandidatesState";
import { HeaderActions } from "@/components/recruiter/candidates/HeaderActions";
import { FolderOperations } from "@/components/recruiter/candidates/FolderOperations";
import { CandidatesContent } from "@/components/recruiter/candidates/CandidatesContent";

const RecruiterCandidates: React.FC = () => {
  // Use custom hook for UI state management
  const {
    currentFolder,
    setCurrentFolder,
    showFilterSidebar,
    setShowFilterSidebar,
    createFolderDialogOpen,
    setCreateFolderDialogOpen,
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    addCandidateDialogOpen,
    setAddCandidateDialogOpen,
    importCandidatesDialogOpen,
    setImportCandidatesDialogOpen,
    editingFolder,
    setEditingFolder,
    folderToDelete,
    setFolderToDelete,
    handleFolderSelect,
    openCreateFolderDialog,
    openEditFolderDialog,
    openDeleteFolderDialog,
    backToFolders
  } = useRecruiterCandidatesState();
  
  // Get candidates data from hook
  const { 
    candidates,
    isLoading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount,
    refreshCandidates
  } = useCandidatesData();

  // Use custom hooks for folder management and candidate selection
  const {
    folders,
    loadingFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    defaultFolder
  } = useFolderManagement(candidates, refreshCandidates);

  const {
    selectedCandidates,
    handleSelectCandidate,
    handleSelectAll,
    updateCandidateFolder,
    clearSelections
  } = useCandidateSelection(candidates, refreshCandidates);
  
  // Determine if we're in folder view or candidate view
  const showFolderView = !currentFolder;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pool"
        description="Manage and review potential candidates"
        icon={<Users className="h-6 w-6" />}
        actions={
          <HeaderActions 
            onAddCandidate={() => setAddCandidateDialogOpen(true)} 
            onImportCandidates={() => setImportCandidatesDialogOpen(true)}
          />
        }
      />
      
      <FolderHeader 
        showFolderView={showFolderView}
        currentFolder={currentFolder}
        folders={folders}
        onCreateFolder={openCreateFolderDialog}
        onBackToFolders={backToFolders}
      />
      
      <CandidatesContent
        showFolderView={showFolderView}
        currentFolder={currentFolder}
        folders={folders}
        loadingFolders={loadingFolders}
        handleFolderSelect={handleFolderSelect}
        openEditFolderDialog={openEditFolderDialog}
        openDeleteFolderDialog={openDeleteFolderDialog}
        candidates={candidates}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        totalCount={totalCount}
        selectedCandidates={selectedCandidates}
        handleSelectCandidate={handleSelectCandidate}
        handleSelectAll={handleSelectAll}
        updateCandidateFolder={updateCandidateFolder}
        showFilterSidebar={showFilterSidebar}
        setShowFilterSidebar={setShowFilterSidebar}
        defaultFolder={defaultFolder}
      />

      <FolderOperations
        createFolderDialogOpen={createFolderDialogOpen}
        setCreateFolderDialogOpen={setCreateFolderDialogOpen}
        deleteFolderDialogOpen={deleteFolderDialogOpen}
        setDeleteFolderDialogOpen={setDeleteFolderDialogOpen}
        editingFolder={editingFolder}
        folderToDelete={folderToDelete}
        createFolder={createFolder}
        updateFolder={updateFolder}
        deleteFolder={deleteFolder}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
      />

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        open={addCandidateDialogOpen}
        onOpenChange={setAddCandidateDialogOpen}
        onSuccess={refreshCandidates}
        folders={folders}
      />

      {/* Import Candidates Dialog */}
      <ImportCandidatesDialog 
        open={importCandidatesDialogOpen}
        onOpenChange={setImportCandidatesDialogOpen}
        onSuccess={refreshCandidates}
      />
    </div>
  );
};

export default RecruiterCandidates;
