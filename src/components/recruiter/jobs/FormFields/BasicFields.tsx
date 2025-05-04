
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={formToUse.control}
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
        control={formToUse.control}
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

      <FormField
        control={formToUse.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. Engineering" />
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
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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
            <FormLabel>Experience Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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
