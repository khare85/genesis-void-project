
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from './types';

interface JobFormLocationProps {
  form: UseFormReturn<JobFormValues>;
}

export const JobFormLocation: React.FC<JobFormLocationProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. San Francisco, CA (Remote)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
