
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AIInterviewConsent from "@/components/application/AIInterviewConsent";
import AIInterviewSession from '@/components/application/AIInterviewSession';
import InterviewPrepCard from "@/components/candidate/interviews/InterviewPrepCard";
import UpcomingInterviewsList from "@/components/candidate/interviews/UpcomingInterviewsList";
import PastInterviewsList from "@/components/candidate/interviews/PastInterviewsList";
import InterviewSchedule from "@/components/candidate/interviews/InterviewSchedule";
import { useInterviews } from "@/hooks/useInterviews";
import { Interview } from "@/types/interviews";

const CandidateInterviews = () => {
  const { user } = useAuth();
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showInterviewSession, setShowInterviewSession] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("EVQJtCNSo0L6uHQnImQu");
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  
  const { upcomingInterviews, pastInterviews, isLoading, refreshInterviews } = useInterviews(user);
  
  const handleJoinInterview = (interview: Interview) => {
    // Only proceed to join interview if it's not cancelled
    if (interview.status !== "Cancelled") {
      if (interview.type.includes('AI')) {
        if (interview.agentId) {
          setSelectedAgentId(interview.agentId);
        }
        setShowConsentDialog(true);
        setSelectedInterview(interview.id);
      } else {
        // Handle face-to-face interview
        window.open(interview.notes || 'https://teams.microsoft.com/meeting', '_blank');
      }
    }
  };
  
  const handleAcceptConsent = () => {
    setShowConsentDialog(false);
    setShowInterviewSession(true);
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Your Interviews" 
        description="Manage upcoming and past interviews" 
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link to="/candidate/applications" className="gap-1.5">
              <FileText className="h-4 w-4" />
              View Applications
            </Link>
          </Button>
        } 
      />
      
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
              <TabsTrigger value="upcoming" className="bg-transparent">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="p-0 border-0">
              <UpcomingInterviewsList 
                interviews={upcomingInterviews}
                isLoading={isLoading}
                onJoinInterview={handleJoinInterview}
                onStatusChange={refreshInterviews}
              />
            </TabsContent>
            
            <TabsContent value="past" className="p-0 border-0">
              <PastInterviewsList 
                interviews={pastInterviews}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <InterviewSchedule upcomingInterviews={upcomingInterviews} />
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
    </div>
  );
};

export default CandidateInterviews;
