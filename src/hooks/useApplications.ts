
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  date: string;
  statusColor: string;
  notes?: string;
}

export const useApplications = () => {
  const { user } = useAuth();
  
  const fetchApplications = async () => {
    if (!user) throw new Error('User not authenticated');

    // Get applications for the current user
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        job_id,
        notes,
        jobs(title, company, location)
      `)
      .eq('candidate_id', user.id);

    if (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications');
    }

    // Format applications data for display
    return applications.map((app) => {
      // Determine status color based on application status
      let statusColor = 'bg-gray-500'; // default
      if (app.status === 'interview_scheduled') statusColor = 'bg-blue-500';
      else if (app.status === 'under_review') statusColor = 'bg-amber-500';
      else if (app.status === 'technical_assessment') statusColor = 'bg-purple-500';
      else if (app.status === 'offer_accepted') statusColor = 'bg-green-500';
      else if (app.status === 'rejected') statusColor = 'bg-red-500';
      else if (app.status === 'withdrawn') statusColor = 'bg-gray-500';

      // Format date as relative time
      const createdAt = new Date(app.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateString;
      if (diffDays === 0) dateString = 'Today';
      else if (diffDays === 1) dateString = 'Yesterday';
      else if (diffDays <= 7) dateString = `${diffDays} days ago`;
      else if (diffDays <= 30) dateString = `${Math.floor(diffDays / 7)} weeks ago`;
      else dateString = `${Math.floor(diffDays / 30)} months ago`;

      return {
        id: app.id,
        jobTitle: app.jobs?.title || 'Unknown Position',
        company: app.jobs?.company || 'Unknown Company',
        status: app.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format status
        date: dateString,
        statusColor,
        notes: app.notes
      };
    });
  };

  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: fetchApplications,
    enabled: !!user,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Error in useApplications:', error);
          toast.error('Failed to load your applications');
        }
      }
    }
  });
};
