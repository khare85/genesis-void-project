
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
  employees: z.number().int().min(0, 'Number of employees must be a positive number'),
  credits: z.number().int().min(0, 'Credits must be a non-negative number').default(0),
  subscription_tier: z.string().default('Standard'),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyAdded: () => void;
}

export function AddCompanyDialog({ open, onOpenChange, onCompanyAdded }: AddCompanyDialogProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      industry: '',
      employees: 0,
      credits: 0,
      subscription_tier: 'Standard',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const { error } = await supabase.rpc('add_company_with_managers', {
        company_name: data.name,
        company_industry: data.industry,
        company_employees: data.employees,
        company_credits: data.credits,
        company_subscription_tier: data.subscription_tier,
      });

      if (error) throw error;

      toast.success('Company added successfully');
      onCompanyAdded();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Enter the company details below. You can add hiring managers later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter industry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter number of employees" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Company</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
