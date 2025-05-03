
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface JobStatusBadgeProps {
  status: string;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'active':
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    case 'closed':
      return <Badge variant="destructive">Closed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default JobStatusBadge;
