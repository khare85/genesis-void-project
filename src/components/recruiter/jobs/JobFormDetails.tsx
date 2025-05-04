
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { TextArrayFields } from './FormFields/TextArrayFields';
import { SalaryAndDescription } from './FormFields/SalaryAndDescription';
import { BasicFields } from './FormFields/BasicFields';
import { MiscFields } from './FormFields/MiscFields';
import { JobFormLocation } from './JobFormLocation';

const JobFormDetails = ({ form }) => {
  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <BasicFields />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Requirements</h3>
          <TextArrayFields 
            fieldName="requirements"
            label="Requirements"
            placeholder="Add a requirement"
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Responsibilities</h3>
          <TextArrayFields 
            fieldName="responsibilities"
            label="Responsibilities"
            placeholder="Add a responsibility"
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Benefits</h3>
          <TextArrayFields 
            fieldName="benefits"
            label="Benefits"
            placeholder="Add a benefit"
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Location</h3>
          <JobFormLocation />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border/40">
          <h3 className="text-lg font-medium mb-4">Additional Details</h3>
          <SalaryAndDescription />
          <MiscFields />
        </div>
      </div>
    </FormProvider>
  );
};

export default JobFormDetails;
