
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { JobFormValues } from '../types';

interface MiscFieldsProps {
  form?: UseFormReturn<JobFormValues>;
}

export const MiscFields: React.FC<MiscFieldsProps> = ({ form }) => {
  // Use provided form or context
  const formContext = useFormContext<JobFormValues>();
  const formToUse = form || formContext;

  return (
    <div className="space-y-6">
      <FormField 
        control={formToUse.control} 
        name="closingDate" 
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Closing Date</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                className="border-blue-100/60 focus:border-blue-200 w-full md:w-1/3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <FormField 
        control={formToUse.control} 
        name="featured" 
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-100/60 p-4 bg-blue-50/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base text-gray-700">Featured Job</FormLabel>
              <FormDescription className="text-gray-500">
                Mark this job as featured to highlight it on the careers page
              </FormDescription>
            </div>
            <FormControl>
              <Switch 
                checked={field.value} 
                onCheckedChange={field.onChange} 
                className="data-[state=checked]:bg-blue-600"
              />
            </FormControl>
          </FormItem>
        )} 
      />
    </div>
  );
};
