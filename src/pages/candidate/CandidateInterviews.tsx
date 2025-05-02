
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import AIGenerated from "@/components/shared/AIGenerated";
import { Calendar, CheckCircle2, Clock, FileText, Video, ArrowUpRight, MessageSquare, Sparkles, CalendarClock, BookOpen, Hourglass, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import AIInterviewConsent from "@/components/application/AIInterviewConsent";
import AIInterviewSession from '@/components/application/AIInterviewSession';
import InterviewPrepCard from "@/components/candidate/interviews/InterviewPrepCard";
import { toast } from "sonner";
import { format } from "date-fns";

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
  agentId?: string;
  agentName?: string;
}

interface InterviewData {
  id: string;
  type: string;
  status: string;
  scheduled_at: string;
  duration?: number;
  metadata?: any; 
  applications?: {
    jobs?: {
      title?: string;
      company?: string;
    }
  };
}

const CandidateInterviews = () => {
  const { user } = useAuth();
  
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showInterviewSession, setShowInterviewSession] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("EVQJtCNSo0L6uHQnImQu");
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarSynced, setCalendarSynced] = useState(false);

  // Fetch interviews from the database
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Get all interviews for this candidate - FIX: Split into two separate conditions with or()
        const { data: interviewsData, error } = await supabase
          .from('interviews')
          .select(`
            *,
            applications (
              jobs (
                title,
                company
              )
            )
          `)
          // Fixed the query syntax by properly formatting the or conditions
          .or(`metadata->>candidateId.eq.${user.id},applications.candidate_id.eq.${user.id}`);
          
        if (error) throw error;

        const upcoming: Interview[] = [];
        const past: Interview[] = [];
        
        // Process interviews data
        interviewsData?.forEach((interview: InterviewData) => {
          // Ensure metadata is always an object
          const metadata = interview.metadata || {};
          
          const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
          const now = new Date();
          
          const formattedDate = scheduledDate ? format(scheduledDate, 'MMMM d, yyyy') : 'Flexible';
          const formattedTime = scheduledDate ? format(scheduledDate, 'h:mm a') : 'Any time';
          
          const jobTitle = interview.applications?.jobs?.title || 'Unknown Position';
          const company = interview.applications?.jobs?.company || 'Unknown Company';
          
          // Create interview object
          const interviewObj: Interview = {
            id: interview.id,
            jobTitle,
            company,
            type: interview.type === 'ai' ? 'AI Video Interview' : 'Face-to-Face Interview',
            date: formattedDate,
            time: formattedTime,
            status: interview.status.charAt(0).toUpperCase() + interview.status.slice(1),
            statusBadge: 'default',
            icon: interview.type === 'ai' ? <Video className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />,
            duration: `${interview.duration || 30} min`,
            notes: metadata.notes,
            agentId: metadata.agentId,
            agentName: metadata.selectedAgent
          };
          
          // Determine if interview is upcoming or past
          if (scheduledDate && scheduledDate < now && interview.status !== 'scheduled') {
            // Past interview
            past.push(interviewObj);
          } else {
            // Upcoming interview
            upcoming.push(interviewObj);
          }
        });
        
        setUpcomingInterviews(upcoming);
        setPastInterviews(past);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        toast.error('Failed to load your interviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchInterviews();
    }
  }, [user?.id]);

  const handleJoinInterview = (interview: Interview) => {
    if (interview.type.includes('AI')) {
      if (interview.agentId) {
        setSelectedAgentId(interview.agentId);
      }
      setShowConsentDialog(true);
    } else {
      // Handle face-to-face interview
      window.open(interview.notes || 'https://teams.microsoft.com/meeting', '_blank');
    }
  };

  const handleAcceptConsent = () => {
    setShowConsentDialog(false);
    setShowInterviewSession(true);
  };

  const handleSyncCalendar = () => {
    // In a real app, this would integrate with the user's calendar service
    toast.success("Calendar synced successfully!");
    setCalendarSynced(true);
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
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : upcomingInterviews.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No Upcoming Interviews</h3>
                  <p className="text-muted-foreground">
                    You don't have any interviews scheduled yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map(interview => (
                    <div key={interview.id} className="p-4 rounded-md border-l-4 border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
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
                        <Button 
                          size="sm" 
                          className="ml-4"
                          onClick={() => handleJoinInterview(interview)}
                        >
                          {interview.type.includes('AI') ? 'Join AI Interview' : 'Join Interview'}
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
                      
                      {interview.agentName && (
                        <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                          <p>AI Interviewer: {interview.agentName}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="p-0 border-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pastInterviews.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No Past Interviews</h3>
                  <p className="text-muted-foreground">
                    You haven't completed any interviews yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastInterviews.map(interview => (
                    <div key={interview.id} className="p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
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
                    </div>
                  ))}
                </div>
              )}
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
            
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/40 rounded-md">
                  <h4 className="font-medium mb-3">Upcoming Interviews</h4>
                  <ul className="space-y-2">
                    {upcomingInterviews.map(interview => (
                      <li key={interview.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{interview.jobTitle}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> {interview.date}, <Clock className="h-3 w-3" /> {interview.time}
                          </div>
                        </div>
                        <Badge variant="outline" className={interview.type.includes('AI') ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
                          {interview.type}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-center">
                    <Button 
                      size="sm" 
                      variant={calendarSynced ? "outline" : "default"}
                      onClick={handleSyncCalendar}
                      className="gap-1.5"
                    >
                      <Calendar className="h-4 w-4" />
                      {calendarSynced ? "Calendar Synced" : "Sync Calendar"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-muted/40 rounded-md text-center">
                <Calendar className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm mb-4">Calendar view will be displayed here</p>
                <Button size="sm" variant="outline" onClick={handleSyncCalendar}>Sync Calendar</Button>
              </div>
            )}
          </div>
        </Card>
        
        <InterviewPrepCard />
      </div>

      <AIInterviewConsent
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        onAccept={handleAcceptConsent}
      />

      <AIInterviewSession
        open={showInterviewSession}
        onClose={() => setShowInterviewSession(false)}
        agentId={selectedAgentId}
      />
    </div>;
};

export default CandidateInterviews;
