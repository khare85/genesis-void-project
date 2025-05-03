
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InterviewActionsProps {
  interviewId: string;
  onStatusChange: () => void;
}

type CancelReason = 'not_interested' | 'schedule_conflict' | 'other';

interface CancelFormValues {
  reason: CancelReason;
  details: string;
}

export function InterviewActions({ interviewId, onStatusChange }: InterviewActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CancelFormValues>({
    defaultValues: {
      reason: 'schedule_conflict',
      details: '',
    },
  });

  const handleCancel = async (values: CancelFormValues) => {
    setIsSubmitting(true);
    try {
      // Update the interview status in the database
      const { error } = await supabase
        .from('interviews')
        .update({
          status: 'cancelled',
          metadata: {
            cancelReason: values.reason,
            cancelDetails: values.details,
            cancelledAt: new Date().toISOString(),
          }
        })
        .eq('id', interviewId);

      if (error) throw error;
      
      toast.success('Interview cancelled successfully');
      setShowCancelDialog(false);
      onStatusChange();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestReschedule = async () => {
    setIsSubmitting(true);
    try {
      // Update the interview status in the database
      const { error } = await supabase
        .from('interviews')
        .update({
          status: 'reschedule_requested',
          metadata: {
            rescheduleRequestedAt: new Date().toISOString(),
          }
        })
        .eq('id', interviewId);

      if (error) throw error;
      
      toast.success('Reschedule requested successfully');
      setShowRescheduleDialog(false);
      onStatusChange();
    } catch (error) {
      console.error('Error requesting reschedule:', error);
      toast.error('Failed to request reschedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1.5"
          onClick={() => setShowRescheduleDialog(true)}
        >
          <Calendar className="h-4 w-4" />
          Reschedule
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1.5 text-destructive hover:bg-destructive/10"
          onClick={() => setShowCancelDialog(true)}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Please let us know why you need to cancel this interview.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCancel)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Reason for cancellation</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="not_interested" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Not interested in this position anymore
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="schedule_conflict" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Schedule conflict
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other reason</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional details (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide any additional details..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isSubmitting}
                >
                  Close
                </Button>
                <Button 
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cancelling...' : 'Cancel Interview'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Reschedule</DialogTitle>
            <DialogDescription>
              This will notify the recruiter that you need to reschedule.
              They will contact you to arrange a new time.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              disabled={isSubmitting}
              onClick={handleRequestReschedule}
            >
              {isSubmitting ? 'Requesting...' : 'Request Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
