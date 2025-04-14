
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';

export type JobStatus = 'draft' | 'active' | 'closed';

export type JobLocation = {
  city: string;
  state?: string;
  country: string;
  remote: boolean;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  logo?: string;
  type: JobType;
  location: JobLocation;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type JobFormData = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;
