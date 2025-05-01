
import React from 'react';
import { Zap } from "lucide-react";

interface CompletedStateContentProps {
  strongMatches: number;
  mediumMatches: number;
  lowMatches: number;
}

export const CompletedStateContent: React.FC<CompletedStateContentProps> = ({
  strongMatches,
  mediumMatches,
  lowMatches
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-primary/10 border border-primary/30 p-4 text-center">
        <Zap className="mx-auto h-8 w-8 text-primary mb-2" />
        <h3 className="font-medium">Screening Complete</h3>
        <p className="text-sm text-muted-foreground mt-1">
          All candidates have been processed and scored
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="font-medium">{strongMatches}</div>
          <div className="text-xs text-muted-foreground">Strong matches</div>
        </div>
        <div>
          <div className="font-medium">{mediumMatches}</div>
          <div className="text-xs text-muted-foreground">Medium matches</div>
        </div>
        <div>
          <div className="font-medium">{lowMatches}</div>
          <div className="text-xs text-muted-foreground">Low matches</div>
        </div>
      </div>
    </div>
  );
};
