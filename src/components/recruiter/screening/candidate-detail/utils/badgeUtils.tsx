
import React from 'react';
import { Badge } from "@/components/ui/badge";

/**
 * Returns the appropriate match badge component based on the match category
 */
export const getMatchBadge = (category: string) => {
  switch (category) {
    case "High Match":
      return <Badge className="bg-green-200">High Match</Badge>;
    case "Medium Match":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Match</Badge>;
    case "Low Match":
      return <Badge className="bg-orange-500 hover:bg-orange-600">Low Match</Badge>;
    case "No Match":
      return <Badge className="bg-red-500 hover:bg-red-600">No Match</Badge>;
    default:
      return <Badge variant="outline">Unrated</Badge>;
  }
};

/**
 * Returns the appropriate status badge component
 */
export const getStatusBadge = (status: string) => {
  return <Badge variant={status === 'approved' ? "default" : status === 'rejected' ? "destructive" : "secondary"} className="text-xs">
      {status === 'rejected' ? 'Not Selected' : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>;
};
