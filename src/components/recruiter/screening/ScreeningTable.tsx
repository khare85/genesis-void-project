import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, Check, Clock, FileCheck, 
  ChevronUp, ChevronDown, X 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  TooltipProvider, Tooltip, TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { ScreeningCandidate } from "@/types/screening";

interface ScreeningTableProps {
  candidates: ScreeningCandidate[];
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

const getSortIcon = (field: keyof ScreeningCandidate) => {
  if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
  return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
};

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'approved':
      return <Badge className="bg-green-500">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
  }
};

export const ScreeningTable: React.FC<ScreeningTableProps> = ({
  candidates,
  sortField,
  sortDirection,
  onSort,
  onSelectCandidate,
  onStatusChange
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Score</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('name')}>
                Candidate
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('jobRole')}>
                Role
                {getSortIcon('jobRole')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('dateApplied')}>
                Applied
                {getSortIcon('dateApplied')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('status')}>
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => onSort('reviewTime')}>
                Review Time
                {getSortIcon('reviewTime')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No candidates found.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
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
                    <Dialog>
                      <DialogTrigger>
                        <Avatar className="h-9 w-9 cursor-pointer border">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Candidate Video Introduction</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <video 
                            src={candidate.videoIntro} 
                            controls 
                            poster={candidate.avatar}
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
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
                </TableCell>
                <TableCell>{candidate.jobRole}</TableCell>
                <TableCell>{candidate.dateApplied}</TableCell>
                <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {Math.floor(candidate.reviewTime / 60)}:{(candidate.reviewTime % 60).toString().padStart(2, '0')} min
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onSelectCandidate(candidate)}
                      title="View Details"
                    >
                      <FileCheck className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => onStatusChange(candidate, "approved")}
                      disabled={candidate.status === 'approved'}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" 
                      onClick={() => onStatusChange(candidate, "rejected")}
                      disabled={candidate.status === 'rejected'}
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
