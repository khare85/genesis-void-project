
import { Link } from "react-router-dom";
import { Mail, Phone, Calendar, FileText, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Applicant } from "@/hooks/recruiter/useJobApplicants";
import StageProgress from "./StageProgress";
import VideoPreview from "./VideoPreview";

interface ApplicantTableProps {
  applicants: Applicant[];
  isLoading: boolean;
}

// Status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
    case "pending":
      return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
    case "shortlisted":
      return <Badge className="bg-green-500 hover:bg-green-600">Shortlisted</Badge>;
    case "interviewed":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Interviewed</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ApplicantTable = ({ applicants, isLoading }: ApplicantTableProps) => {
  if (isLoading) {
    return null; // Loading state is handled by parent component
  }
  
  if (applicants.length === 0) {
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
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p>No applicants found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share this job posting to attract more candidates.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  
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
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="cursor-pointer hover:opacity-90 transition-opacity">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={applicant.profilePic} alt={applicant.name} />
                          <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-0">
                      {applicant.videoUrl ? (
                        <VideoPreview src={applicant.videoUrl} />
                      ) : (
                        <div className="flex items-center justify-center bg-gray-100 min-h-[180px]">
                          <span className="text-sm text-gray-500">No video available</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-semibold">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">{applicant.position}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {applicant.skills && applicant.skills.slice(0, 3).map((skill) => (
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
                      to={`/recruiter/candidates/${applicant.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {applicant.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{applicant.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MatchScoreRing score={applicant.matchScore || 0} size="sm" />
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(applicant.status)}</TableCell>
              <TableCell>
                <StageProgress stage={applicant.stage} />
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
                        <Link to={`/recruiter/candidates/${applicant.id}`}>View Profile</Link>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantTable;
