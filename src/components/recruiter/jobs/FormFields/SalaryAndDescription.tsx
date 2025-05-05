
import React from 'react';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { JobFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SkillsInput } from './SkillsInput';
import { Card } from '@/components/ui/card';

interface FormFieldsProps {
  form?: UseFormReturn<JobFormValues>;
}

export const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  // Use provided form or context
  const formContext = useFormContext<JobFormValues>();
  const formToUse = form || formContext;

  return (
    <div className="space-y-6">
      <Card className="ats-card-3d p-6">
        <FormField
          control={formToUse.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-bold">Required Skills</FormLabel>
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
      </Card>

      <Card className="ats-card-3d p-6">
        <FormField
          control={formToUse.control}
          name="salary_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-bold">Salary Range</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g. $80,000 - $100,000" 
                  className="border-slate-200 focus:border-primary rounded-lg transition-all bg-slate-50/50 h-11" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>

      <Card className="ats-card-3d p-6">
        <FormField
          control={formToUse.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-bold">Job Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter a detailed job description"
                  className="min-h-[200px] border-slate-200 focus:border-primary rounded-lg transition-all bg-slate-50/50 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};

export { FormFields as SalaryAndDescription };
