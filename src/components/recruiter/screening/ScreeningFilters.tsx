
import React from 'react';
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScreeningFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  jobRoleFilter: string;
  onJobRoleFilterChange: (value: string) => void;
  uniqueJobRoles: string[];
  onClearFilters: () => void;
}

export const ScreeningFilters: React.FC<ScreeningFiltersProps> = ({
  searchTerm,
  onSearchChange,
  jobRoleFilter,
  onJobRoleFilterChange,
  uniqueJobRoles,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={jobRoleFilter} onValueChange={onJobRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueJobRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};
