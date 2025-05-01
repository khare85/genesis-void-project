
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface ResumeViewerProps {
  resumeUrl: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ 
  resumeUrl, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use either external or internal state for open/close control
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const onOpenChange = externalOnOpenChange || setInternalOpen;
  
  const handleOpenResume = () => {
    setInternalOpen(true);
  };

  if (!resumeUrl) {
    return (
      <Card>
        <CardContent className="p-6 text-center flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          <h4 className="font-medium mb-1">No Resume Available</h4>
          <p className="text-muted-foreground text-sm">
            The candidate hasn't uploaded a resume yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* This shows when using the component directly without dialog control */}
      {externalOpen === undefined && (
        <Card className="cursor-pointer" onClick={handleOpenResume}>
          <CardContent className="p-6 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-6 w-6 mr-3 text-primary" />
              <div>
                <h4 className="font-medium">Resume</h4>
                <p className="text-sm text-muted-foreground">View or download candidate's resume</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              View
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog for viewing the resume */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Candidate Resume</DialogTitle>
          </DialogHeader>
          <div className="flex-1 mt-2 overflow-hidden">
            <iframe 
              src={resumeUrl} 
              className="w-full h-full border-0 rounded"
              title="Candidate resume"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button asChild>
              <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeViewer;
