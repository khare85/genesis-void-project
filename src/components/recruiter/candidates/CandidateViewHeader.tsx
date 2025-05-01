
import React from "react";
import { SearchBar } from "./search/SearchBar";
import { FilterToggle } from "./filters/FilterToggle";
import { FilterStatus } from "./filters/FilterStatus";

interface CandidateViewHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  totalCount: number;
  showFilterSidebar: boolean;
  onToggleFilters: () => void;
}

export const CandidateViewHeader: React.FC<CandidateViewHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  totalCount,
  showFilterSidebar,
  onToggleFilters,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <span className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "result" : "results"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <FilterStatus filter={filter} setFilter={setFilter} />
        <FilterToggle 
          showFilterSidebar={showFilterSidebar} 
          onToggleFilters={onToggleFilters} 
        />
      </div>
    </div>
  );
};
