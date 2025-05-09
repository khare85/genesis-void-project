
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export const PendingApprovals = () => {
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchPendingApprovals();
  }, [user?.id]);
  
  const fetchPendingApprovals = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch jobs in draft mode that need recruiter approval
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'pending_approval');
      
      if (jobsError) throw jobsError;
      
      setPendingJobs(jobsData || []);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveJob = async (jobId: string) => {
    try {
      // Update job status to active (published)
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'active' })
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: "Job approved",
        description: "Job has been published to the career portal.",
      });
      
      // Refresh the list of pending approvals
      fetchPendingApprovals();
    } catch (error) {
      console.error("Error approving job:", error);
      toast({
        title: "Error",
        description: "Failed to approve job. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Pending Approvals</h3>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading pending approvals...</div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No pending approvals at this time.</div>
          ) : (
            pendingJobs.map((job) => (
              <div 
                key={job.id} 
                className="p-3 rounded-md border border-muted hover:border-primary hover:bg-muted/30 transition-colors"
              >
                <div className="text-sm font-medium">Job Description: {job.title}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Waiting for your review
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7"
                    onClick={() => window.location.href = `/recruiter/jobs/${job.id}/edit`}
                  >
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => handleApproveJob(job.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))
          )}
          
          {/* Example candidate shortlist item */}
          <div className="p-3 rounded-md border border-muted hover:border-primary hover:bg-muted/30 transition-colors">
            <div className="text-sm font-medium">Candidate Shortlist: Product Manager</div>
            <div className="text-xs text-muted-foreground mb-2">5 candidates awaiting review</div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
              <Button size="sm" className="text-xs h-7">Review</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
