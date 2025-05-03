import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Users } from "lucide-react";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";
import { FolderManagementDialog } from "@/components/recruiter/candidates/FolderManagementDialog";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { FolderHeader } from "@/components/recruiter/candidates/FolderHeader";
import { CandidateView } from "@/components/recruiter/candidates/CandidateView";
import { FolderView } from "@/components/recruiter/candidates/FolderView";
import { DeleteFolderDialog } from "@/components/recruiter/candidates/FolderDialogOptions";
import { useFolderManagement } from "@/hooks/recruiter/useFolderManagement";
import { useCandidateSelection } from "@/hooks/recruiter/useCandidateSelection";

const RecruiterCandidates: React.FC = () => {
  // State for UI management
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  
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
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolder(folderId);
    console.log(`Selected folder: ${folderId}`);
    
    // Clear selections when switching folders
    clearSelections();
    
    // If a folder is selected, show the filter sidebar
    if (folderId) {
      setShowFilterSidebar(true);
    }
  };

  // Open create folder dialog
  const openCreateFolderDialog = () => {
    setEditingFolder(null);
    setCreateFolderDialogOpen(true);
  };

  // Open edit folder dialog
  const openEditFolderDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setCreateFolderDialogOpen(true);
  };

  // Open delete folder confirmation dialog
  const openDeleteFolderDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setDeleteFolderDialogOpen(true);
  };

  // Handle folder deletion with confirmation
  const handleConfirmDeleteFolder = async () => {
    if (folderToDelete) {
      await deleteFolder(folderToDelete);
      setDeleteFolderDialogOpen(false);
      
      // If the deleted folder was selected, clear current folder
      if (currentFolder === folderToDelete.id) {
        setCurrentFolder(null);
      }
    }
  };

  // Go back to folders view
  const backToFolders = () => {
    setCurrentFolder(null);
    clearSelections();
  };

  // Determine if we're in folder view or candidate view
  const showFolderView = !currentFolder;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pool"
        description="Manage and review potential candidates"
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/recruiter/candidates/add">Add Candidates</Link>
            </Button>
          </div>
        }
      />
      
      <FolderHeader 
        showFolderView={showFolderView}
        currentFolder={currentFolder}
        folders={folders}
        onCreateFolder={openCreateFolderDialog}
        onBackToFolders={backToFolders}
      />
      
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
          candidates={
            currentFolder === defaultFolder?.id 
              ? candidates.filter(c => !c.folderId) // Show unassigned candidates for default folder
              : candidates.filter(c => c.folderId === currentFolder)
          }
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={
            currentFolder === defaultFolder?.id
              ? candidates.filter(c => !c.folderId).length
              : candidates.filter(c => c.folderId === currentFolder).length
          }
          selectedCandidates={selectedCandidates}
          onSelectCandidate={handleSelectCandidate}
          onSelectAll={handleSelectAll}
          onMoveToFolder={updateCandidateFolder}
          showFilterSidebar={showFilterSidebar}
          setShowFilterSidebar={setShowFilterSidebar}
        />
      )}

      {/* Folder Management Dialog - Using z-index to fix the click issue */}
      <FolderManagementDialog
        open={createFolderDialogOpen}
        onOpenChange={(open) => {
          setCreateFolderDialogOpen(open);
          // Ensure all backdrop elements are removed when dialog closes
          if (!open) {
            const backdropElements = document.querySelectorAll('[role="dialog"]');
            backdropElements.forEach((element) => {
              if (!element.contains(document.activeElement)) {
                (element as HTMLElement).style.zIndex = 'auto';
              }
            });
          }
        }}
        onCreateFolder={createFolder}
        editingFolder={editingFolder}
        onEditFolder={updateFolder}
      />

      {/* Delete Folder Confirmation Dialog */}
      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        onOpenChange={setDeleteFolderDialogOpen}
        onConfirmDelete={handleConfirmDeleteFolder}
        folder={folderToDelete}
      />
    </div>
  );
};

export default RecruiterCandidates;
