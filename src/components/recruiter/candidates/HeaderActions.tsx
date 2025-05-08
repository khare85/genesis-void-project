
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface HeaderActionsProps {
  onAddCandidate: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onAddCandidate }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAddCandidate}>
        <Plus className="h-4 w-4 mr-2" />
        Add Candidate
      </Button>
      <Button asChild>
        <Link to="/recruiter/candidates/add">Import Candidates</Link>
      </Button>
    </div>
  );
};
