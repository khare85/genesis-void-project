
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
    case "shortlisted":
      return <Badge className="bg-green-500 hover:bg-green-600">Shortlisted</Badge>;
    case "interviewed":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Interviewed</Badge>;
    case "rejected":
      return <Badge variant="destructive">Not Selected</Badge>;
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
