
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the landing page instead of causing a loop
  return <Navigate to="/login" replace />;
};

export default Index;
