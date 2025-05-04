
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkillsInput } from './SkillsInput';

interface FormFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

export const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Skills Input Field */}
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Skills</FormLabel>
            <FormControl>
              <SkillsInput 
                value={field.value || ''} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Salary Range Field */}
      <FormField
        control={form.control}
        name="salary_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Range</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. $80,000 - $100,000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Job Description Field */}
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
                className="min-h-[200px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
