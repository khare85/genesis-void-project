
import React from 'react';
import { Card } from "@/components/ui/card";
import { CalendarClock, Clock, Calendar, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UpcomingInterviewsProps {
  isDemoUser: boolean;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ isDemoUser }) => {
  // Demo data
  const demoInterviews = [
    {
      id: 1,
      jobTitle: "Senior React Developer",
      company: "TechCorp Inc.",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Video Interview"
    },
    {
      id: 2,
      jobTitle: "Full Stack Engineer",
      company: "InnoTech Systems",
      date: "Friday",
      time: "2:30 PM",
      type: "Technical Assessment"
    }
  ];

  // For real users, this would fetch from API
  const interviews = isDemoUser ? demoInterviews : [];

  return (
    <Card className="col-span-1">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Upcoming Interviews</h3>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </div>

        {interviews.length === 0 && !isDemoUser ? (
          <div className="text-center py-8">
            <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No upcoming interviews</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link to="/candidate/jobs">Find Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="p-3 rounded-md border border-border">
                <h4 className="font-medium">{interview.jobTitle}</h4>
                <p className="text-sm text-muted-foreground">{interview.company}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{interview.date}</span>
                  <Clock className="h-3.5 w-3.5 mx-1 ml-3" />
                  <span>{interview.time}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2">Prepare</Button>
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2 ml-2">Join</Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-between" asChild>
                <Link to="/candidate/interviews">
                  <span>View All Interviews</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="link" size="sm" className="w-full mt-2 text-primary" asChild>
                <Link to="/candidate/interviews">Access Interview Prep Resources</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UpcomingInterviews;
