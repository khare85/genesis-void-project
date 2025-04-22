
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Wand } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { supabase } from '@/integrations/supabase/client';
import { FormattedJobData } from '@/components/recruiter/jobs/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = React.useState(false);

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

  const checkRequiredFields = (formCallback: () => void) => {
    // This function will get the required field values from the form component
    // and validate them before calling the provided callback
    const jobForm = document.getElementById('job-form') as HTMLFormElement;
    
    if (!jobForm) {
      formCallback();
      return;
    }
    
    const title = jobForm.querySelector('[name="title"]') as HTMLInputElement;
    const company = jobForm.querySelector('[name="company"]') as HTMLInputElement;
    const department = jobForm.querySelector('[name="department"]') as HTMLInputElement;
    const type = jobForm.querySelector('[name="type"]') as HTMLInputElement;
    const level = jobForm.querySelector('[name="level"]') as HTMLInputElement;
    
    const missing: string[] = [];
    
    if (!title?.value) missing.push('Job Title');
    if (!company?.value) missing.push('Company');
    if (!department?.value) missing.push('Department');
    if (!type?.value) missing.push('Job Type');
    if (!level?.value) missing.push('Experience Level');
    
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingFieldsAlert(true);
      
      // Also show a toast for immediate feedback
      toast({
        title: "Missing Information",
        description: `Please fill in these basic details first: ${missing.join(', ')}`,
        variant: "destructive",
      });
      
      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setShowMissingFieldsAlert(false);
      }, 5000);
      
      return;
    }
    
    // If we have all required fields, call the callback
    formCallback();
  };

  const handleGenerateDetails = () => {
    checkRequiredFields(() => {
      setIsGenerating(true);
      
      // This will be called only if all required fields are filled
      const jobForm = document.getElementById('job-form') as HTMLFormElement;
      if (jobForm) {
        const formData = new FormData(jobForm);
        const requiredFields = {
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          department: formData.get('department') as string,
          type: formData.get('type') as string,
          level: formData.get('level') as string,
        };
        
        generateJobDetails(requiredFields);
      }
    });
  };
  
  const generateJobDetails = async (fields: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-job-details', {
        body: fields,
      });

      if (error) throw error;
      
      // This will update the form fields via the JobForm component
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "Job details generated successfully!",
      });
    } catch (error) {
      console.error('Error generating job details:', error);
      setIsGenerating(false);
      
      toast({
        title: "Error",
        description: "Failed to generate job details. Please try again.",
        variant: "destructive",
      });
    }
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
      
      {showMissingFieldsAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Please fill in the following required fields before generating job details:
            <ul className="list-disc pl-5 mt-2">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white border rounded-lg p-6">
        <JobForm 
          id="job-form"
          onSubmit={handleSubmit} 
          onGenerateDetails={handleGenerateDetails}
          isGenerating={isGenerating}
          generatedData={null}
        />
      </div>
    </div>
  );
};

export default CreateJob;
