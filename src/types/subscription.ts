
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  max_jobs: number;
  max_users: number;
  ai_credits: number;
  is_active: boolean;
  is_enterprise: boolean;
  created_at: string;
  updated_at: string;
}
