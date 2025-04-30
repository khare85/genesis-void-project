
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface ApplicationListItemProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

const ApplicationListItem = ({ application, isSelected, onClick }: ApplicationListItemProps) => {
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
          <div className="text-xs text-muted-foreground">{application.company} • Applied {application.date}</div>
        </div>
      </div>
      <div className="flex items-center">
        <Badge variant="outline" className="mr-4">
          {application.status}
        </Badge>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ApplicationListItem;
