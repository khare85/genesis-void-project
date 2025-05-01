
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
import { TimeZoneSelector } from './TimeZoneSelector';

interface FaceToFaceInterviewFormProps {
  interviewDate: Date | undefined;
  setInterviewDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
  candidateEmail: string;
}

export const FaceToFaceInterviewForm: React.FC<FaceToFaceInterviewFormProps> = ({
  interviewDate,
  setInterviewDate,
  timeSlot,
  setTimeSlot,
  duration,
  setDuration,
  timeZone,
  setTimeZone,
  candidateEmail
}) => {
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

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

  return (
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
      
      <TimeZoneSelector value={timeZone} onChange={setTimeZone} />
      
      <div className="rounded-md bg-muted p-4">
        <p className="text-sm">
          A Microsoft Teams meeting link will be generated and sent to {candidateEmail}.
          The meeting will be scheduled in the {formatTimeZone(timeZone)} time zone.
        </p>
      </div>
    </>
  );
};
