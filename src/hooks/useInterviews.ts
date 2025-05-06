
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Interview, InterviewData, InterviewMetadata } from "@/types/interviews";
import { User } from "@/lib/auth/types";
import { format } from "date-fns";
import { Video, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import React from 'react';

export const useInterviews = (user: User | null) => {
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviews = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      console.log("Fetching interviews for user:", user.id);

      // Get all interviews for this candidate - Using two separate queries and combining results
      const metadataQuery = supabase.from('interviews').select(`
          *,
          applications (
            jobs (
              title,
              company
            ),
            candidate_id
          )
        `).filter('metadata->candidateId', 'eq', user.id);
      
      const applicationQuery = supabase.from('interviews').select(`
          *,
          applications (
            jobs (
              title,
              company
            ),
            candidate_id
          )
        `).filter('applications.candidate_id', 'eq', user.id);

      // Execute both queries
      const [metadataResult, applicationResult] = await Promise.all([metadataQuery, applicationQuery]);

      // Handle errors
      if (metadataResult.error) console.error("Metadata query error:", metadataResult.error);
      if (applicationResult.error) console.error("Application query error:", applicationResult.error);
      if (metadataResult.error && applicationResult.error) {
        throw new Error("Failed to fetch interviews from both queries");
      }

      // Combine results (remove duplicates by id)
      const allInterviewsMap = new Map();

      // Add interviews from metadata query
      if (metadataResult.data) {
        metadataResult.data.forEach(interview => {
          const metadata = interview.metadata as InterviewMetadata || {};
          // Only add if it belongs to this user
          if ((metadata && metadata.candidateId === user.id) || 
             (interview.applications?.candidate_id === user.id)) {
            allInterviewsMap.set(interview.id, interview);
          }
        });
      }

      // Add interviews from application query
      if (applicationResult.data) {
        applicationResult.data.forEach(interview => {
          // Only add if it belongs to this user
          if (interview.applications?.candidate_id === user.id) {
            allInterviewsMap.set(interview.id, interview);
          }
        });
      }
      
      const interviewsData = Array.from(allInterviewsMap.values());
      console.log("Fetched interviews:", interviewsData);
      
      const upcoming: Interview[] = [];
      const past: Interview[] = [];

      // Process interviews data
      interviewsData?.forEach((interview: InterviewData) => {
        // Ensure metadata is always an object and cast it to our type
        const metadata = interview.metadata as InterviewMetadata || {};
        const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
        const now = new Date();
        const formattedDate = scheduledDate ? format(scheduledDate, 'MMMM d, yyyy') : 'Flexible';
        const formattedTime = scheduledDate ? format(scheduledDate, 'h:mm a') : 'Any time';
        const jobTitle = interview.applications?.jobs?.title || 'Unknown Position';
        const company = interview.applications?.jobs?.company || 'Unknown Company';

        // Determine status badge style
        let statusBadge: "default" | "outline" | "secondary" | "destructive" = "default";
        if (interview.status === 'cancelled') {
          statusBadge = 'destructive';
        } else if (interview.status === 'completed') {
          statusBadge = 'secondary';
        } else if (interview.status === 'reschedule_requested') {
          statusBadge = 'outline';
        }

        // Format status for display
        const displayStatus = interview.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Create interview object
        const interviewObj: Interview = {
          id: interview.id,
          jobTitle,
          company,
          type: interview.type === 'ai' ? 'AI Video Interview' : 'Face-to-Face Interview',
          date: formattedDate,
          time: formattedTime,
          status: displayStatus,
          statusBadge,
          icon: interview.type === 'ai' ? <Video className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />,
          duration: `${interview.duration || 30} min`,
          notes: metadata.notes,
          agentId: metadata.agentId,
          agentName: metadata.selectedAgent
        };

        // Determine if interview is upcoming or past
        if (scheduledDate && scheduledDate < now && interview.status !== 'scheduled') {
          // Past interview
          past.push(interviewObj);
        } else {
          // Upcoming interview
          upcoming.push(interviewObj);
        }
      });
      
      setUpcomingInterviews(upcoming);
      setPastInterviews(past);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load your interviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchInterviews();
    }
  }, [user?.id]);

  return {
    upcomingInterviews,
    pastInterviews,
    isLoading,
    refreshInterviews: fetchInterviews
  };
};
