
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from './types';
import { TextArrayFields } from './FormFields/TextArrayFields';
import { MiscFields } from './FormFields/MiscFields';

interface JobFormDetailsProps {
  form: UseFormReturn<JobFormValues>;
  onGenerateDetails: () => void;
  isGenerating: boolean;
}

export const JobFormDetails: React.FC<JobFormDetailsProps> = ({ 
  form, 
  onGenerateDetails, 
  isGenerating 
}) => {
  return (
    <>
      <TextArrayFields form={form} />
      <MiscFields form={form} />
    </>
  );
};
