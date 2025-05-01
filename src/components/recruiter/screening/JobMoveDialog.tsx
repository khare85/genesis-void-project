
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScreeningCandidate } from '@/types/screening';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface JobMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: ScreeningCandidate | null;
}

interface JobOption {
  id: string;
  title: string;
  company: string;
}

export const JobMoveDialog = ({ open, onOpenChange, candidate }: JobMoveDialogProps) => {
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, company')
          .eq('status', 'active');
          
        if (error) throw error;
        
        // Filter out the current job if we know what it is
        const filteredJobs = candidate?.jobRole 
          ? data?.filter(job => job.title !== candidate.jobRole) || []
          : data || [];
          
        setJobs(filteredJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        toast({
          title: 'Error',
          description: 'Failed to load job options',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [open, candidate]);

  // Reset selected job when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedJob('');
    }
  }, [open]);

  const handleMoveCandidate = async () => {
    if (!candidate || !selectedJob) return;
    
    setIsMoving(true);
    try {
      // Create new application entry
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: selectedJob,
          candidate_id: candidate.candidate_id,
          status: 'pending',
          resume_url: '', // Would need the actual resume URL
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error inserting application:', error);
        throw error;
      }
      
      toast({
        title: 'Candidate Moved',
        description: `${candidate.name} has been moved to the selected job and will be screened again.`,
      });
      
      onOpenChange(false);
    } catch (err) {
      console.error('Error moving candidate:', err);
      toast({
        title: 'Error',
        description: 'Failed to move candidate to the selected job',
        variant: 'destructive'
      });
    } finally {
      setIsMoving(false);
    }
  };

  const handleInitiateMove = () => {
    if (selectedJob) {
      setConfirmDialogOpen(true);
    } else {
      toast({
        title: 'Selection Required',
        description: 'Please select a job to continue',
        variant: 'default'
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move Candidate to Another Job</DialogTitle>
            <DialogDescription>
              Select a job to move this candidate to. The candidate will be screened for this new position.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {candidate && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Candidate:</p>
                <p>{candidate.name}</p>
                <p className="text-sm text-muted-foreground">Current position: {candidate.jobRole}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Job:</p>
              <Select
                value={selectedJob}
                onValueChange={setSelectedJob}
                disabled={isLoading || isMoving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : jobs.length > 0 ? (
                    jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-muted-foreground">No jobs available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInitiateMove}
              disabled={!selectedJob || isMoving}
            >
              {isMoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Move Candidate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Move</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this candidate to the selected job? 
              The candidate will be added as an applicant for the new position.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMoveCandidate}>
              {isMoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm Move
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
