
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterStatusProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export const FilterStatus: React.FC<FilterStatusProps> = ({ 
  filter, 
  setFilter 
}) => {
  return (
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
};
