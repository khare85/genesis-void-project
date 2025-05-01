
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
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
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { ScreeningCandidate } from "@/types/screening";
import { getStatusBadge } from "./utils/applicantUtils";
import { StageProgress } from "./StageProgress";
import { VideoPreview } from "./VideoPreview";

interface ApplicantTableProps {
  applicants: ScreeningCandidate[];
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({ applicants }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Candidate</TableHead>
            <TableHead>Match</TableHead>
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
                      <Link
                        to={`/recruiter/candidates/${applicant.candidate_id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {applicant.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{applicant.position}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MatchScoreRing score={applicant.matchScore} size="sm" />
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
                      title="Call"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm" 
                      className="h-8 w-8 p-0"
                      title="Schedule"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Schedule</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/recruiter/candidates/${applicant.candidate_id}`}>View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Move to Shortlist</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Reject Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
  );
};

// Import Badge in the component
import { Badge } from "@/components/ui/badge";
