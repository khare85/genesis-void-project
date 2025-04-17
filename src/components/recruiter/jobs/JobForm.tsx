
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { JobFormHeader } from './JobFormHeader';
import { JobFormLocation } from './JobFormLocation';
import { JobFormDetails } from './JobFormDetails';
import { useJobForm } from './useJobForm';
import { FormattedJobData, JobFormValues } from './types';

interface JobFormProps {
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: FormattedJobData) => void;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const form = useJobForm(initialData);

  const handleSubmit = async (values: JobFormValues) => {
    // Convert string arrays to proper array format
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
      responsibilities: values.responsibilities.split('\n').filter(Boolean),
      requirements: values.requirements.split('\n').filter(Boolean),
      benefits: values.benefits.split('\n').filter(Boolean),
      featured: values.featured,
      status: values.status,
      closingDate: values.closingDate,
      postedDate: new Date().toISOString().split('T')[0],
    };

    onSubmit(formattedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <JobFormHeader form={form} />
        <JobFormLocation form={form} />
        <JobFormDetails form={form} />
        
        <div className="flex justify-end gap-4">
          <Button type="submit" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
