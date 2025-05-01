
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
  totalCount,
}) => {
  const getFolderName = () => {
    if (!currentFolder) return "All Candidates";
    const folder = folders.find((f) => f.id === currentFolder);
    return folder ? folder.name : "Unknown Folder";
  };

  return (
    <div>
      <h3 className="text-lg font-medium">
        {getFolderName()} <span className="text-sm text-muted-foreground ml-2">({totalCount})</span>
      </h3>
      <p className="text-sm text-muted-foreground">Talent Pool Management</p>
    </div>
  );
};
