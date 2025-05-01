
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { getDashboardByRole } from './utils';
import { UserRole } from './types';

export const RequireAuth = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait until auth check completes

    // Special case - if a recruiter is accessing a candidate profile, allow it
    if (location.pathname.startsWith('/candidate/profile') && user?.role === 'recruiter') {
      return;
    }

    if (!isAuthenticated) {
      console.log('RequireAuth: User not authenticated, redirecting to login');
      // Save the current location they were trying to go to
      navigate('/login', { state: { from: location } });
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      console.log('RequireAuth: User does not have required role, redirecting to their dashboard');
      navigate(getDashboardByRole(user.role), { 
        replace: true,
        state: { from: location } 
      });
      toast.error('You do not have permission to access that page.');
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, navigate, location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Special case for recruiters viewing candidate profiles
  if (location.pathname.startsWith('/candidate/profile') && user?.role === 'recruiter') {
    return <>{children}</>;
  }

  // Only render children if user is authenticated and has appropriate role
  return isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role))) 
    ? <>{children}</> 
    : null;
};
