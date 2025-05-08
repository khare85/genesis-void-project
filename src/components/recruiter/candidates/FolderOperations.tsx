
import React from "react";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";
import { FolderManagementDialog } from "@/components/recruiter/candidates/FolderManagementDialog";
import { DeleteFolderDialog } from "@/components/recruiter/candidates/FolderDialogOptions";

interface FolderOperationsProps {
  createFolderDialogOpen: boolean;
  setCreateFolderDialogOpen: (open: boolean) => void;
  deleteFolderDialogOpen: boolean;
  setDeleteFolderDialogOpen: (open: boolean) => void;
  editingFolder: Folder | null;
  folderToDelete: Folder | null;
  createFolder: (folderData: Omit<Folder, 'id' | 'count'>) => Promise<boolean>;
  updateFolder: (updatedFolder: Folder) => Promise<boolean>;
  deleteFolder: (folderToDelete: Folder) => Promise<boolean>;
  currentFolder: string | null;
  setCurrentFolder: (folderId: string | null) => void;
}

export const FolderOperations: React.FC<FolderOperationsProps> = ({
  createFolderDialogOpen,
  setCreateFolderDialogOpen,
  deleteFolderDialogOpen,
  setDeleteFolderDialogOpen,
  editingFolder,
  folderToDelete,
  createFolder,
  updateFolder,
  deleteFolder,
  currentFolder,
  setCurrentFolder
}) => {
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
  
  return (
    <>
      {/* Folder Management Dialog */}
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
    </>
  );
};
