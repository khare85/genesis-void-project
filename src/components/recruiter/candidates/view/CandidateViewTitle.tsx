
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Folder } from "@/components/recruiter/candidates/FolderGrid";

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
  const currentFolderName = folders.find(f => f.id === currentFolder)?.name || "All Candidates";
  
  return (
    <div className="flex items-center gap-2">
      <CardTitle>
        {currentFolderName} ({totalCount})
      </CardTitle>
    </div>
  );
};
