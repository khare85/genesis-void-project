
import { z } from "zod";

export const jobFormSchema = z.object({
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

export type JobFormValues = z.infer<typeof jobFormSchema>;

// Interface for the formatted job data that will be sent to the database
export interface FormattedJobData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  department: string;
  category: string;
  level: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featured: boolean;
  status: string;
  closingDate: string;
  postedDate: string;
}
