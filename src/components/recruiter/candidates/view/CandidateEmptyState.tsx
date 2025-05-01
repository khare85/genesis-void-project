
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CandidateEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  return (
    <Card className="flex items-center justify-center p-8">
      <CardContent className="text-center">
        <h3 className="text-lg font-medium">No candidates found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or adding new candidates
        </p>
      </CardContent>
    </Card>
  );
};
