
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  Search,
  XCircle,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AIGenerated from "@/components/shared/AIGenerated";
import { useApplications } from "@/hooks/useApplications";
import { DEMO_USERS } from "@/lib/auth/mockUsers";

const CandidateApplications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const { data: applications, isLoading, isError } = useApplications();
  
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
      icon: <CheckCircle2 className="h-4 w-4" />,
      notes: "Starting on June 1st, 2025"
    },
    { 
      id: "6",
      jobTitle: 'Frontend Engineer', 
      company: 'TechStart', 
      status: 'Rejected', 
      date: '3 months ago',
      statusColor: 'bg-red-500',
      icon: <XCircle className="h-4 w-4" />,
      notes: "Position filled with an internal candidate"
    },
    { 
      id: "7",
      jobTitle: 'Web Developer', 
      company: 'DigitalWorks', 
      status: 'Withdrawn', 
      date: '1 month ago',
      statusColor: 'bg-gray-500',
      icon: <XCircle className="h-4 w-4" />,
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

  const [selectedApplication, setSelectedApplication] = useState(null);

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
                <div className="space-y-4">
                  {activeApplications.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-2 mx-auto" />
                      <p className="text-sm font-medium mb-2">No active applications</p>
                      <p className="text-xs">Start applying to jobs to see them here</p>
                    </div>
                  ) : (
                    activeApplications.map((application) => (
                      <div 
                        key={application.id} 
                        className={`flex items-center justify-between p-4 rounded-md border ${selectedApplication?.id === application.id ? 'border-primary' : 'hover:border-primary hover:bg-muted/30'} transition-colors cursor-pointer`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-md ${application.statusColor} flex items-center justify-center text-white font-bold`}>
                            {application.company.substring(0, 1)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{application.jobTitle}</div>
                            <div className="text-xs text-muted-foreground">{application.company} • Applied {application.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-4">
                            {application.status}
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
              
              <TabsContent value="completed" className="p-0 border-0 mt-4">
                <div className="space-y-4">
                  {completedApplications.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-2 mx-auto" />
                      <p className="text-sm font-medium mb-2">No completed applications</p>
                      <p className="text-xs">Your completed applications will appear here</p>
                    </div>
                  ) : (
                    completedApplications.map((application) => (
                      <div 
                        key={application.id} 
                        className={`flex items-center justify-between p-4 rounded-md border ${selectedApplication?.id === application.id ? 'border-primary' : 'hover:border-primary hover:bg-muted/30'} transition-colors cursor-pointer`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-md ${application.statusColor} flex items-center justify-center text-white font-bold`}>
                            {application.company.substring(0, 1)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{application.jobTitle}</div>
                            <div className="text-xs text-muted-foreground">{application.company} • {application.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant={application.status === 'Offer Accepted' ? 'default' : 'destructive'} className="gap-1">
                            {application.icon}
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <h3 className="font-medium mb-4">Application Details</h3>
            {selectedApplication ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{selectedApplication.jobTitle}</h4>
                    <p className="text-sm text-muted-foreground">{selectedApplication.company}</p>
                  </div>
                  <Badge variant={selectedApplication.status === 'Offer Accepted' ? 'default' : 'outline'}>
                    {selectedApplication.status}
                  </Badge>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <h5 className="font-medium">Application Notes</h5>
                  <p className="text-sm">{selectedApplication.notes || 'No notes provided for this application.'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <FileText className="h-12 w-12 mb-2 mx-auto" />
                <p className="text-sm">Select an application to view details</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="font-medium mb-4">Application Insights</h3>
            <AIGenerated>
              <div className="space-y-4">
                <p className="text-sm">Based on your application history:</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average response time:</span>
                    <span className="font-medium">5 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interview conversion rate:</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Application success rate:</span>
                    <span className="font-medium">14%</span>
                  </div>
                </div>
                <div className="pt-4 border-t text-sm">
                  <h4 className="font-medium mb-2">Improvement suggestions:</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Highlight your React testing experience more prominently</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Add quantifiable achievements to your full stack projects</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Consider applying to medium-sized companies for better response rates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AIGenerated>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateApplications;
