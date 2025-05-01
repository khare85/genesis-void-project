
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  filter: string;
  setFilter: (filter: string) => void;
  onToggleFilters: () => void;
  showFilterSidebar: boolean;
}

export const CandidateTableHeader: React.FC<CandidateTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalCount,
  filter,
  setFilter,
  onToggleFilters,
  showFilterSidebar
}) => {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search candidates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleFilters}>
          <Filter className="mr-2 h-4 w-4" />
          {showFilterSidebar ? "Hide Filters" : "Show Filters"}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Status: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem 
              checked={filter === "all"} 
              onCheckedChange={() => setFilter("all")}
            >
              All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filter === "new"} 
              onCheckedChange={() => setFilter("new")}
            >
              New
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filter === "pending"} 
              onCheckedChange={() => setFilter("pending")}
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filter === "approved"} 
              onCheckedChange={() => setFilter("approved")}
            >
              Approved
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filter === "rejected"} 
              onCheckedChange={() => setFilter("rejected")}
            >
              Rejected
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="sm" asChild>
          <Link to="/recruiter/candidates/export">Export</Link>
        </Button>
      </div>
    </div>
  );
};
