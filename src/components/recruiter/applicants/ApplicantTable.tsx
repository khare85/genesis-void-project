
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Calendar, ExternalLink, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { ScreeningCandidate } from "@/types/screening";
import { getStatusBadge } from "./utils/applicantUtils";
import { StageProgress } from "./StageProgress";
import { VideoPreview } from "./VideoPreview";
import { CandidateDetail } from "@/components/recruiter/screening/CandidateDetail";

interface ApplicantTableProps {
  applicants: ScreeningCandidate[];
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({ applicants }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningCandidate | null>(null);
  
  const handleStatusChange = (candidate: ScreeningCandidate, status: "approved" | "rejected") => {
    // This would normally update the status in the database
    toast({
      title: `Candidate ${status}`,
      description: `${candidate.name} has been ${status}.`,
    });
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Candidate</TableHead>
              <TableHead className="w-[120px]">Match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer hover:opacity-90 transition-opacity">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={applicant.avatar} alt={applicant.name} />
                              <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0">
                          <VideoPreview src={applicant.videoIntro} />
                          <div className="p-3">
                            <h4 className="font-semibold">{applicant.name}</h4>
                            <p className="text-sm text-muted-foreground">{applicant.position}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {applicant.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <div>
                        <button
                          onClick={() => setSelectedCandidate(applicant)}
                          className="hover:text-primary hover:underline"
                        >
                          {applicant.name}
                        </button>
                        <p className="text-xs text-muted-foreground">{applicant.position}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <div className="flex items-center">
                      <MatchScoreRing score={applicant.matchScore} size="sm" />
                      <span className="ml-2 whitespace-nowrap">{applicant.matchScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                  <TableCell>
                    <StageProgress stage={applicant.stage || 0} />
                  </TableCell>
                  <TableCell>{applicant.applicationDate}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Email"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Schedule Interview"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="sr-only">Schedule Interview</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Full Profile"
                        asChild
                      >
                        <a href={`/recruiter/candidates/${applicant.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Full Profile</span>
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        title="Reject Candidate"
                        onClick={() => handleStatusChange(applicant, "rejected")}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedCandidate && (
        <CandidateDetail 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

// Import Badge in the component
import { Badge } from "@/components/ui/badge";
