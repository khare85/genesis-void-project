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
    // If user is authenticated, redirect to their dashboard
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath = from || getDashboardByRole(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate, from]);
  
  // While checking authentication status, show nothing
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>;
  }
  
  // If user is authenticated, it will be handled by the useEffect
  // Otherwise, show the children (login/signup page)
  return <>{children}</>;
};

export default PublicRoute;
