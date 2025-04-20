
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getDashboardByRole } from '@/lib/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  
  if (isAuthenticated && user) {
    return <Navigate to={from || getDashboardByRole(user.role)} replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;
