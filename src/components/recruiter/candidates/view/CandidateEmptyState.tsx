
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export const CandidateEmptyState: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <Card className="flex flex-col items-center justify-center p-12 border border-gray-100 rounded-lg bg-white shadow-sm">
      <CardContent className="text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">No candidates found</h3>
        <p className="text-gray-500 max-w-md">
          Try adjusting your search filters or add candidates to this folder
        </p>
      </CardContent>
    </Card>
  );
};
