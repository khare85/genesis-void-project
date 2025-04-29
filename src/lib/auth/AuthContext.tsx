
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from './types';
import { DEMO_USERS } from './mockUsers';
import { getDashboardByRole } from './utils';

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
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('persona_ai_user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('Auth: Found stored user', parsedUser);
        
        // If we're on the login page and have a user, redirect to their dashboard
        if (location.pathname === '/login') {
          console.log('Auth: Redirecting to dashboard from login page');
          const dashboardPath = getDashboardByRole(parsedUser.role);
          navigate(dashboardPath, { replace: true });
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('persona_ai_user');
      }
    }
    setIsLoading(false);
  }, [location.pathname, navigate]);

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
        
        console.log('Auth: Login success, navigating to dashboard');
        // Navigate to the appropriate dashboard based on user role
        const dashboardPath = getDashboardByRole(loggedInUser.role);
        navigate(dashboardPath, { replace: true });
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

  // Logout function - now with navigation
  const logout = () => {
    setUser(null);
    localStorage.removeItem('persona_ai_user');
    toast.info('You have been logged out.');
    navigate('/login', { replace: true });
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
