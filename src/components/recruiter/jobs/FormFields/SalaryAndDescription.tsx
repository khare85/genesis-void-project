
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';
import { Button } from '@/components/ui/button';
import { Wand } from 'lucide-react';
import { SkillsInput } from './SkillsInput';
import { BasicFields } from './BasicFields';

interface SalaryAndDescriptionProps {
  form: UseFormReturn<JobFormValues>;
  onGenerateDetails: () => void;
  isGenerating: boolean;
}

export const SalaryAndDescription: React.FC<SalaryAndDescriptionProps> = ({ 
  form, 
  onGenerateDetails,
  isGenerating 
}) => {
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

      <BasicFields form={form} />

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onGenerateDetails}
          disabled={isGenerating}
          className="gap-2"
        >
          <Wand className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Job Details"}
        </Button>
      </div>

      <SkillsInput form={form} />

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
    </>
  );
};
