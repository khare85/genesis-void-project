import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { InterviewTypeSelector } from "./interview/InterviewTypeSelector";
import { FaceToFaceInterviewForm } from "./interview/FaceToFaceInterviewForm";
import { AIInterviewForm } from "./interview/AIInterviewForm";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateEmail
}) => {
  const [interviewType, setInterviewType] = useState<"ai" | "face-to-face">("face-to-face");
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("10:00");
  const [duration, setDuration] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [agents, setAgents] = useState<{id: string; name: string; isConversational?: boolean;}[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  
  // Fetch ElevenLabs agents on component mount
  useEffect(() => {
    if (interviewType === "ai") {
      fetchElevenLabsAgents();
    }
  }, [interviewType]);
  
  const fetchElevenLabsAgents = async () => {
    setIsLoadingAgents(true);
    try {
      // Fetch agents from ElevenLabs via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-elevenlabs-agents', {});
      
      if (error) throw error;
      
      // Use mock data if no agents are returned (or function doesn't exist yet)
      const agentsData = data?.agents?.length ? data.agents : [
        { id: "pNInz6obpgDQGcFmaJgB", name: "Technical Interviewer", isConversational: true },
        { id: "EVQJtCNSo0L6uHQnImQu", name: "AI Recruiter", isConversational: true },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter", isConversational: true }
      ];
      
      setAgents(agentsData);
      if (agentsData.length > 0) {
        setSelectedAgentId(agentsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching ElevenLabs agents:', error);
      // Set some mock agents for fallback
      const mockAgents = [
        { id: "pNInz6obpgDQGcFmaJgB", name: "Technical Interviewer", isConversational: true },
        { id: "EVQJtCNSo0L6uHQnImQu", name: "AI Recruiter", isConversational: true },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Professional Recruiter", isConversational: true }
      ];
      setAgents(mockAgents);
      if (mockAgents.length > 0) {
        setSelectedAgentId(mockAgents[0].id);
      }
    } finally {
      setIsLoadingAgents(false);
    }
  };
  
  const handleSchedule = async () => {
    // For AI interviews, no date/time is needed
    if (interviewType === "ai" && !selectedAgentId) {
      toast.error("Please select an AI Interview Agent");
      return;
    }
    
    // For face-to-face interviews, date is required
    if (interviewType === "face-to-face" && !interviewDate) {
      toast.error("Please select an interview date");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date and time for storage - only for face-to-face interviews
      let formattedDate = null;
      let interviewDateTime = null;
      
      if (interviewType === "face-to-face") {
        formattedDate = format(interviewDate!, "yyyy-MM-dd");
        interviewDateTime = `${formattedDate}T${timeSlot}:00`;
      } else {
        // For AI interviews, set expiration 3 days from now
        const expiryDate = addDays(new Date(), 3);
        formattedDate = format(expiryDate, "yyyy-MM-dd");
        interviewDateTime = `${formattedDate}T23:59:59`;
      }
      
      // First get the application_id for this candidate if it exists
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (applicationError && applicationError.code !== 'PGRST116') {
        console.error("Error finding application:", applicationError);
      }
      
      const applicationId = applicationData?.id;
      
      // Create an interview record in the database
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          type: interviewType,
          scheduled_at: interviewDateTime,
          duration: parseInt(duration),
          status: 'scheduled',
          application_id: applicationId,
          // Use the metadata column to store additional information
          metadata: {
            timeZone,
            candidateName,
            candidateEmail,
            candidateId,
            ...(interviewType === "ai" && { 
              agentId: selectedAgentId,
              selectedAgent: agents.find(agent => agent.id === selectedAgentId)?.name || 'AI Interviewer',
              expiresAt: format(addDays(new Date(), 3), "yyyy-MM-dd"),
              requiresScheduling: false
            })
          }
        })
        .select();
      
      if (error) throw error;
      
      // Check if we have valid data returned
      const insertedInterview = data?.[0];
      if (!insertedInterview) {
        throw new Error("Failed to insert interview data");
      }
      
      // Generate Microsoft Teams link for face-to-face interviews
      let meetingLink = '';
      
      if (interviewType === 'face-to-face') {
        // In a real app, this would integrate with Microsoft Graph API
        // For now, we'll use a mock URL
        meetingLink = `https://teams.microsoft.com/l/meeting/new?subject=Interview%20with%20${encodeURIComponent(candidateName)}&content=Job%20Interview`;
        
        // Update the interview record with the meeting link
        await supabase
          .from('interviews')
          .update({ meeting_link: meetingLink })
          .eq('id', insertedInterview.id);
      }
      
      // Send notification to the candidate in a real app
      // This would be handled by an edge function to send emails
      
      toast.success(
        interviewType === 'ai' 
          ? "AI Interview scheduled successfully!" 
          : "Face-to-Face Interview scheduled successfully!"
      );
      
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Schedule an interview with {candidateName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <InterviewTypeSelector 
            interviewType={interviewType} 
            setInterviewType={setInterviewType} 
          />
          
          <Separator />
          
          {interviewType === "face-to-face" && (
            <FaceToFaceInterviewForm
              interviewDate={interviewDate}
              setInterviewDate={setInterviewDate}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              duration={duration}
              setDuration={setDuration}
              timeZone={timeZone}
              setTimeZone={setTimeZone}
              candidateEmail={candidateEmail}
            />
          )}
          
          {interviewType === "ai" && (
            <AIInterviewForm
              agents={agents}
              selectedAgentId={selectedAgentId}
              setSelectedAgentId={setSelectedAgentId}
              duration={duration}
              setDuration={setDuration}
              isLoadingAgents={isLoadingAgents}
            />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSchedule} 
            disabled={isSubmitting || (interviewType === "face-to-face" && !interviewDate) || (interviewType === "ai" && !selectedAgentId)}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
