import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, Calendar, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MatchScoreRing from "@/components/shared/MatchScoreRing";
import { Link } from "react-router-dom";

interface CandidateTableProps {
  candidates: any[];
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentFolder: string | null;
}

// Status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
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

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  currentFolder,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  candidates.length > 0 &&
                  selectedCandidates.length === candidates.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCandidates.includes(candidate.id.toString())}
                  onCheckedChange={() => onSelectCandidate(candidate.id.toString())}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={candidate.profilePic} alt={candidate.name} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link
                    to={`/recruiter/candidates/${candidate.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {candidate.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell>{candidate.position}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MatchScoreRing score={candidate.matchScore} size="sm" />
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(candidate.status)}</TableCell>
              <TableCell>
                {new Date(candidate.appliedDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Resume"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Resume</span>
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
                        <Link to={`/recruiter/candidates/${candidate.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Remove Candidate
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
