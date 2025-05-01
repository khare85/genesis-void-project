
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, Calendar, FileText, MoveRight, FolderPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Folder } from "./FolderGrid";

interface TalentPoolTableProps {
  candidates: any[];
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentFolder: string | null;
  folders: Folder[];
  onMoveToFolder?: (candidateId: string, folderId: string) => void;
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

// List of jobs for the move to job feature
const availableJobs = [
  { id: "job1", title: "Frontend Developer", department: "Engineering" },
  { id: "job2", title: "Backend Engineer", department: "Engineering" },
  { id: "job3", title: "Product Designer", department: "Design" },
  { id: "job4", title: "DevOps Engineer", department: "Infrastructure" },
  { id: "job5", title: "HR Recruiter", department: "Human Resources" },
];

export const TalentPoolTable: React.FC<TalentPoolTableProps> = ({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  currentFolder,
  folders = [],
  onMoveToFolder,
}) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleMoveToJob = (candidateId: string, jobId: string) => {
    // Here we would implement the actual API call to move the candidate
    console.log(`Moving candidate ${candidateId} to job ${jobId}`);
    
    // Show a success toast
    toast({
      title: "Candidate moved",
      description: "Candidate has been moved to the selected job.",
      duration: 3000,
    });
  };

  const handleMoveToFolder = (candidateId: string, folderId: string) => {
    if (onMoveToFolder) {
      onMoveToFolder(candidateId, folderId);
      
      // Show a success toast
      const folder = folders.find(f => f.id === folderId);
      toast({
        title: "Candidate moved",
        description: `Candidate has been moved to ${folder?.name || "selected folder"}.`,
        duration: 3000,
      });
    }
  };

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
            <TableHead className="w-[40px]">SN</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Recent Job & Stage</TableHead>
            <TableHead>Current Designation</TableHead>
            <TableHead>Current Company</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No candidates found.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate, index) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCandidates.includes(candidate.id.toString())}
                    onCheckedChange={() => onSelectCandidate(candidate.id.toString())}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
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
                <TableCell>
                  <div className="flex flex-col">
                    <span>{candidate.position}</span>
                    <span className="text-sm text-muted-foreground">Applied</span>
                  </div>
                </TableCell>
                <TableCell>{candidate.position || "Not specified"}</TableCell>
                <TableCell>{candidate.company || "Not specified"}</TableCell>
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
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <FolderPlus className="mr-2 h-4 w-4" />
                            <span>Move to folder</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {folders.map((folder) => (
                                <DropdownMenuItem 
                                  key={folder.id} 
                                  onClick={() => handleMoveToFolder(candidate.id, folder.id)}
                                  disabled={currentFolder === folder.id}
                                >
                                  <div className="flex flex-col">
                                    <span>{folder.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {folder.count} candidates
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <MoveRight className="mr-2 h-4 w-4" />
                            <span>Move to job</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {availableJobs.map((job) => (
                                <DropdownMenuItem 
                                  key={job.id} 
                                  onClick={() => handleMoveToJob(candidate.id, job.id)}
                                >
                                  <div className="flex flex-col">
                                    <span>{job.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {job.department}
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        
                        <DropdownMenuItem className="text-destructive">
                          Remove Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
