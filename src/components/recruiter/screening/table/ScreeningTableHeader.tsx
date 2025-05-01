
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ScreeningCandidate } from "@/types/screening";
import { Checkbox } from "@/components/ui/checkbox";

interface ScreeningTableHeaderProps {
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  showSelection?: boolean;
  allSelected?: boolean;
  onSelectAll?: (isSelected: boolean) => void;
}

export const ScreeningTableHeader: React.FC<ScreeningTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
  showSelection = false,
  allSelected = false,
  onSelectAll
}) => {
  // Helper function to render sort icon
  const getSortIcon = (field: keyof ScreeningCandidate) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        {showSelection && (
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
        )}
        <TableHead className="w-[150px]">
          <button
            className="flex items-center"
            onClick={() => onSort("matchCategory")}
          >
            Match
            {getSortIcon("matchCategory")}
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center"
            onClick={() => onSort("name")}
          >
            Candidate
            {getSortIcon("name")}
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center"
            onClick={() => onSort("company")}
          >
            Company
            {getSortIcon("company")}
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center"
            onClick={() => onSort("jobRole")}
          >
            Position
            {getSortIcon("jobRole")}
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center"
            onClick={() => onSort("dateApplied")}
          >
            Applied
            {getSortIcon("dateApplied")}
          </button>
        </TableHead>
        <TableHead>
          <button
            className="flex items-center"
            onClick={() => onSort("status")}
          >
            Status
            {getSortIcon("status")}
          </button>
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
