
export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  status: string;
  credits: number;
  subscriptionTier: string;
  renewalDate: string | null;
  hiringManagers?: number;
  activeJobs?: number;
}
