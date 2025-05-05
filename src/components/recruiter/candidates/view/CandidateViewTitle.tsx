
import React from "react";
import { Folder } from "../FolderGrid";
import { FolderOpen } from "lucide-react";

interface CandidateViewTitleProps {
  currentFolder: string | null;
  folders: Folder[];
  totalCount: number;
}

export const CandidateViewTitle: React.FC<CandidateViewTitleProps> = ({
  currentFolder,
  folders,
  totalCount
}) => {
  const currentFolderName = folders.find(f => f.id === currentFolder)?.name || "All Candidates";
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        <FolderOpen className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{currentFolderName}</h3>
        <p className="text-sm text-gray-500">
          {totalCount} {totalCount === 1 ? "candidate" : "candidates"}
        </p>
      </div>
    </div>
  );
};
