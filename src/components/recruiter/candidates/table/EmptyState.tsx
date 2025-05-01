
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyStateProps {
  colSpan: number;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  colSpan, 
  message = "No candidates found." 
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        {message}
      </TableCell>
    </TableRow>
  );
};
