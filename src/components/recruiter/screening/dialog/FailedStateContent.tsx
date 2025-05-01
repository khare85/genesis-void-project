
import React from 'react';

export const FailedStateContent: React.FC = () => {
  return (
    <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-center">
      <h3 className="font-medium text-destructive">Screening Failed</h3>
      <p className="text-sm text-muted-foreground mt-1">
        There was a problem during the AI screening process.
      </p>
    </div>
  );
};
