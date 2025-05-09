
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobFormValues, FormattedJobData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

export const useJobCreation = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (formData: JobFormValues) => {
    try {
      setIsLoading(true);
      console.log('Submitting job data to database:', formData);
      
      // Ensure all fields have valid values
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary_range: formData.salary_range || null,
        description: formData.description || null,
        department: formData.department || null,
        category: formData.category || null,
        level: formData.level || null,
        responsibilities: formData.responsibilities || [],
        requirements: formData.requirements || [],
        benefits: formData.benefits || [],
        featured: formData.featured || false,
        status: user?.role === 'hiring_manager' && formData.status === 'active' 
          ? 'pending_approval' // Hiring managers need approval to publish jobs
          : formData.status || 'draft',
        closingdate: formData.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        posteddate: formData.postedDate || new Date().toISOString().split('T')[0],
        skills: formData.skills || null,
        posted_by: user?.id || null, // Store the ID of the user who created the job
      };

      const { data, error } = await supabase.from('jobs').insert(jobData).select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Job created successfully:', data);
      
      let toastMessage = '';
      if (user?.role === 'hiring_manager' && jobData.status === 'pending_approval') {
        toastMessage = 'Job has been sent to recruiters for approval.';
      } else if (jobData.status === 'active') {
        toastMessage = 'Job has been published successfully.';
      } else {
        toastMessage = 'Job has been saved as a draft.';
      }
      
      toast({
        title: 'Success',
        description: toastMessage,
      });

      const path = window.location.pathname.includes('/manager') 
        ? '/manager/jobs' 
        : '/recruiter/jobs';
        
      navigate(path);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: `Failed to ${formData.status === 'active' ? 'publish' : 'save'} job. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isGenerating,
    setIsGenerating,
    missingFields,
    setMissingFields,
    showMissingFieldsAlert,
    setShowMissingFieldsAlert,
    generatedData,
    setGeneratedData,
    isLoading,
    handleSubmit,
  };
};
