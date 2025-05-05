
import React, { useState, useEffect } from 'react';
import { BasicFields } from './FormFields/BasicFields';
import { FormFields } from './FormFields/SalaryAndDescription';
import { MiscFields } from './FormFields/MiscFields';
import { JobFormLocation } from './JobFormLocation';
import { TextArrayFields } from './FormFields/TextArrayFields';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobFormSchema, JobFormValues } from './types';
import { useNavigate } from 'react-router-dom';
import { useJobCreation } from './hooks/useJobCreation';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { GenerateDetailsButton } from './components/GenerateDetailsButton';

interface GenerateJobDetailsProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  setMissingFields: (fields: string[]) => void;
  setShowMissingFieldsAlert: (show: boolean) => void;
  setGeneratedData: (data: any) => void;
  generatedData: any;
}

interface JobFormProps {
  initialData?: JobFormValues;
  isEditing?: boolean;
  onUpdate?: (data: JobFormValues) => Promise<void>;
  generateJobDetails?: GenerateJobDetailsProps;
}

const JobForm: React.FC<JobFormProps> = ({
  initialData,
  isEditing = false,
  onUpdate,
  generateJobDetails
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit: handleJobCreation
  } = useJobCreation();
  
  const formMethods = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      company: '',
      location: '',
      type: 'Full-time',
      level: '',
      department: '',
      salary_range: '',
      category: '',
      responsibilities: [],
      requirements: [],
      benefits: [],
      featured: false,
      status: 'draft',
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      skills: ''
    }
  });

  // Effect to apply generated data to form when it's available
  useEffect(() => {
    if (generateJobDetails && generateJobDetails.generatedData) {
      const data = generateJobDetails.generatedData;
      console.log('Applying generated data to form:', data);
      
      // Fill in the generated fields
      if (data.description) {
        formMethods.setValue('description', data.description);
      }
      
      if (data.requirements && Array.isArray(data.requirements)) {
        formMethods.setValue('requirements', 
          data.requirements.map((req: string) => req.startsWith('• ') ? req.substring(2) : req)
        );
      }
      
      if (data.responsibilities && Array.isArray(data.responsibilities)) {
        formMethods.setValue('responsibilities', 
          data.responsibilities.map((resp: string) => resp.startsWith('• ') ? resp.substring(2) : resp)
        );
      }
      
      if (data.benefits && Array.isArray(data.benefits)) {
        formMethods.setValue('benefits', 
          data.benefits.map((benefit: string) => benefit.startsWith('• ') ? benefit.substring(2) : benefit)
        );
      }
      
      if (data.skills) {
        formMethods.setValue('skills', data.skills);
      }
    }
  }, [generateJobDetails?.generatedData, formMethods]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsLoading(true);
      if (isEditing && onUpdate) {
        await onUpdate(data);
        toast({
          title: 'Job Updated',
          description: 'Job listing has been updated successfully'
        });
      } else {
        await handleJobCreation(data);
        toast({
          title: 'Job Created',
          description: 'Job listing has been created successfully'
        });
        navigate('/recruiter/jobs');
      }
    } catch (error) {
      console.error('Error submitting job form:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the job listing',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/recruiter/jobs');
  };

  return (
    <Form {...formMethods}>
      <form id="job-form" onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-6">
          <div className="p-6 rounded-2xl bg-white">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <BasicFields form={formMethods} />
          </div>
        </Card>

        <Card>
          <div className="p-6 rounded-2xl bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Description & Requirements</h3>
              {generateJobDetails ? (
                <GenerateDetailsButton 
                  isGenerating={generateJobDetails.isGenerating}
                  setIsGenerating={generateJobDetails.setIsGenerating}
                  setMissingFields={generateJobDetails.setMissingFields}
                  setShowMissingFieldsAlert={generateJobDetails.setShowMissingFieldsAlert}
                  setGeneratedData={generateJobDetails.setGeneratedData}
                />
              ) : null}
            </div>
            <FormFields form={formMethods} />
            <FormProvider {...formMethods}>
              <TextArrayFields fieldName="requirements" label="Requirements" placeholder="Add a requirement" />
              <TextArrayFields fieldName="responsibilities" label="Responsibilities" placeholder="Add a responsibility" />
              <TextArrayFields fieldName="benefits" label="Benefits" placeholder="Add a benefit" />
            </FormProvider>
          </div>
        </Card>

        <Card>
          <div className="p-6 rounded-2xl bg-white">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <JobFormLocation form={formMethods} />
          </div>
        </Card>

        <Card>
          <div className="p-6 rounded-2xl bg-white">
            <h3 className="text-lg font-medium mb-4">Additional Details</h3>
            <MiscFields form={formMethods} />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
