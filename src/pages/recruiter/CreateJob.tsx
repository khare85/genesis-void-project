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
  return <div className="space-y-6">
      <PageHeader title="Create New Job" description="Post a new job listing" icon={<Briefcase className="h-6 w-6" />} actions={<GenerateDetailsButton isGenerating={isGenerating} setIsGenerating={setIsGenerating} setMissingFields={setMissingFields} setShowMissingFieldsAlert={setShowMissingFieldsAlert} setGeneratedData={setGeneratedData} />} />
      
      {showMissingFieldsAlert && <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Please fill in the following required fields before generating job details:
            <ul className="list-disc pl-5 mt-2">
              {missingFields.map((field, index) => <li key={index}>{field}</li>)}
            </ul>
          </AlertDescription>
        </Alert>}

      <div className="p-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-blue-100 transform hover:translate-y-[-2px] transition-all duration-300 rounded-2xl bg-blue-50">
        <JobForm />
      </div>
    </div>;
};
export default CreateJob;