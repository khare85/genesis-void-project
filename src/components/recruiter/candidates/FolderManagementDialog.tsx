
import React, { useState, useEffect } from 'react';
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

const folderColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
  '#000000', // black
];

export const FolderManagementDialog: React.FC<FolderManagementDialogProps> = ({
  open,
  onOpenChange,
  onCreateFolder,
  editingFolder,
  onEditFolder,
}) => {
  const [folderName, setFolderName] = useState(editingFolder?.name || '');
  const [folderDescription, setFolderDescription] = useState(editingFolder?.description || '');
  const [folderColor, setFolderColor] = useState(editingFolder?.color || folderColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingFolder && onEditFolder) {
      onEditFolder({
        ...editingFolder,
        name: folderName,
        description: folderDescription,
        color: folderColor,
      });
    } else {
      onCreateFolder({
        name: folderName,
        description: folderDescription,
        isDefault: false,
        color: folderColor,
      });
    }
    
    // Reset form and close dialog
    setFolderName('');
    setFolderDescription('');
    setFolderColor(folderColors[0]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Update form when editingFolder changes
  useEffect(() => {
    if (editingFolder) {
      setFolderName(editingFolder.name);
      setFolderDescription(editingFolder.description);
      setFolderColor(editingFolder.color || folderColors[0]);
    } else {
      setFolderName('');
      setFolderDescription('');
      setFolderColor(folderColors[0]);
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Folder Color</label>
            <div className="flex flex-wrap gap-2">
              {folderColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border ${
                    folderColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFolderColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
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
