
import React from "react";
import { Interview } from "@/types/interviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";

interface PastInterviewsListProps {
  interviews: Interview[];
  isLoading: boolean;
}

const PastInterviewsList: React.FC<PastInterviewsListProps> = ({
  interviews,
  isLoading,
}) => {
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
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No Past Interviews</h3>
        <p className="text-muted-foreground">
          You haven't completed any interviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map(interview => (
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
  );
};

export default PastInterviewsList;
