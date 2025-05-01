import React, { useState } from 'react';
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
import { format } from "date-fns";
import { Calendar as CalendarIcon, Video, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }
  
  const handleSchedule = async () => {
    if (!interviewDate) {
      toast.error("Please select an interview date");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date and time for storage
      const formattedDate = format(interviewDate, "yyyy-MM-dd");
      const interviewDateTime = `${formattedDate}T${timeSlot}:00`;
      
      // Create an interview record in the database
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          type: interviewType,
          scheduled_at: interviewDateTime,
          duration: parseInt(duration),
          status: 'scheduled'
        });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
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
          .eq('id', data[0].id);
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
          
          <div className="space-y-2">
            <Label>Interview Date</Label>
            <div className="border rounded-md p-2">
              <Calendar
                mode="single"
                selected={interviewDate}
                onSelect={setInterviewDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
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
          
          {interviewType === "ai" && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                An AI interview allows the candidate to complete the interview at their convenience. 
                They will receive a link to participate in an automated video interview.
              </p>
            </div>
          )}
          
          {interviewType === "face-to-face" && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                A Microsoft Teams meeting link will be generated and sent to {candidateEmail}.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSchedule} 
            disabled={isSubmitting || !interviewDate}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
