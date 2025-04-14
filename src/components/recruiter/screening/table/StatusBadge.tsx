
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'approved':
      return <Badge className="bg-green-500">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return (
        <Badge variant="outline">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
  }
};
