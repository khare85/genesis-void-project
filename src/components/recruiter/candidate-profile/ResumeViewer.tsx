
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeViewerProps {
  resumeUrl: string | undefined;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumeUrl }) => {
  return (
    <Card>
      <CardContent className="p-6">
        {resumeUrl ? (
          <iframe 
            src={resumeUrl} 
            className="w-full h-[600px] border-0"
            title="Candidate resume"
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No resume available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeViewer;
