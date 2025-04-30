
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface CompletedApplicationItemProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

const CompletedApplicationItem = ({ application, isSelected, onClick }: CompletedApplicationItemProps) => {
  // Determine the icon based on the status
  const getStatusIcon = (status: string) => {
    if (status === 'Offer Accepted') return <CheckCircle2 className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-md border ${isSelected ? 'border-primary' : 'hover:border-primary hover:bg-muted/30'} transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-md ${application.statusColor} flex items-center justify-center text-white font-bold`}>
          {application.company.substring(0, 1)}
        </div>
        <div>
          <div className="text-sm font-medium">{application.jobTitle}</div>
          <div className="text-xs text-muted-foreground">{application.company} • {application.date}</div>
        </div>
      </div>
      <div className="flex items-center">
        <Badge 
          variant={application.status === 'Offer Accepted' ? 'default' : 'destructive'} 
          className="gap-1"
        >
          {getStatusIcon(application.status)}
          {application.status}
        </Badge>
      </div>
    </div>
  );
};

export default CompletedApplicationItem;
