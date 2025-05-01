
import React from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterToggleProps {
  showFilterSidebar: boolean;
  onToggleFilters: () => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ 
  showFilterSidebar, 
  onToggleFilters 
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onToggleFilters}
      className="flex items-center gap-2"
    >
      {showFilterSidebar ? (
        <>
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Hide Filters</span>
        </>
      ) : (
        <>
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Show Filters</span>
        </>
      )}
    </Button>
  );
};
