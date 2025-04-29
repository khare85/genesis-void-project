
export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'candidate' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
