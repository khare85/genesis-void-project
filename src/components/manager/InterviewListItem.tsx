import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";

interface InterviewProps {
  id: number;
  candidate: string;
  position: string;
  date: string;
  time?: string;
  interviewer?: string;
  type?: string;
  status: string;
  feedback?: string;
  score?: number;
}

// Helper for formatting dates
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

// Helper for interview status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
    case "passed":
      return <Badge className="bg-green-500 hover:bg-green-600">Passed</Badge>;
    case "failed":
      return <Badge variant="destructive">Not Selected</Badge>;
    case "consideration":
      return <Badge variant="outline" className="border-blue-500 text-blue-600">In Consideration</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const InterviewListItem: React.FC<InterviewProps> = ({
  id,
  candidate,
  position,
  date,
  time,
  interviewer,
  type,
  status,
  feedback,
  score,
}) => {
  // For upcoming interviews
  if (time && interviewer && type) {
    return (
      <div className="p-4 hover:bg-muted/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-primary hover:underline">
              {candidate}
            </h3>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{time}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Badge variant="outline" className="font-normal">
                {type}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                with {interviewer}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(status)}
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Join</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For recent interviews
  return (
    <div className="p-4 hover:bg-muted/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium text-primary hover:underline">
            {candidate}
          </h3>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
        <div>
          <div className="text-sm mb-1">
            <span className="text-muted-foreground">Interview date: </span>
            {formatDate(date)}
          </div>
          {feedback && <p className="text-sm line-clamp-1">{feedback}</p>}
        </div>
        <div className="flex justify-between items-center">
          {score && (
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">
                Score: {score}/5
              </div>
            </div>
          )}
          <div>
            {getStatusBadge(status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewListItem;
