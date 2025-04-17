
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from './types';

interface JobFormHeaderProps {
  form: UseFormReturn<JobFormValues>;
}

export const JobFormHeader: React.FC<JobFormHeaderProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. Senior Frontend Developer" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. TechCorp Inc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
