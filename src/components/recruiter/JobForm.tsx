
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

const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Job type is required'),
  salary_range: z.string().min(1, 'Salary range is required'),
  description: z.string().min(1, 'Job description is required'),
  department: z.string().min(1, 'Department is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Experience level is required'),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
  requirements: z.string().min(1, 'Requirements are required'),
  benefits: z.string().min(1, 'Benefits are required'),
  featured: z.boolean().default(false),
  status: z.string().default('draft'),
  closingDate: z.string().min(1, 'Closing date is required'),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  initialData?: Partial<JobFormValues>;
  onSubmit: (data: JobFormValues) => void;
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      company: initialData?.company || '',
      location: initialData?.location || '',
      type: initialData?.type || 'Full-time',
      salary_range: initialData?.salary_range || '',
      description: initialData?.description || '',
      department: initialData?.department || '',
      category: initialData?.category || '',
      level: initialData?.level || '',
      responsibilities: initialData?.responsibilities || '',
      requirements: initialData?.requirements || '',
      benefits: initialData?.benefits || '',
      featured: initialData?.featured || false,
      status: initialData?.status || 'draft',
      closingDate: initialData?.closingDate || '',
    },
  });

  const handleSubmit = async (values: JobFormValues) => {
    try {
      // Convert string arrays to proper array format
      const formattedValues = {
        ...values,
        responsibilities: values.responsibilities.split('\n').filter(Boolean),
        requirements: values.requirements.split('\n').filter(Boolean),
        benefits: values.benefits.split('\n').filter(Boolean),
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
                  {...field}
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
                  {...field}
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
                  {...field}
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
          <Button type="submit" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Job' : 'Publish Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;
