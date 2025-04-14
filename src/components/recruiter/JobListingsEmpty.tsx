
import React from 'react';
import { Briefcase } from 'lucide-react';

const JobListingsEmpty: React.FC = () => {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-20" />
      <h3 className="font-medium mb-1">No jobs found</h3>
      <p className="text-sm">Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default JobListingsEmpty;
