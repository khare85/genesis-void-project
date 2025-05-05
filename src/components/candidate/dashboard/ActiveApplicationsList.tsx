import React from 'react';
import { FileText, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
interface ActiveApplicationsListProps {
  applications: any[];
  isLoading: boolean;
  isDemoUser: boolean;
}
const ActiveApplicationsList: React.FC<ActiveApplicationsListProps> = ({
  applications,
  isLoading,
  isDemoUser
}) => {
  if (isLoading && !isDemoUser) {
    return <div className="text-center p-8">
        <div className="h-8 w-8 mx-auto mb-2 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading your applications...</p>
      </div>;
  }
  if (applications.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 mx-auto" />
        <p className="text-sm font-medium mb-2">No active applications</p>
        <p className="text-xs">Start applying to jobs to see them here</p>
      </div>;
  }
  return <div className="space-y-4 bg-white rounded-none">
      {applications.map((job, i) => <div key={job.id || i} className="flex items-center justify-between p-4 border hover:border-primary transition-colors rounded bg-white">
          <div className="flex items-center gap-4">
            <div className={`h-10 w-10 rounded-md ${job.statusColor} flex items-center justify-center text-white font-bold`}>
              {(isDemoUser ? job.company : job.company || "").substring(0, 1)}
            </div>
            <div>
              <div className="text-sm font-medium">{isDemoUser ? job.title : job.jobTitle}</div>
              <div className="text-xs text-muted-foreground">
                {job.company} • Applied {job.date}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-4">
              {job.status}
            </Badge>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>)}
    </div>;
};
export default ActiveApplicationsList;