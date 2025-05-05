
import React from "react";
import { Folder } from "../FolderGrid";

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
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{currentFolderName}</h3>
      <p className="text-sm text-gray-500">
        {totalCount} {totalCount === 1 ? "candidate" : "candidates"}
      </p>
    </div>
  );
};
