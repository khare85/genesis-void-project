
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Calendar, Clock } from "lucide-react";
import { Interview } from "@/types/interviews";
import { toast } from "sonner";

interface InterviewScheduleProps {
  upcomingInterviews: Interview[];
}

const InterviewSchedule: React.FC<InterviewScheduleProps> = ({ upcomingInterviews }) => {
  const [calendarSynced, setCalendarSynced] = useState(false);
  
  const handleSyncCalendar = () => {
    // In a real app, this would integrate with the user's calendar service
    toast.success("Calendar synced successfully!");
    setCalendarSynced(true);
  };

  return (
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
                <Button size="sm" variant={calendarSynced ? "outline" : "default"} onClick={handleSyncCalendar} className="gap-1.5">
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
  );
};

export default InterviewSchedule;
