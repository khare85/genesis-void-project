
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
    <>
      <FormField
        control={formToUse.control}
        name="closingDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Closing Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formToUse.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured Job</FormLabel>
              <FormDescription>
                Mark this job as featured to highlight it on the careers page
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
