
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScreeningCandidate } from "@/types/screening";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { VideoDialog } from "./VideoDialog";
import { Badge } from "@/components/ui/badge";

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
  
  // Always use the match category from the candidate if available
  const matchCategory = candidate.matchCategory || getMatchCategory(candidate.matchScore || 0);
  
  // Use the match category based on match score
  function getMatchCategory(score: number): "High Match" | "Medium Match" | "Low Match" | "No Match" {
    if (score >= 80) return "High Match";
    if (score >= 50) return "Medium Match";
    if (score > 0) return "Low Match";
    return "No Match";
  }
  
  const getMatchBadge = (category: string) => {
    switch(category) {
      case "High Match":
        return <Badge className="bg-green-500 hover:bg-green-600 whitespace-nowrap">High Match</Badge>;
      case "Medium Match":
        return <Badge className="bg-amber-500 hover:bg-amber-600 whitespace-nowrap">Medium Match</Badge>;
      case "Low Match":
        return <Badge className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap">Low Match</Badge>;
      case "No Match":
        return <Badge className="bg-red-500 hover:bg-red-600 whitespace-nowrap">No Match</Badge>;
      default:
        return <Badge variant="outline" className="whitespace-nowrap">Unrated</Badge>;
    }
  };

  return (
    <TableRow key={candidate.id}>
      <TableCell className="w-[150px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="block w-full">
              {getMatchBadge(matchCategory)}
            </TooltipTrigger>
            <TooltipContent>
              Match Score: {candidate.matchScore}%
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
        <ActionButtons
          candidate={candidate}
          onSelectCandidate={onSelectCandidate}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
};
