
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from './types';
import { BasicFields } from './FormFields/BasicFields';
import { SalaryAndDescription } from './FormFields/SalaryAndDescription';
import { TextArrayFields } from './FormFields/TextArrayFields';
import { MiscFields } from './FormFields/MiscFields';

interface JobFormDetailsProps {
  form: UseFormReturn<JobFormValues>;
}

export const JobFormDetails: React.FC<JobFormDetailsProps> = ({ form }) => {
  return (
    <>
      <BasicFields form={form} />
      <SalaryAndDescription form={form} />
      <TextArrayFields form={form} />
      <MiscFields form={form} />
    </>
  );
};
