
import { Badge } from "@/components/ui/badge";
import React from 'react';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatRole = (role: string) => {
  switch(role) {
    case 'admin':
      return 'Admin';
    case 'hiring_manager':
      return 'Hiring Manager';
    case 'recruiter':
      return 'Recruiter';
    case 'candidate':
      return 'Candidate';
    default:
      return role;
  }
};

export const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active':
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
