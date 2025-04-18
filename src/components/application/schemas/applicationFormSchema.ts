
import * as z from 'zod';

export const applicationFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  yearsOfExperience: z.string().min(1, { message: 'Years of experience is required' }),
  noticePeriod: z.string().min(1, { message: 'Notice period is required' }),
  salaryExpectation: z.string().min(1, { message: 'Salary expectation is required' }),
  coverLetter: z.string().optional(),
  heardFrom: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
