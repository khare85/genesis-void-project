
import React from 'react';
import { Briefcase } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerateDetailsButton } from '@/components/recruiter/jobs/components/GenerateDetailsButton';
import { useJobCreation } from '@/components/recruiter/jobs/hooks/useJobCreation';

const CreateJob = () => {
  const {
    isGenerating,
    setIsGenerating,
    missingFields,
    setMissingFields,
    showMissingFieldsAlert,
    setShowMissingFieldsAlert,
    generatedData,
    setGeneratedData
  } = useJobCreation();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Create New Job" 
        description="Post a new job listing" 
        icon={<Briefcase className="h-6 w-6" />} 
      />
      
      {showMissingFieldsAlert && (
        <Alert variant="destructive" className="mb-6">
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

      <div className="rounded-2xl bg-blue-50/80 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] border border-blue-100/80 transform hover:shadow-[0_20px_35px_-5px_rgba(59,130,246,0.2)] transition-all duration-300">
        <JobForm 
          generateJobDetails={{
            isGenerating,
            setIsGenerating,
            setMissingFields,
            setShowMissingFieldsAlert,
            setGeneratedData,
            generatedData
          }}
        />
      </div>
    </div>
  );
};

export default CreateJob;
