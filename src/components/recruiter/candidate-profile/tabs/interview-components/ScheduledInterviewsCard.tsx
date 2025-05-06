
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video } from 'lucide-react';
import { format } from 'date-fns';

interface Interview {
  id: string;
  type: string;
  status: string;
  scheduled_at: string;
  duration: number;
  metadata?: any;
}

interface ScheduledInterviewsCardProps {
  interviews: Interview[];
  onStartInterview: (interview: Interview) => void;
}

export const ScheduledInterviewsCard: React.FC<ScheduledInterviewsCardProps> = ({ 
  interviews,
  onStartInterview
}) => {
  const scheduledInterviews = interviews.filter(i => i.status === 'scheduled' && i.type === 'ai');
  
  if (scheduledInterviews.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled AI Interviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scheduledInterviews.map(interview => {
          // Safely access metadata properties with fallbacks
          const agentName = interview.metadata?.selectedAgent || 'AI Interviewer';
          const scheduledDate = new Date(interview.scheduled_at);
          
          return (
            <div key={interview.id} className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  AI Interview with {agentName}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(scheduledDate, 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Available until {format(scheduledDate, 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
                  onClick={() => onStartInterview(interview)}
                >
                  Start Interview
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
