
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'candidate' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Demo users for different roles
const DEMO_USERS: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Alex Morgan',
    role: 'admin',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  },
  'hm@example.com': {
    id: '2',
    email: 'hm@example.com',
    name: 'Jordan Smith',
    role: 'hiring_manager',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=hm',
  },
  'recruiter@example.com': {
    id: '3',
    email: 'recruiter@example.com',
    name: 'Taylor Wilson',
    role: 'recruiter',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=recruiter',
  },
  'candidate@example.com': {
    id: '4',
    email: 'candidate@example.com',
    name: 'Jamie Lee',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?u=candidate',
  },
};

// Create Authentication Context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('persona_ai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('persona_ai_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Demo login function - in a real app, this would call Supabase auth
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const lowercaseEmail = email.toLowerCase();
      
      if (DEMO_USERS[lowercaseEmail] && password === 'password') {
        const loggedInUser = DEMO_USERS[lowercaseEmail];
        setUser(loggedInUser);
        localStorage.setItem('persona_ai_user', JSON.stringify(loggedInUser));
        toast.success(`Welcome, ${loggedInUser.name}!`);
        return;
      } else {
        toast.error('Invalid credentials. Try a demo account.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - now just clearing state without navigation
  const logout = () => {
    setUser(null);
    localStorage.removeItem('persona_ai_user');
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Helper function to get dashboard route based on user role
export function getDashboardByRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'hiring_manager':
      return '/manager/dashboard';
    case 'recruiter':
      return '/recruiter/dashboard';
    case 'candidate':
      return '/candidate/dashboard';
    default:
      return '/login';
  }
}

// Route guard component
export const RequireAuth = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      navigate(getDashboardByRole(user.role), { 
        replace: true,
        state: { from: location } 
      });
      toast.error('You do not have permission to access that page.');
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role))) 
    ? <>{children}</> 
    : null;
};
