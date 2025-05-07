
import React from 'react';
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="text-center p-8">
        <div className="h-8 w-8 mx-auto mb-2 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading your applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 mx-auto" />
        <p className="text-sm font-medium mb-2">No completed applications</p>
        <p className="text-xs">Your completed applications will appear here</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/candidate/jobs">Find Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white">
      {applications.map((job, i) => {
        const isSuccess = job.status === 'Offer Accepted' || job.status === 'Accepted';
        const statusIcon = isSuccess ? 
          <CheckCircle2 className="h-4 w-4" /> : 
          <XCircle className="h-4 w-4" />;
        
        return (
          <Card 
            key={job.id || i} 
            className="flex items-center justify-between p-4 border-gray-100 hover:border-primary transition-colors shadow-sm bg-white rounded-none"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-md ${job.statusColor} flex items-center justify-center text-white font-bold`}>
                {(job.company || "").substring(0, 1)}
              </div>
              <div>
                <div className="text-sm font-medium">{job.title}</div>
                <div className="text-xs text-muted-foreground">
                  {job.company} • {job.date}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Badge 
                variant={isSuccess ? 'default' : 'destructive'} 
                className="gap-1"
              >
                {statusIcon}
                {job.status}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CompletedApplicationsList;
