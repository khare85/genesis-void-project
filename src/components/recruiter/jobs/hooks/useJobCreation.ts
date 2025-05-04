
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobFormValues, FormattedJobData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useJobCreation = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        status: formData.status || 'draft',
        closingdate: formData.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        posteddate: formData.postedDate || new Date().toISOString().split('T')[0],
        skills: formData.skills || null,
      };

      const { data, error } = await supabase.from('jobs').insert(jobData).select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Job created successfully:', data);
      
      toast({
        title: 'Success',
        description: jobData.status === 'active' 
          ? 'Job has been published successfully.' 
          : 'Job has been saved as a draft.',
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
