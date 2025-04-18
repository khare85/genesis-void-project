
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { jobFormSchema, JobFormValues, FormattedJobData } from '@/components/recruiter/jobs/types';

interface JobFormProps {
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: FormattedJobData) => void;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  // Helper functions for array-string conversion
  const arrayToString = (arr: string[] | undefined): string => {
    return Array.isArray(arr) ? arr.join('\n') : '';
  };

  const defaultValues: Partial<JobFormValues> = {
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary_range: initialData?.salary_range || '',
    description: initialData?.description || '',
    department: initialData?.department || '',
    category: initialData?.category || '',
    level: initialData?.level || '',
    responsibilities: initialData?.responsibilities || [],
    requirements: initialData?.requirements || [],
    benefits: initialData?.benefits || [],
    featured: initialData?.featured || false,
    status: initialData?.status || 'draft',
    closingDate: initialData?.closingDate || '',
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: JobFormValues) => {
    try {
      // Convert to proper array format if needed
      const formattedValues: FormattedJobData = {
        title: values.title,
        company: values.company,
        location: values.location,
        type: values.type,
        salary_range: values.salary_range,
        description: values.description,
        department: values.department,
        category: values.category,
        level: values.level,
        responsibilities: values.responsibilities,
        requirements: values.requirements,
        benefits: values.benefits,
        featured: values.featured,
        status: values.status,
        closingDate: values.closingDate,
        postedDate: new Date().toISOString().split('T')[0],
      };

      onSubmit(formattedValues);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <FormField
            control={form.control}
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
            control={form.control}
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

        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities</FormLabel>
              <FormControl>
                <Textarea
                  value={arrayToString(field.value)}
                  onChange={(e) => {
                    field.onChange(e.target.value.split('\n').filter(Boolean));
                  }}
                  placeholder="Enter responsibilities (one per line)"
                  className="h-32"
                />
              </FormControl>
              <FormDescription>
                Enter each responsibility on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  value={arrayToString(field.value)}
                  onChange={(e) => {
                    field.onChange(e.target.value.split('\n').filter(Boolean));
                  }}
                  placeholder="Enter requirements (one per line)"
                  className="h-32"
                />
              </FormControl>
              <FormDescription>
                Enter each requirement on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <FormControl>
                <Textarea
                  value={arrayToString(field.value)}
                  onChange={(e) => {
                    field.onChange(e.target.value.split('\n').filter(Boolean));
                  }}
                  placeholder="Enter benefits (one per line)"
                  className="h-32"
                />
              </FormControl>
              <FormDescription>
                Enter each benefit on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              form.setValue('status', 'draft');
              form.handleSubmit(handleSubmit)();
            }}
          >
            Save as Draft
          </Button>
          <Button 
            type="button"
            onClick={() => {
              form.setValue('status', 'active');
              form.handleSubmit(handleSubmit)();
            }}
          >
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
