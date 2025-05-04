
import React, { useState, useEffect } from 'react';
import { BasicFields } from './FormFields/BasicFields';
import { SalaryAndDescription } from './FormFields/SalaryAndDescription';
import { MiscFields } from './FormFields/MiscFields';
import { JobFormLocation } from './JobFormLocation';
import { TextArrayFields } from './FormFields/TextArrayFields';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobFormSchema } from './types';
import { useNavigate } from 'react-router-dom';
import { useJobCreation } from './hooks/useJobCreation';
import { Wand } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { GenerateDetailsButton } from './components/GenerateDetailsButton';

interface JobFormProps {
  initialData?: any;
  isEditing?: boolean;
  onUpdate?: (data: any) => Promise<void>;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, isEditing = false, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  const navigate = useNavigate();
  const { createJob, isLoading } = useJobCreation();

  const formMethods = useForm({
    resolver: zodResolver(JobFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      company: '',
      location: '',
      remote: false,
      type: 'Full-time',
      level: 'Mid-Level',
      department: '',
      min_salary: '',
      max_salary: '',
      currency: 'USD',
      requirements: [],
      responsibilities: [],
      benefits: [],
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (generatedData) {
      // Fill in the generated fields
      if (generatedData.description) {
        formMethods.setValue('description', generatedData.description);
      }
      
      if (generatedData.requirements && Array.isArray(generatedData.requirements)) {
        formMethods.setValue('requirements', generatedData.requirements);
      }
      
      if (generatedData.responsibilities && Array.isArray(generatedData.responsibilities)) {
        formMethods.setValue('responsibilities', generatedData.responsibilities);
      }
      
      if (generatedData.benefits && Array.isArray(generatedData.benefits)) {
        formMethods.setValue('benefits', generatedData.benefits);
      }
    }
  }, [generatedData, formMethods]);

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && onUpdate) {
        await onUpdate(data);
        toast({
          title: 'Job Updated',
          description: 'Job listing has been updated successfully',
        });
      } else {
        await createJob(data);
        toast({
          title: 'Job Created',
          description: 'Job listing has been created successfully',
        });
        navigate('/recruiter/jobs');
      }
    } catch (error) {
      console.error('Error submitting job form:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the job listing',
        variant: 'destructive',
      });
    }
  };

  const onCancel = () => {
    navigate('/recruiter/jobs');
  };

  return (
    <Form {...formMethods}>
      <form id="job-form" onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
        {showMissingFieldsAlert && (
          <div className="p-4 mb-4 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            <p>Please fill in these fields first: {missingFields.join(', ')}</p>
          </div>
        )}
        
        <Card className="space-y-6">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <BasicFields control={formMethods.control} />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Description & Requirements</h3>
              <GenerateDetailsButton
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                setMissingFields={setMissingFields}
                setShowMissingFieldsAlert={setShowMissingFieldsAlert}
                setGeneratedData={setGeneratedData}
              />
            </div>
            <SalaryAndDescription control={formMethods.control} />
            <TextArrayFields
              control={formMethods.control}
              fieldName="requirements"
              label="Requirements"
              placeholder="Add a requirement"
            />
            <TextArrayFields
              control={formMethods.control}
              fieldName="responsibilities"
              label="Responsibilities"
              placeholder="Add a responsibility"
            />
            <TextArrayFields
              control={formMethods.control}
              fieldName="benefits"
              label="Benefits"
              placeholder="Add a benefit"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <JobFormLocation control={formMethods.control} />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Additional Details</h3>
            <MiscFields control={formMethods.control} />
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
