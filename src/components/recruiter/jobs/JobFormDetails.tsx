
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from './types';

interface JobFormDetailsProps {
  form: UseFormReturn<JobFormValues>;
}

export const JobFormDetails: React.FC<JobFormDetailsProps> = ({ form }) => {
  return (
    <>
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
      <FormField
        control={form.control}
        name="responsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter responsibilities (one per line)"
                className="h-32"
              />
            </FormControl>
            <FormDescription>
              Enter each responsibility on a new line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
