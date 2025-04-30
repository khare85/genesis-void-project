
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface ApplicationDetailsProps {
  selectedApplication: Application | null;
}

const ApplicationDetails = ({ selectedApplication }: ApplicationDetailsProps) => {
  if (!selectedApplication) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 mx-auto" />
        <p className="text-sm">Select an application to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium">{selectedApplication.jobTitle}</h4>
          <p className="text-sm text-muted-foreground">{selectedApplication.company}</p>
        </div>
        <Badge variant={selectedApplication.status === 'Offer Accepted' ? 'default' : 'outline'}>
          {selectedApplication.status}
        </Badge>
      </div>
      <div className="pt-4 border-t space-y-3">
        <h5 className="font-medium">Application Notes</h5>
        <p className="text-sm">{selectedApplication.notes || 'No notes provided for this application.'}</p>
      </div>
    </div>
  );
};

export default ApplicationDetails;
