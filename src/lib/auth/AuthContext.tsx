
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
    const checkSession = async () => {
      try {
        // First check for stored user in localStorage (demo mode)
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
        } else {
          // Check for Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('Auth: Found Supabase session', session);
            // Get user profile from database if needed
            // For now, just create a basic user object from session
            const supabaseUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              role: 'candidate', // Default role for Supabase users
              avatarUrl: session.user.user_metadata.avatar_url,
            };
            
            setUser(supabaseUser);
            
            if (location.pathname === '/login') {
              const dashboardPath = getDashboardByRole(supabaseUser.role);
              navigate(dashboardPath, { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          // User signed in with Supabase
          const supabaseUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            role: 'candidate', // Default role for Supabase users
            avatarUrl: session.user.user_metadata.avatar_url,
          };
          
          setUser(supabaseUser);
          
          // If on login page, redirect to dashboard
          if (location.pathname === '/login') {
            const dashboardPath = getDashboardByRole(supabaseUser.role);
            navigate(dashboardPath, { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out of Supabase
          setUser(null);
          localStorage.removeItem('persona_ai_user');
          
          // If not already on login page, redirect there
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  // Login function - handle both demo and Supabase logins
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const lowercaseEmail = email.toLowerCase();
      
      // First try demo login
      if (DEMO_USERS[lowercaseEmail] && password === 'password') {
        const loggedInUser = DEMO_USERS[lowercaseEmail];
        setUser(loggedInUser);
        localStorage.setItem('persona_ai_user', JSON.stringify(loggedInUser));
        toast.success(`Welcome, ${loggedInUser.name}!`);
        
        console.log('Auth: Demo login success, navigating to dashboard');
        // Navigate to the appropriate dashboard based on user role
        const dashboardPath = getDashboardByRole(loggedInUser.role);
        navigate(dashboardPath, { replace: true });
        return;
      }
      
      // If not a demo user, try Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lowercaseEmail,
        password,
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        toast.error(error.message || 'Invalid credentials. Try a demo account.');
      } else if (data && data.user) {
        // Successfully logged in with Supabase
        toast.success(`Welcome, ${data.user.email}!`);
        
        // Session change will be handled by the onAuthStateChange listener
        console.log('Auth: Supabase login success');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - handle both demo and Supabase logouts
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear local storage for demo users
      localStorage.removeItem('persona_ai_user');
      
      // Also sign out from Supabase if there's a session
      await supabase.auth.signOut();
      
      setUser(null);
      toast.info('You have been logged out.');
      
      // Navigate to homepage instead of login page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    } finally {
      setIsLoading(false);
    }
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
