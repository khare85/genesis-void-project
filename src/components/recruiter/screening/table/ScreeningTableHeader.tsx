
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";

interface ScreeningTableHeaderProps {
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
}

export const ScreeningTableHeader: React.FC<ScreeningTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  const getSortIcon = (field: keyof ScreeningCandidate) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">Score</TableHead>
        <TableHead>
          <div className="flex items-center cursor-pointer" onClick={() => onSort('name')}>
            Candidate
            {getSortIcon('name')}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center cursor-pointer" onClick={() => onSort('jobRole')}>
            Role
            {getSortIcon('jobRole')}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center cursor-pointer" onClick={() => onSort('dateApplied')}>
            Applied
            {getSortIcon('dateApplied')}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center cursor-pointer" onClick={() => onSort('status')}>
            Status
            {getSortIcon('status')}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center cursor-pointer" onClick={() => onSort('reviewTime')}>
            Review Time
            {getSortIcon('reviewTime')}
          </div>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
