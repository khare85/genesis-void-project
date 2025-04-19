
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
    if (!isLoading && isAuthenticated && user) {
      console.log('PublicRoute: Redirecting authenticated user to:', from || getDashboardByRole(user.role));
      navigate(from || getDashboardByRole(user.role), { replace: true });
    }
  }, [isLoading, isAuthenticated, user, from, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated && user ? null : <>{children}</>;
};

export default PublicRoute;
