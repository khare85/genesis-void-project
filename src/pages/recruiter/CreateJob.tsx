
import React from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerateDetailsButton } from '@/components/recruiter/jobs/components/GenerateDetailsButton';
import { useJobCreation } from '@/components/recruiter/jobs/hooks/useJobCreation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/recruiter/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/recruiter/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Job</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <PageHeader 
        title="Create New Job" 
        description="Post a new job listing" 
        icon={<Briefcase className="h-6 w-6 text-primary" />}
      />
      
      {showMissingFieldsAlert && (
        <Alert variant="destructive" className="rounded-xl shadow-md">
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

      <div className="ats-card-3d overflow-hidden bg-white">
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
