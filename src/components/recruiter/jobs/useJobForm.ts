
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobFormValues, jobFormSchema } from './types';

export const useJobForm = (initialData?: Partial<JobFormValues>) => {
  const defaultValues: JobFormValues = {
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
    closingDate: initialData?.closingDate || new Date().toISOString().split('T')[0],
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  return form;
};
