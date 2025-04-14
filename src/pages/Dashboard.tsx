
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { getDashboardByRole } from '@/lib/auth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // If we have a user, redirect to their role-specific dashboard
  if (user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }
  
  // If no user (shouldn't happen because of ProtectedRoute), redirect to login
  return <Navigate to="/login" replace />;
};

export default Dashboard;
