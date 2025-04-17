
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { supabase } from '@/integrations/supabase/client';
import { FormattedJobData } from '@/components/recruiter/jobs/types';

const CreateJob = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormattedJobData) => {
    try {
      // Ensure the data matches the expected database schema
      const { error } = await supabase.from('jobs').insert({
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
        closingdate: formData.closingDate, // Note: database column is lowercase
        posteddate: formData.postedDate,  // Note: database column is lowercase
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job has been created successfully.',
      });

      navigate('/recruiter/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Job"
        description="Post a new job listing"
        icon={<Briefcase className="h-6 w-6" />}
      />

      <div className="bg-white border rounded-lg p-6">
        <JobForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateJob;
