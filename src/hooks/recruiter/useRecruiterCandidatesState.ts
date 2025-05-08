
import { useState } from "react";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";

export const useRecruiterCandidatesState = () => {
  // State for UI management
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [importCandidatesDialogOpen, setImportCandidatesDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolder(folderId);
    console.log(`Selected folder: ${folderId}`);
    
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

  // Go back to folders view
  const backToFolders = () => {
    setCurrentFolder(null);
  };

  return {
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
  };
};
