import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getDashboardByRole } from '@/lib/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname;
  
  useEffect(() => {
    // If authentication check is complete and user is authenticated, redirect
    if (!isLoading && isAuthenticated && user) {
      console.log('PublicRoute: User authenticated, redirecting to dashboard', user);
      // If they were redirected to login, send them back to the page they tried to access
      // Otherwise, send them to their role-based dashboard
      const dashboardPath = from || getDashboardByRole(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate, from]);
  
  // While checking authentication status, show loading indicator
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>;
  }
  
  // If user is authenticated, return nothing (the useEffect will handle redirection)
  if (isAuthenticated && user) {
    return null;
  }
  
  // Otherwise, show the children (login/signup page)
  return <>{children}</>;
};

export default PublicRoute;
