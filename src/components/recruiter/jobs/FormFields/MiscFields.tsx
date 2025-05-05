
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { JobFormValues } from '../types';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface MiscFieldsProps {
  form?: UseFormReturn<JobFormValues>;
}

export const MiscFields: React.FC<MiscFieldsProps> = ({ form }) => {
  // Use provided form or context
  const formContext = useFormContext<JobFormValues>();
  const formToUse = form || formContext;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="ats-card-3d p-6">
        <FormField 
          control={formToUse.control} 
          name="closingDate" 
          render={({ field }) => (
            <FormItem className="h-full flex flex-col">
              <FormLabel className="text-gray-700 font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Closing Date
              </FormLabel>
              <FormDescription className="mt-1 text-sm text-slate-500">
                Applications will be accepted until this date
              </FormDescription>
              <FormControl className="mt-2">
                <Input 
                  type="date" 
                  {...field} 
                  className="border-slate-200 focus:border-primary rounded-lg transition-all bg-slate-50/50 w-full md:w-2/3 h-11"
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
          name="featured" 
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg h-full">
              <div className="space-y-2">
                <FormLabel className="text-lg text-gray-700 font-bold">Featured Job</FormLabel>
                <FormDescription className="text-slate-500">
                  Featured jobs will be highlighted on the careers page with a special badge
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                  className="data-[state=checked]:bg-primary"
                />
              </FormControl>
            </FormItem>
          )} 
        />
      </Card>
    </div>
  );
};
