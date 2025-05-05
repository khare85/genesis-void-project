
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { JobFormValues } from '../types';

interface BasicFieldsProps {
  form?: UseFormReturn<JobFormValues>;
}

export const BasicFields: React.FC<BasicFieldsProps> = ({ form }) => {
  // Use provided form or context
  const formContext = useFormContext<JobFormValues>();
  const formToUse = form || formContext;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
      <FormField
        control={formToUse.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-bold">Job Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g. Senior Frontend Developer" 
                className="border-blue-100/60 focus:border-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formToUse.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-bold">Company</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g. TechCorp Inc." 
                className="border-blue-100/60 focus:border-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formToUse.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-bold">Department</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g. Engineering" 
                className="border-blue-100/60 focus:border-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formToUse.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-bold">Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-blue-100/60 focus:border-blue-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formToUse.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-bold">Experience Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-blue-100/60 focus:border-blue-200">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid-level">Mid Level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
