
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FolderPlus } from "lucide-react";
import { Folder } from "./FolderGrid";

interface FolderHeaderProps {
  showFolderView: boolean;
  currentFolder: string | null;
  folders: Folder[];
  onCreateFolder: () => void;
  onBackToFolders: () => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
  showFolderView,
  currentFolder,
  folders,
  onCreateFolder,
  onBackToFolders
}) => {
  const currentFolderName = folders.find(f => f.id === currentFolder)?.name || "All Candidates";
  
  if (showFolderView) {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
        <Button 
          onClick={onCreateFolder} 
          variant="outline"
          className="bg-white border-primary text-primary hover:bg-primary/5 transition-colors"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Create New Folder
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mb-4 flex items-center">
      <Button 
        variant="outline" 
        onClick={onBackToFolders} 
        className="mr-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Folders
      </Button>
      <h2 className="text-lg font-semibold text-gray-900">
        {currentFolderName}
      </h2>
    </div>
  );
};
