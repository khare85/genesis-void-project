
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import { Search, SlidersHorizontal, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useApplications, Application } from "@/hooks/useApplications";
import { DEMO_USERS } from "@/lib/auth/mockUsers";
import ApplicationList from "@/components/candidate/applications/ApplicationList";
import ApplicationDetails from "@/components/candidate/applications/ApplicationDetails";
import ApplicationInsights from "@/components/candidate/applications/ApplicationInsights";

const CandidateApplications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const { data: applications, isLoading, isError } = useApplications();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  const isDemoUser = user?.email === DEMO_USERS['candidate@example.com']?.email;

  // Mock application data for demo user
  const demoActiveApplications = [
    { 
      id: "1",
      jobTitle: 'Senior React Developer', 
      company: 'TechCorp Inc.', 
      status: 'Interview Scheduled', 
      date: '2 days ago',
      statusColor: 'bg-blue-500',
      notes: "Technical interview scheduled for next Tuesday at 10:00 AM"
    },
    { 
      id: "2",
      jobTitle: 'Frontend Developer', 
      company: 'WebSolutions Ltd', 
      status: 'Application Under Review', 
      date: '1 week ago',
      statusColor: 'bg-amber-500',
      notes: "HR is reviewing your application"
    },
    { 
      id: "3",
      jobTitle: 'Full Stack Engineer', 
      company: 'InnoTech Systems', 
      status: 'Technical Assessment', 
      date: '5 days ago',
      statusColor: 'bg-purple-500',
      notes: "Assessment due in 3 days"
    },
    { 
      id: "4",
      jobTitle: 'UI/UX Developer', 
      company: 'DesignPro Agency', 
      status: 'Application Submitted', 
      date: '2 weeks ago',
      statusColor: 'bg-gray-500',
      notes: "Waiting for initial screening"
    }
  ];

  const demoCompletedApplications = [
    { 
      id: "5",
      jobTitle: 'JavaScript Developer', 
      company: 'SoftDev Inc.', 
      status: 'Offer Accepted', 
      date: '2 months ago',
      statusColor: 'bg-green-500',
      notes: "Starting on June 1st, 2025"
    },
    { 
      id: "6",
      jobTitle: 'Frontend Engineer', 
      company: 'TechStart', 
      status: 'Rejected', 
      date: '3 months ago',
      statusColor: 'bg-red-500',
      notes: "Position filled with an internal candidate"
    },
    { 
      id: "7",
      jobTitle: 'Web Developer', 
      company: 'DigitalWorks', 
      status: 'Withdrawn', 
      date: '1 month ago',
      statusColor: 'bg-gray-500',
      notes: "Withdrew application due to relocation"
    }
  ];

  // Use real data for actual users, demo data for demo users
  const activeApplications = isDemoUser 
    ? demoActiveApplications
    : applications?.filter(app => 
        !['offer_accepted', 'rejected', 'withdrawn'].includes(app.status.toLowerCase())
      ) || [];
  
  const completedApplications = isDemoUser
    ? demoCompletedApplications
    : applications?.filter(app => 
        ['offer_accepted', 'rejected', 'withdrawn'].includes(app.status.toLowerCase())
      ) || [];

  if (isLoading && !isDemoUser) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Your Applications"
          description="Track all your job applications in one place"
        />
        <Card className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Clock className="h-12 w-12 mb-2 mx-auto text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading your applications...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError && !isDemoUser) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Your Applications"
          description="Track all your job applications in one place"
        />
        <Card className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 mb-2 mx-auto text-destructive" />
              <p className="text-muted-foreground">Failed to load your applications. Please try again later.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Applications"
        description="Track all your job applications in one place"
        actions={
          <Button size="sm" asChild>
            <Link to="/candidate/jobs" className="gap-1.5">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        }
      />
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active ({activeApplications.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
              </TabsList>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{activeApplications.length + completedApplications.length}</strong> applications
                </div>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <TabsContent value="active" className="p-0 border-0 mt-4">
                <ApplicationList 
                  applications={activeApplications}
                  type="active"
                  selectedApplicationId={selectedApplication?.id || null}
                  onSelectApplication={setSelectedApplication}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="p-0 border-0 mt-4">
                <ApplicationList 
                  applications={completedApplications}
                  type="completed"
                  selectedApplicationId={selectedApplication?.id || null}
                  onSelectApplication={setSelectedApplication}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <h3 className="font-medium mb-4">Application Details</h3>
            <ApplicationDetails selectedApplication={selectedApplication} />
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="font-medium mb-4">Application Insights</h3>
            <ApplicationInsights />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateApplications;
