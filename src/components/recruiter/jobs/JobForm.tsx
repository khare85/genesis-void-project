
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useJobForm } from './useJobForm';
import { FormattedJobData, JobFormValues } from './types';
import { JobFormHeader } from './JobFormHeader';
import { JobFormLocation } from './JobFormLocation';
import { JobFormDetails } from './JobFormDetails';
import { Wand } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobFormProps {
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: FormattedJobData) => void;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const form = useJobForm(initialData);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSubmit = (values: JobFormValues) => {
    // Format the form values for database submission
    const formattedValues: FormattedJobData = {
      title: values.title,
      company: values.company,
      location: values.location,
      type: values.type,
      salary_range: values.salary_range,
      description: values.description,
      department: values.department,
      category: values.category,
      level: values.level,
      responsibilities: values.responsibilities,
      requirements: values.requirements,
      benefits: values.benefits,
      featured: values.featured,
      status: values.status || 'draft',
      closingDate: values.closingDate,
      postedDate: new Date().toISOString().split('T')[0],
    };

    console.log('Submitting job data:', formattedValues);
    onSubmit(formattedValues);
  };

  const generateJobDetails = async () => {
    const requiredFields = {
      title: form.watch('title'),
      company: form.watch('company'),
      location: form.watch('location'),
      type: form.watch('type'),
      department: form.watch('department'),
      level: form.watch('level'),
      salaryRange: form.watch('salary_range'),
    };

    // Check if all required fields are filled
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields first: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-job-details', {
        body: requiredFields,
      });

      if (error) throw error;

      form.setValue('description', data.description);
      form.setValue('responsibilities', data.responsibilities);
      form.setValue('requirements', data.requirements);

      toast({
        title: "Success",
        description: "Job details generated successfully!",
      });
    } catch (error) {
      console.error('Error generating job details:', error);
      toast({
        title: "Error",
        description: "Failed to generate job details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <JobFormHeader form={form} />
        <JobFormLocation form={form} />
        
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={generateJobDetails}
            disabled={isGenerating}
            className="gap-2"
          >
            <Wand className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Job Details"}
          </Button>
        </div>

        <JobFormDetails form={form} />
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              form.setValue('status', 'draft');
              form.handleSubmit(handleSubmit)();
            }}
          >
            Save as Draft
          </Button>
          <Button 
            type="button"
            onClick={() => {
              form.setValue('status', 'active');
              form.handleSubmit(handleSubmit)();
            }}
          >
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
