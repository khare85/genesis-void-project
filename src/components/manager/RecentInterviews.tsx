
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, UserCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface Interview {
  id: string;
  candidate: string;
  position: string;
  date: string;
}

export const RecentInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // In a real application, this would fetch from actual interviews table
        // For now we'll simulate fetching interviews based on applications
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            candidate_id,
            jobs(title)
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        // Transform the data into interviews format
        const formattedInterviews = (data || []).map(item => ({
          id: item.id,
          candidate: `Candidate ${item.id.substring(0, 3)}`,
          position: item.jobs?.title || 'Unknown Position',
          date: new Date(item.created_at).toLocaleDateString()
        }));
        
        setInterviews(formattedInterviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, [user?.id]);

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Recent Interviews</h3>
          <Video className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            // Loading state
            [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted rounded-full animate-pulse"></div>
                  <div className="h-3 w-24 bg-muted rounded-full animate-pulse mt-1"></div>
                </div>
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
              </div>
            ))
          ) : interviews.length > 0 ? (
            // Show actual interviews
            interviews.map((interview) => (
              <div key={interview.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{interview.candidate}</div>
                  <div className="text-xs text-muted-foreground">{interview.position}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                  <Link to="/manager/interviews">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            // No interviews state
            <div className="text-center py-4 text-muted-foreground">
              No recent interviews
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <Link to="/manager/interviews">View All Interviews</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
