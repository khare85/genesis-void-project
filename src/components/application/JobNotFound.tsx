
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const JobNotFound = () => {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
      <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
      <Link to="/careers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>
    </div>
  );
};
