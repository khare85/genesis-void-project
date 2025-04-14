
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoDialogProps {
  videoUrl: string;
  posterUrl: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoDialog: React.FC<VideoDialogProps> = ({
  videoUrl,
  posterUrl,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Candidate Video Introduction</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-muted rounded-md overflow-hidden">
          <video 
            src={videoUrl} 
            controls 
            poster={posterUrl}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
