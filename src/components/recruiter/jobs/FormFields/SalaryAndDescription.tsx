
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';

interface SalaryAndDescriptionProps {
  form: UseFormReturn<JobFormValues>;
}

export const SalaryAndDescription: React.FC<SalaryAndDescriptionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="salary_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Range</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. $120,000 - $150,000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter a detailed job description"
                className="h-32"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
