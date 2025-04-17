
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Folder,
  FolderPlus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface FolderManagementProps {
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export const FolderManagement: React.FC<FolderManagementProps> = ({
  currentFolder,
  onFolderSelect,
}) => {
  const [folders, setFolders] = useState([
    { id: "1", name: "Shortlisted", count: 12 },
    { id: "2", name: "Tech Roles", count: 8 },
    { id: "3", name: "Design Team", count: 5 },
  ]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        count: 0,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsNewFolderDialogOpen(false);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter((f) => f.id !== folderId));
    if (currentFolder === folderId) {
      onFolderSelect(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Folders</CardTitle>
          <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant={currentFolder === null ? "secondary" : "ghost"}
            className="w-full justify-between"
            onClick={() => onFolderSelect(null)}
          >
            <div className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              All Candidates
            </div>
            <span className="text-muted-foreground">
              {folders.reduce((acc, f) => acc + f.count, 0)}
            </span>
          </Button>
          
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center">
              <Button
                variant={currentFolder === folder.id ? "secondary" : "ghost"}
                className="flex-1 justify-between"
                onClick={() => onFolderSelect(folder.id)}
              >
                <div className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  {folder.name}
                </div>
                <span className="text-muted-foreground">{folder.count}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
