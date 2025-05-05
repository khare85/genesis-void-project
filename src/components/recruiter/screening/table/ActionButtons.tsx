import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileCheck, Check, X, ArrowRight } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";
import { JobMoveDialog } from "../JobMoveDialog";
import { Link } from 'react-router-dom';
interface ActionButtonsProps {
  candidate: ScreeningCandidate;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  candidate,
  onSelectCandidate,
  onStatusChange
}) => {
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  return <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => onSelectCandidate(candidate)} title="View Details">
        <FileCheck className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50" onClick={() => onStatusChange(candidate, "approved")} disabled={candidate.status === 'approved'} title="Shortlist">
        <Check className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="icon" onClick={() => onStatusChange(candidate, "rejected")} disabled={candidate.status === 'rejected'} title="Not Selected" className="hover:bg-destructive/10 text-red-700">
        <X className="h-4 w-4" />
      </Button>
      
      <Link to={`/recruiter/candidates/${candidate.id}`}>
        <Button variant="ghost" size="icon" title="View Full Profile">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      
      <JobMoveDialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen} candidate={candidate} />
    </div>;
};