
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const JobApplicationLoading = () => {
  return (
    <div className="container py-16 flex flex-col items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
      <p className="text-lg font-medium">Loading job details...</p>
      <Link to="/careers" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>
    </div>
  );
};
