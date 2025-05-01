
import React from "react";
import { Folder, FolderGrid } from "./FolderGrid";
import { Skeleton } from "@/components/ui/skeleton";

interface FolderViewProps {
  folders: Folder[];
  loadingFolders: boolean;
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  folders,
  loadingFolders,
  currentFolder,
  onFolderSelect,
  onEditFolder,
  onDeleteFolder
}) => {
  if (loadingFolders) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <FolderGrid 
        currentFolder={currentFolder}
        onFolderSelect={onFolderSelect}
        folders={folders}
        onEditFolder={onEditFolder}
        onDeleteFolder={onDeleteFolder}
      />
    </div>
  );
};
