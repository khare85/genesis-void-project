
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder } from './FolderGrid';

interface FolderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (folder: Omit<Folder, 'id' | 'count'>) => void;
  editingFolder: Folder | null;
  onEditFolder?: (folder: Folder) => void;
}

export const FolderManagementDialog: React.FC<FolderManagementDialogProps> = ({
  open,
  onOpenChange,
  onCreateFolder,
  editingFolder,
  onEditFolder,
}) => {
  const [folderName, setFolderName] = useState(editingFolder?.name || '');
  const [folderDescription, setFolderDescription] = useState(editingFolder?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingFolder && onEditFolder) {
      onEditFolder({
        ...editingFolder,
        name: folderName,
        description: folderDescription,
      });
    } else {
      onCreateFolder({
        name: folderName,
        description: folderDescription,
        isDefault: false,
      });
    }
    
    // Reset form and close dialog
    setFolderName('');
    setFolderDescription('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Update form when editingFolder changes
  React.useEffect(() => {
    if (editingFolder) {
      setFolderName(editingFolder.name);
      setFolderDescription(editingFolder.description);
    } else {
      setFolderName('');
      setFolderDescription('');
    }
  }, [editingFolder, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingFolder ? 'Edit Folder' : 'Create New Folder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="folderName" className="text-sm font-medium">Folder Name</label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="folderDescription" className="text-sm font-medium">Description</label>
            <Textarea
              id="folderDescription"
              value={folderDescription}
              onChange={(e) => setFolderDescription(e.target.value)}
              placeholder="Enter folder description"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!folderName || isSubmitting}
            >
              {editingFolder ? 'Save Changes' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
