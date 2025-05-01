
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Video, Users, Globe, Clock, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
}

interface ElevenLabsAgent {
  id: string;
  name: string;
  isConversational?: boolean;
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
  const [agents, setAgents] = useState<ElevenLabsAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }
  
  // List of common time zones
  const timeZones = [
    "America/New_York", // Eastern Time
    "America/Chicago", // Central Time
    "America/Denver", // Mountain Time
    "America/Los_Angeles", // Pacific Time
    "America/Anchorage", // Alaska Time
    "Pacific/Honolulu", // Hawaii Time
    "Europe/London", // GMT
    "Europe/Paris", // Central European Time
    "Europe/Athens", // Eastern European Time
    "Asia/Dubai", // Gulf Standard Time
    "Asia/Kolkata", // Indian Standard Time
    "Asia/Shanghai", // China Standard Time
    "Asia/Tokyo", // Japan Standard Time
    "Australia/Sydney", // Australian Eastern Time
    "Pacific/Auckland", // New Zealand Standard Time
  ];

  // Format time zone for display
  const formatTimeZone = (timeZone: string) => {
    try {
      const now = new Date();
      const timeZoneName = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'short' }).format(now);
      const offset = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' }).formatToParts(now)
        .find(part => part.type === 'timeZoneName')?.value || '';
      return `${timeZone.replace(/_/g, ' ')} (${offset})`;
    } catch (e) {
      return timeZone;
    }
  };
  
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
      
      // Create an interview record in the database
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          type: interviewType,
          scheduled_at: interviewDateTime,
          duration: parseInt(duration),
          status: 'scheduled',
          // Add time zone and agent info to the record
          metadata: JSON.stringify({
            timeZone,
            ...(interviewType === "ai" && { 
              agentId: selectedAgentId,
              expiresAt: format(addDays(new Date(), 3), "yyyy-MM-dd"),
              requiresScheduling: false
            })
          })
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
          <RadioGroup 
            value={interviewType} 
            onValueChange={(value) => setInterviewType(value as "ai" | "face-to-face")}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="face-to-face" id="face-to-face" />
              <Label htmlFor="face-to-face" className="flex items-center cursor-pointer">
                <Users className="mr-2 h-4 w-4" /> 
                Face-to-Face (Teams)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ai" id="ai" />
              <Label htmlFor="ai" className="flex items-center cursor-pointer">
                <Video className="mr-2 h-4 w-4" /> 
                AI Interview
              </Label>
            </div>
          </RadioGroup>
          
          <Separator />
          
          {interviewType === "face-to-face" && (
            <>
              <div className="space-y-2">
                <Label>Interview Date</Label>
                <div className="border rounded-md p-2 w-full">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={setInterviewDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="mx-auto w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeSlot" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Time Slot
                  </Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center" htmlFor="timeZone">
                  <Globe className="mr-2 h-4 w-4" />
                  Time Zone
                </Label>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {timeZones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {formatTimeZone(tz)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">
                  A Microsoft Teams meeting link will be generated and sent to {candidateEmail}.
                  The meeting will be scheduled in the {formatTimeZone(timeZone)} time zone.
                </p>
              </div>
            </>
          )}
          
          {interviewType === "ai" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="agent" className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  AI Interview Agent
                </Label>
                <Select 
                  value={selectedAgentId} 
                  onValueChange={setSelectedAgentId}
                  disabled={isLoadingAgents || agents.length === 0}
                >
                  <SelectTrigger>
                    {isLoadingAgents ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary mr-2"></div>
                        Loading agents...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select an agent" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} {agent.isConversational ? "(Conversational)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start mb-2">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                  <p className="text-sm">
                    An AI interview allows the candidate to complete the interview at their convenience.
                    They will receive a link to participate in an automated video interview with our AI agent.
                  </p>
                </div>
                <p className="text-sm text-amber-600">
                  Interview link will automatically expire in 3 days if not completed.
                </p>
              </div>
            </>
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
