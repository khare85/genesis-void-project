
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScreeningCandidate } from "@/types/screening";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ScreeningTableHeaderProps {
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  showSelectionColumn?: boolean;
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
}

export const ScreeningTableHeader: React.FC<ScreeningTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
  showSelectionColumn = false,
  onSelectAll,
  allSelected = false
}) => {
  const renderSortIcon = (field: keyof ScreeningCandidate) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  
  const handleSort = (field: keyof ScreeningCandidate) => {
    onSort(field);
  };
  
  return (
    <TableHeader>
      <TableRow>
        {showSelectionColumn && (
          <TableHead className="w-12">
            {onSelectAll && (
              <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all candidates"
              />
            )}
          </TableHead>
        )}
        <TableHead className="w-[150px]">
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("matchScore")}>
            Match Score {renderSortIcon("matchScore")}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("name")}>
            Candidate {renderSortIcon("name")}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("company")}>
            Company {renderSortIcon("company")}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("jobRole")}>
            Job Role {renderSortIcon("jobRole")}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("dateApplied")}>
            Date Applied {renderSortIcon("dateApplied")}
          </div>
        </TableHead>
        <TableHead>
          <div className="flex cursor-pointer items-center" onClick={() => handleSort("status")}>
            Status {renderSortIcon("status")}
          </div>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
