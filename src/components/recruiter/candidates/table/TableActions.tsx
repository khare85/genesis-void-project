
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, MoreHorizontal, MoveRight, FolderPlus } from "lucide-react";
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
import { Folder } from '../FolderGrid';

interface TableActionsProps {
  candidateId: string;
  currentFolder: string | null;
  folders: Folder[];
  onMoveToFolder?: (candidateId: string, folderId: string) => void;
}

// List of jobs for the move to job feature
const availableJobs = [
  { id: "job1", title: "Frontend Developer", department: "Engineering" },
  { id: "job2", title: "Backend Engineer", department: "Engineering" },
  { id: "job3", title: "Product Designer", department: "Design" },
  { id: "job4", title: "DevOps Engineer", department: "Infrastructure" },
  { id: "job5", title: "HR Recruiter", department: "Human Resources" },
];

export const TableActions: React.FC<TableActionsProps> = ({
  candidateId,
  currentFolder,
  folders,
  onMoveToFolder,
}) => {
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
            <Link to={`/recruiter/candidates/${candidateId}`}>View Profile</Link>
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
                    onClick={() => handleMoveToFolder(candidateId, folder.id)}
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
                    onClick={() => handleMoveToJob(candidateId, job.id)}
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
  );
};
