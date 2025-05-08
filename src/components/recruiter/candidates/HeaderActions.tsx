
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface HeaderActionsProps {
  onAddCandidate: () => void;
  onImportCandidates: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onAddCandidate, onImportCandidates }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAddCandidate}>
        <Plus className="h-4 w-4 mr-2" />
        Add Candidate
      </Button>
      <Button variant="outline" onClick={onImportCandidates}>
        <Upload className="h-4 w-4 mr-2" />
        Import Candidates
      </Button>
    </div>
  );
};
