
import React from 'react';
import { Progress } from "@/components/ui/progress";
import AIGenerated from "@/components/shared/AIGenerated";

interface RunningStateContentProps {
  progress: number;
}

export const RunningStateContent: React.FC<RunningStateContentProps> = ({ progress }) => {
  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Processing...</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-4 space-y-2">
        <AIGenerated>
          <div className="text-xs space-y-1">
            <p>Analyzing candidate data...</p>
            <p>Extracting skills from resumes...</p>
            <p>Comparing with job requirements...</p>
            {progress > 30 && <p>Processing video introductions...</p>}
            {progress > 60 && <p>Generating candidate insights...</p>}
            {progress > 80 && <p>Calculating match scores...</p>}
            {progress === 100 && <p>Finalizing reports...</p>}
          </div>
        </AIGenerated>
      </div>
    </div>
  );
};
