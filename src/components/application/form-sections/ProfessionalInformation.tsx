
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../ApplicationForm';

interface ProfessionalInformationProps {
  form: UseFormReturn<FormData>;
}

export const ProfessionalInformation: React.FC<ProfessionalInformationProps> = ({ form }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currentCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Position</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-7">5-7 years</SelectItem>
                  <SelectItem value="7-10">7-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noticePeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notice Period *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="2-weeks">2 weeks</SelectItem>
                  <SelectItem value="30-days">30 days</SelectItem>
                  <SelectItem value="60-days">60 days</SelectItem>
                  <SelectItem value="90-days">90 days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salaryExpectation"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Salary Expectation (Annual) *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $120,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
