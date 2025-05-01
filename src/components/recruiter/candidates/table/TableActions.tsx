
import React, { useState } from "react";
import { MoreHorizontal, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Folder as FolderType } from '../FolderGrid';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [movingFolder, setMovingFolder] = useState(false);

  const handleMoveToFolder = async (folderId: string) => {
    if (onMoveToFolder) {
      setMovingFolder(true);
      await onMoveToFolder(candidateId, folderId);
      setMovingFolder(false);
      setDrawerOpen(false);
    }
  };

  // Filter out the current folder from the list of folders to move to
  const availableFolders = folders.filter(folder => folder.id !== currentFolder);

  return (
    <div className="flex justify-end z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 bg-background">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Move to folder</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="z-50 bg-background">
                <DrawerHeader>
                  <DrawerTitle>Move to folder</DrawerTitle>
                  <DrawerDescription>
                    Select a folder to move this candidate to.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 py-4 px-4">
                  <div className="grid grid-cols-1 gap-2">
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
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DropdownMenuItem>
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Remove Candidate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
