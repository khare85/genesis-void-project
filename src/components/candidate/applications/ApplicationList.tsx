
import React from 'react';
import { FileText } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import ApplicationListItem from './ApplicationListItem';
import CompletedApplicationItem from './CompletedApplicationItem';

interface ApplicationListProps {
  applications: Application[];
  type: 'active' | 'completed';
  selectedApplicationId: string | null;
  onSelectApplication: (application: Application) => void;
}

const ApplicationList = ({ 
  applications, 
  type, 
  selectedApplicationId, 
  onSelectApplication 
}: ApplicationListProps) => {
  if (applications.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 mx-auto" />
        <p className="text-sm font-medium mb-2">
          No {type === 'active' ? 'active' : 'completed'} applications
        </p>
        <p className="text-xs">
          {type === 'active' 
            ? 'Start applying to jobs to see them here' 
            : 'Your completed applications will appear here'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        type === 'active' ? (
          <ApplicationListItem
            key={application.id}
            application={application}
            isSelected={selectedApplicationId === application.id}
            onClick={() => onSelectApplication(application)}
          />
        ) : (
          <CompletedApplicationItem
            key={application.id}
            application={application}
            isSelected={selectedApplicationId === application.id}
            onClick={() => onSelectApplication(application)}
          />
        )
      ))}
    </div>
  );
};

export default ApplicationList;
