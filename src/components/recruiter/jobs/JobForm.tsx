
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useJobForm } from './useJobForm';
import { FormattedJobData, JobFormValues } from './types';
import { JobFormHeader } from './JobFormHeader';
import { JobFormLocation } from './JobFormLocation';
import { JobFormDetails } from './JobFormDetails';
import { FormFields } from './FormFields/SalaryAndDescription';

interface JobFormProps {
  id?: string;
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: FormattedJobData) => void;
  onGenerateDetails: () => void;
  isGenerating: boolean;
  isEditing?: boolean;
  generatedData?: any;
}

const JobForm: React.FC<JobFormProps> = ({ 
  id = 'job-form',
  initialData, 
  onSubmit, 
  onGenerateDetails,
  isGenerating, 
  isEditing = false,
  generatedData
}) => {
  const form = useJobForm(initialData);
  
  // Update form when generated data comes in
  React.useEffect(() => {
    if (generatedData) {
      console.log('Setting generated data to form:', generatedData);
      if (generatedData.description) form.setValue('description', generatedData.description);
      if (generatedData.responsibilities) form.setValue('responsibilities', generatedData.responsibilities);
      if (generatedData.requirements) form.setValue('requirements', generatedData.requirements);
      if (generatedData.skills) form.setValue('skills', generatedData.skills);
    }
  }, [generatedData, form]);

  const handleSubmit = (values: JobFormValues) => {
    // Make sure the values object has all required properties
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
      skills: values.skills,
    };

    console.log('Submitting job data:', formattedValues);
    onSubmit(formattedValues);
  };

  // Function to set status and submit form
  const handlePublishJob = () => {
    console.log('Publishing job...');
    // Set the status to active
    form.setValue('status', 'active');
    // Submit the form directly with the updated values
    const values = form.getValues();
    values.status = 'active'; // Ensure status is set
    handleSubmit(values);
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft...');
    // Set the status to draft
    form.setValue('status', 'draft');
    // Submit the form directly with the updated values
    const values = form.getValues();
    values.status = 'draft'; // Ensure status is set
    handleSubmit(values);
  };

  return (
    <Form {...form}>
      <form id={id} className="space-y-6">
        <JobFormHeader form={form} />
        <JobFormLocation form={form} />
        <FormFields form={form} />
        <JobFormDetails 
          form={form} 
          onGenerateDetails={onGenerateDetails}
          isGenerating={isGenerating}
        />
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>
          <Button 
            type="button"
            onClick={handlePublishJob}
          >
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
