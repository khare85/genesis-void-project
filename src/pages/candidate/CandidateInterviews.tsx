import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import AIGenerated from "@/components/shared/AIGenerated";
import { Calendar, CheckCircle2, Clock, FileText, Video, ArrowUpRight, MessageSquare, Sparkles, CalendarClock, BookOpen, Hourglass, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AIInterviewConsent from "@/components/application/AIInterviewConsent";

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  type: string;
  date: string;
  time: string;
  status: string;
  statusBadge: "default" | "outline" | "secondary" | "destructive";
  icon: React.ReactNode;
  notes?: string;
  duration?: string;
}

const CandidateInterviews = () => {
  const {
    user
  } = useAuth();

  const [showConsentDialog, setShowConsentDialog] = useState(false);

  const upcomingInterviews: Interview[] = [{
    id: "1",
    jobTitle: "Senior React Developer",
    company: "TechCorp Inc.",
    type: "AI Video Interview",
    date: "Tomorrow",
    time: "10:00 AM",
    status: "Scheduled",
    statusBadge: "default",
    icon: <Video className="h-4 w-4" />,
    duration: "30 min",
    notes: "Prepare to discuss React performance optimization and state management"
  }, {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "InnoTech Systems",
    type: "Technical Assessment",
    date: "Friday",
    time: "2:30 PM",
    status: "Scheduled",
    statusBadge: "default",
    icon: <FileText className="h-4 w-4" />,
    duration: "1 hour",
    notes: "Online coding challenge focused on algorithms and system design"
  }, {
    id: "3",
    jobTitle: "Frontend Developer",
    company: "WebSolutions Ltd",
    type: "HR Interview",
    date: "Next Monday",
    time: "11:15 AM",
    status: "Scheduled",
    statusBadge: "outline",
    icon: <MessageSquare className="h-4 w-4" />,
    duration: "45 min",
    notes: "Initial screening call with HR and team lead"
  }];

  const pastInterviews: Interview[] = [{
    id: "4",
    jobTitle: "JavaScript Developer",
    company: "SoftDev Inc.",
    type: "Technical Interview",
    date: "March 15, 2025",
    time: "2:00 PM",
    status: "Passed",
    statusBadge: "default",
    icon: <CheckCircle className="h-4 w-4" />,
    notes: "Received offer following this interview"
  }, {
    id: "5",
    jobTitle: "Frontend Engineer",
    company: "TechStart",
    type: "Panel Interview",
    date: "February 28, 2025",
    time: "10:30 AM",
    status: "Rejected",
    statusBadge: "destructive",
    icon: <XCircle className="h-4 w-4" />,
    notes: "Feedback: Need more experience with enterprise-scale applications"
  }, {
    id: "6",
    jobTitle: "Web Developer",
    company: "DigitalWorks",
    type: "AI Video Interview",
    date: "February 10, 2025",
    time: "9:00 AM",
    status: "Passed",
    statusBadge: "default",
    icon: <CheckCircle className="h-4 w-4" />,
    notes: "Advanced to next round but withdrew application"
  }];

  const interviewPrep = [{
    title: "Technical Questions",
    icon: <FileText className="h-5 w-5" />,
    tips: ["Review React hooks and lifecycle methods", "Practice explaining complex projects simply", "Prepare code samples demonstrating your skills"]
  }, {
    title: "Company Research",
    icon: <BookOpen className="h-5 w-5" />,
    tips: ["Study TechCorp's latest product releases", "Research their tech stack and development practices", "Understand their business model and main competitors"]
  }, {
    title: "Behavioral Preparation",
    icon: <MessageSquare className="h-5 w-5" />,
    tips: ["Prepare examples using the STAR method", "Have stories about teamwork and conflict resolution", "Be ready to explain your career goals"]
  }];

  const handleJoinInterview = () => {
    setShowConsentDialog(true);
  };

  const handleAcceptConsent = () => {
    setShowConsentDialog(false);
    console.log("Starting interview after consent...");
  };

  return <div className="space-y-6">
      <PageHeader title="Your Interviews" description="Manage upcoming and past interviews" actions={<Button size="sm" variant="outline" asChild>
            <Link to="/candidate/applications" className="gap-1.5">
              <FileText className="h-4 w-4" />
              View Applications
            </Link>
          </Button>} />
      
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium">Interviews</h3>
            <Badge className="bg-primary">
              {upcomingInterviews.length} Upcoming
            </Badge>
          </div>
          
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="p-0 border-0">
              <div className="space-y-4">
                {upcomingInterviews.map(interview => <div key={interview.id} className="p-4 rounded-md border-l-4 border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          {interview.icon}
                          <span className="font-medium">{interview.type}</span>
                          <Badge variant={interview.statusBadge}>{interview.status}</Badge>
                        </div>
                        <h4 className="font-medium mt-1">{interview.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <Button size="sm" className="ml-4" onClick={handleJoinInterview}>
                        Join AI Interview
                      </Button>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{interview.time}</span>
                        </div>
                        {interview.duration && <div className="flex items-center">
                            <Hourglass className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            <span>{interview.duration}</span>
                          </div>}
                      </div>
                    </div>
                    
                    {interview.notes && <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                        <p>{interview.notes}</p>
                      </div>}
                  </div>)}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="p-0 border-0">
              <div className="space-y-4">
                {pastInterviews.map(interview => <div key={interview.id} className="p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          {interview.icon}
                          <span className="font-medium">{interview.type}</span>
                          <Badge variant={interview.statusBadge}>{interview.status}</Badge>
                        </div>
                        <h4 className="font-medium mt-1">{interview.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-4">View Feedback</Button>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {interview.notes && <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                        <p>{interview.notes}</p>
                      </div>}
                  </div>)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                Interview Schedule
              </h3>
            </div>
            
            <div className="p-6 bg-muted/40 rounded-md text-center">
              <Calendar className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm mb-4">Calendar view will be displayed here</p>
              <Button size="sm" variant="outline">Sync Calendar</Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Interview Prep
              </h3>
            </div>
            
            <AIGenerated>
              <div className="space-y-4">
                {interviewPrep.map((section, index) => <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <h4 className="font-medium text-sm">{section.title}</h4>
                    </div>
                    <ul className="space-y-1 pl-7">
                      {section.tips.map((tip, tipIndex) => <li key={tipIndex} className="flex items-start gap-1.5 text-xs">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>)}
                    </ul>
                  </div>)}
                
                <Button size="sm" className="w-full mt-2">
                  Get Full Preparation Guide
                </Button>
              </div>
            </AIGenerated>
          </div>
        </Card>
      </div>

      <AIInterviewConsent
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        onAccept={handleAcceptConsent}
      />
    </div>;
};

export default CandidateInterviews;
