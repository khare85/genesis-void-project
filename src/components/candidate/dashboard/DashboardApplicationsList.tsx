
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, CheckCircle2, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Application } from "@/hooks/useApplications";

interface ApplicationItem {
  id: string;
  title?: string;
  jobTitle?: string;
  company: string;
  status: string;
  date: string;
  statusColor: string;
  icon?: React.ReactNode;
}

interface DashboardApplicationsListProps {
  activeApplications: (Application | any)[];
  completedApplications: (Application | any)[];
  isLoading: boolean;
  isDemoUser: boolean;
}

const DashboardApplicationsList: React.FC<DashboardApplicationsListProps> = ({
  activeApplications,
  completedApplications,
  isLoading,
  isDemoUser
}) => {
  return (
    <Card className="col-span-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Your Applications</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to="/candidate/applications">View All</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="p-0 border-0">
            <div className="space-y-4">
              {isLoading && !isDemoUser ? (
                <div className="text-center p-8">
                  <div className="h-8 w-8 mx-auto mb-2 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Loading your applications...</p>
                </div>
              ) : activeApplications.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2 mx-auto" />
                  <p className="text-sm font-medium mb-2">No active applications</p>
                  <p className="text-xs">Start applying to jobs to see them here</p>
                </div>
              ) : (
                activeApplications.map((job, i) => (
                  <div key={job.id || i} className="flex items-center justify-between p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
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
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="p-0 border-0">
            <div className="space-y-4">
              {isLoading && !isDemoUser ? (
                <div className="text-center p-8">
                  <div className="h-8 w-8 mx-auto mb-2 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Loading your applications...</p>
                </div>
              ) : completedApplications.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2 mx-auto" />
                  <p className="text-sm font-medium mb-2">No completed applications</p>
                  <p className="text-xs">Your completed applications will appear here</p>
                </div>
              ) : (
                completedApplications.map((job, i) => {
                  // For real users, determine icon based on status
                  const statusIcon = !isDemoUser ? 
                    (job.status === 'Offer Accepted' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />) :
                    job.icon;
                  
                  return (
                    <div key={job.id || i} className="flex items-center justify-between p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
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
                        <Badge 
                          variant={job.status === 'Offer Accepted' ? 'default' : 'destructive'} 
                          className="gap-1"
                        >
                          {statusIcon}
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default DashboardApplicationsList;
