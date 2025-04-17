
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/JobForm';
import { supabase } from '@/integrations/supabase/client';

const CreateJob = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const { error } = await supabase.from('jobs').insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job has been created successfully.',
      });

      navigate('/recruiter/jobs');
    } catch (error) {
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
