
import React from "react";
import { Interview } from "@/types/interviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Hourglass } from "lucide-react";
import { InterviewActions } from "./InterviewActions";

interface UpcomingInterviewsListProps {
  interviews: Interview[];
  isLoading: boolean;
  onJoinInterview: (interview: Interview) => void;
  onStatusChange: () => void;
}

const UpcomingInterviewsList: React.FC<UpcomingInterviewsListProps> = ({
  interviews,
  isLoading,
  onJoinInterview,
  onStatusChange,
}) => {
  // Check if an interview is actionable (can be joined)
  const isInterviewActionable = (status: string) => {
    return status === 'Scheduled' || status === 'Reschedule Requested';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No Upcoming Interviews</h3>
        <p className="text-muted-foreground">
          You don't have any interviews scheduled yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map(interview => (
        <div key={interview.id} className="p-4 rounded-md border-l-4 border-primary bg-white hover:bg-gray-50 transition-colors">
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
            <div className="flex items-center gap-2">
              {isInterviewActionable(interview.status) && (
                <Button size="sm" className="ml-4" onClick={() => onJoinInterview(interview)}>
                  {interview.type.includes('AI') ? 'Join AI Interview' : 'Join Interview'}
                </Button>
              )}
            </div>
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
              {interview.duration && (
                <div className="flex items-center">
                  <Hourglass className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>{interview.duration}</span>
                </div>
              )}
            </div>
            
            {isInterviewActionable(interview.status) && (
              <InterviewActions 
                interviewId={interview.id} 
                onStatusChange={onStatusChange} 
              />
            )}
          </div>
          
          {interview.agentName && (
            <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
              <p>AI Interviewer: {interview.agentName}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingInterviewsList;
