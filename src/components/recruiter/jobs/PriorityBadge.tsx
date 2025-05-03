
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch(priority) {
    case 'high':
      return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
    case 'medium':
      return <Badge className="bg-orange-500 hover:bg-orange-600">Medium</Badge>;
    case 'low':
      return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
};

export default PriorityBadge;
