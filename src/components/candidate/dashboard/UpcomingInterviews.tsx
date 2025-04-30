
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Video } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";

interface UpcomingInterviewsProps {
  isDemoUser: boolean;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ isDemoUser }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Upcoming Interviews</h3>
          <Video className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {isDemoUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-md border-l-4 border-primary bg-primary/5">
              <div className="font-medium mb-1">AI Video Interview</div>
              <div className="text-sm text-muted-foreground">Senior React Developer @ TechCorp Inc.</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Tomorrow, 10:00 AM</span>
                </div>
                <Button size="sm">Join </Button>
              </div>
            </div>
            
            <div className="p-4 rounded-md border-l-4 border-blue-500 bg-blue-500/5">
              <div className="font-medium mb-1">Technical Assessment</div>
              <div className="text-sm text-muted-foreground">Full Stack Engineer @ InnoTech Systems</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Friday, 2:30 PM</span>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <Video className="h-12 w-12 mb-2 mx-auto" />
            <p className="text-sm font-medium mb-2">No upcoming interviews</p>
            <p className="text-xs">When you have interviews scheduled, they'll appear here</p>
          </div>
        )}
        
        {isDemoUser && (
          <div className="mt-4 pt-4 border-t">
            <AIGenerated>
              <div className="space-y-3">
                <p className="text-sm">Interview preparation tips:</p>
                <ul className="text-xs space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Research TechCorp's recent product launches</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Review React performance optimization techniques</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Prepare questions about their development workflow</span>
                  </li>
                </ul>
              </div>
            </AIGenerated>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UpcomingInterviews;
