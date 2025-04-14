
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScreeningCandidate } from "@/types/screening";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { VideoDialog } from "./VideoDialog";
import MatchScoreRing from "@/components/shared/MatchScoreRing";

interface CandidateRowProps {
  candidate: ScreeningCandidate;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const CandidateRow: React.FC<CandidateRowProps> = ({
  candidate,
  onSelectCandidate,
  onStatusChange
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <TableRow key={candidate.id}>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <MatchScoreRing score={candidate.screeningScore} size="sm" />
            </TooltipTrigger>
            <TooltipContent>
              Screening Score: {candidate.screeningScore}%
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-9 w-9 cursor-pointer border"
            onClick={() => setIsVideoOpen(true)}
          >
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <div 
              className="font-medium cursor-pointer hover:text-primary"
              onClick={() => onSelectCandidate(candidate)}
            >
              {candidate.name}
            </div>
            <div className="text-sm text-muted-foreground">{candidate.email}</div>
          </div>
        </div>
        
        <VideoDialog
          isOpen={isVideoOpen}
          onOpenChange={setIsVideoOpen}
          videoUrl={candidate.videoIntro}
          posterUrl={candidate.avatar}
        />
      </TableCell>
      
      <TableCell>{candidate.jobRole}</TableCell>
      <TableCell>{candidate.dateApplied}</TableCell>
      <TableCell>
        <StatusBadge status={candidate.status} />
      </TableCell>
      <TableCell>
        <span className="text-muted-foreground text-sm">
          {Math.floor(candidate.reviewTime / 60)}:{(candidate.reviewTime % 60).toString().padStart(2, '0')} min
        </span>
      </TableCell>
      <TableCell>
        <ActionButtons
          candidate={candidate}
          onSelectCandidate={onSelectCandidate}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
};
