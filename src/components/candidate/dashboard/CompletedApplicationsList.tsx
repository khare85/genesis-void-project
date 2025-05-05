import React from 'react';
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface CompletedApplicationsListProps {
  applications: any[];
  isLoading: boolean;
  isDemoUser: boolean;
}
const CompletedApplicationsList: React.FC<CompletedApplicationsListProps> = ({
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
        <p className="text-sm font-medium mb-2">No completed applications</p>
        <p className="text-xs">Your completed applications will appear here</p>
      </div>;
  }
  return <div className="space-y-4 bg-white rounded-md">
      {applications.map((job, i) => {
      // For real users, determine icon based on status
      const statusIcon = !isDemoUser ? job.status === 'Offer Accepted' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" /> : job.status === 'Offer Accepted' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
      return <div key={job.id || i} className="flex items-center justify-between p-4 border hover:border-primary transition-colors bg-white rounded-none">
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-md ${job.statusColor} flex items-center justify-center text-white font-bold`}>
                {(isDemoUser ? job.company : job.company || "").substring(0, 1)}
              </div>
              <div>
                <div className="text-sm font-medium">{isDemoUser ? job.title : job.jobTitle}</div>
                <div className="text-xs text-muted-foreground">
                  {job.company} • {job.date}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant={job.status === 'Offer Accepted' ? 'default' : 'destructive'} className="gap-1">
                {statusIcon}
                {job.status}
              </Badge>
            </div>
          </div>;
    })}
    </div>;
};
export default CompletedApplicationsList;