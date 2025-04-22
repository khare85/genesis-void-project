
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedJobData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useJobCreation = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handleSubmit = async (formData: FormattedJobData) => {
    try {
      console.log('Submitting job data to database:', formData);
      
      const { data, error } = await supabase.from('jobs').insert({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary_range: formData.salary_range,
        description: formData.description,
        department: formData.department,
        category: formData.category,
        level: formData.level,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        benefits: formData.benefits,
        featured: formData.featured,
        status: formData.status,
        closingdate: formData.closingDate,
        posteddate: formData.postedDate,
        skills: formData.skills,
      }).select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Job created successfully:', data);
      
      toast({
        title: 'Success',
        description: 'Job has been created successfully.',
      });

      const path = window.location.pathname.includes('/manager') 
        ? '/manager/jobs' 
        : '/recruiter/jobs';
        
      navigate(path);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: `Failed to create job. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive',
      });
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
    handleSubmit,
  };
};
