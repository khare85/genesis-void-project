
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter } from "lucide-react";
import { FilterJob } from "./filters/FilterJob";

interface HeaderActionsProps {
  onAddCandidate: () => void;
  onImportCandidates: () => void;
  selectedJob: string | null;
  setSelectedJob: (jobId: string | null) => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  onAddCandidate, 
  onImportCandidates,
  selectedJob,
  setSelectedJob
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <FilterJob selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
      </div>
    </div>
  );
};
