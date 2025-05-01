
export interface User {
  id: string;
  name: string;
  email: string | null;
  role: string;
  avatarUrl?: string;
  companyName?: string;
}
