
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { CalendarClock, Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  time: string;
  type: string;
}

interface UpcomingInterviewsProps {
  isDemoUser: boolean;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ isDemoUser }) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Demo data - only shown for demo users
  const demoInterviews = [
    {
      id: "1",
      jobTitle: "Senior React Developer",
      company: "TechCorp Inc.",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Video Interview"
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "InnoTech Systems",
      date: "Friday",
      time: "2:30 PM",
      type: "Technical Assessment"
    }
  ];

  useEffect(() => {
    // Only fetch real interviews if this is not a demo user and user is logged in
    if (!isDemoUser && user?.id) {
      fetchUpcomingInterviews();
    } else if (isDemoUser) {
      // Use demo data for demo users
      setInterviews(demoInterviews);
    }
  }, [isDemoUser, user?.id]);

  const fetchUpcomingInterviews = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Get interviews through the metadata field that contains candidateId
      const { data: metadataInterviews, error: metadataError } = await supabase
        .from('interviews')
        .select(`
          id,
          type,
          scheduled_at,
          duration,
          status,
          metadata,
          applications (
            jobs (
              title,
              company
            )
          )
        `)
        .filter('metadata->candidateId', 'eq', user.id)
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })
        .limit(3);
      
      // Get interviews through the applications table with candidate_id
      const { data: applicationInterviews, error: applicationError } = await supabase
        .from('interviews')
        .select(`
          id,
          type,
          scheduled_at,
          duration,
          status,
          metadata,
          applications (
            candidate_id,
            jobs (
              title,
              company
            )
          )
        `)
        .eq('applications.candidate_id', user.id)
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })
        .limit(3);

      if (metadataError) console.error("Error fetching interviews by metadata:", metadataError);
      if (applicationError) console.error("Error fetching interviews by application:", applicationError);

      // Process and combine interviews data
      const combinedInterviews = [...(metadataInterviews || []), ...(applicationInterviews || [])];
      
      // Remove duplicates (interviews might appear in both queries)
      const uniqueInterviews = Array.from(
        new Map(combinedInterviews.map(interview => [interview.id, interview])).values()
      );
      
      // Format the interviews for display
      const formattedInterviews = uniqueInterviews.map(interview => {
        const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
        return {
          id: interview.id,
          jobTitle: interview.applications?.jobs?.title || 'Interview',
          company: interview.applications?.jobs?.company || '',
          date: scheduledDate ? format(scheduledDate, 'MMMM d, yyyy') : 'Flexible',
          time: scheduledDate ? format(scheduledDate, 'h:mm a') : 'Any time',
          type: interview.type === 'ai' ? 'AI Interview' : 'Live Interview'
        };
      });

      setInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Upcoming Interviews</h3>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
          </div>
        ) : interviews.length === 0 ? (
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
              <div key={interview.id} className="p-3 rounded-md border border-border bg-white">
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
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2 ml-2" asChild>
                    <Link to="/candidate/interviews">Join</Link>
                  </Button>
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
