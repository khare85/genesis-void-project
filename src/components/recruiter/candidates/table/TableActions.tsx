
import React, { useState } from "react";
import { MoreHorizontal, Folder, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Folder as FolderType } from '../FolderGrid';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TableActionsProps {
  candidateId: string;
  currentFolder: string | null;
  folders: FolderType[];
  onMoveToFolder?: (candidateId: string, folderId: string) => Promise<boolean>;
}

export const TableActions: React.FC<TableActionsProps> = ({
  candidateId,
  currentFolder,
  folders,
  onMoveToFolder,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movingFolder, setMovingFolder] = useState(false);

  const handleMoveToFolder = async (folderId: string) => {
    if (onMoveToFolder) {
      setMovingFolder(true);
      try {
        const success = await onMoveToFolder(candidateId, folderId);
        if (success) {
          toast({
            title: "Candidate moved",
            description: "The candidate has been moved to the selected folder",
          });
          setDialogOpen(false);
        } else {
          toast({
            title: "Error",
            description: "Failed to move candidate to folder",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error moving candidate to folder:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setMovingFolder(false);
      }
    }
  };

  // Filter out the current folder from the list of folders to move to
  const availableFolders = folders.filter(folder => folder.id !== currentFolder);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 bg-background">
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Folder className="mr-2 h-4 w-4" />
            <span>Move to folder</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to={`/recruiter/candidates/${candidateId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="text-destructive">
            Remove Candidate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Move to folder dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to folder</DialogTitle>
            <DialogDescription>
              Select a folder to move this candidate to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
              {availableFolders.map((folder) => (
                <Button
                  key={folder.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleMoveToFolder(folder.id)}
                  disabled={movingFolder}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: folder.color }}
                  ></div>
                  {folder.name}
                  <span className="ml-auto text-muted-foreground text-xs">
                    {folder.count} candidates
                  </span>
                </Button>
              ))}
              {availableFolders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center p-2">
                  No other folders available
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
