
import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Job type is required'),
  salary_range: z.string().optional(),
  skills: z.string().optional(),
  description: z.string().optional(),
  department: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  status: z.string().default('draft'),
  closingDate: z.string().optional().default(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
  postedDate: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export interface FormattedJobData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  skills?: string;
  description?: string;
  department?: string;
  category?: string;
  level?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  featured?: boolean;
  status?: string;
  closingDate?: string;
  postedDate?: string;
}
