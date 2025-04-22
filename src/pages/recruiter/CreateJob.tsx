
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Wand } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { supabase } from '@/integrations/supabase/client';
import { FormattedJobData } from '@/components/recruiter/jobs/types';
import { Button } from '@/components/ui/button';

const CreateJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSubmit = async (formData: FormattedJobData) => {
    try {
      console.log('Submitting job data to database:', formData);
      
      // Ensure the data matches the expected database schema
      // Map the formData keys to match the database column names
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
        closingdate: formData.closingDate, // lowercase to match database column
        posteddate: formData.postedDate,  // lowercase to match database column
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

      // Determine correct path to redirect based on user role
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

  const handleGenerateDetails = () => {
    // This function will be passed down to the JobForm component
    setIsGenerating(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Job"
        description="Post a new job listing"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <Button
            onClick={handleGenerateDetails}
            disabled={isGenerating}
            className="gap-2"
          >
            <Wand className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Job Details"}
          </Button>
        }
      />

      <div className="bg-white border rounded-lg p-6">
        <JobForm 
          onSubmit={handleSubmit} 
          onGenerateDetails={handleGenerateDetails}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default CreateJob;
