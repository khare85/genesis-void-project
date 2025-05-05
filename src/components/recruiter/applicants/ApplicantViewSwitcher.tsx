
import React, { useState } from "react";
import { ApplicantTable } from "./ApplicantTable";
import { ApplicantGrid } from "./ApplicantGrid";
import { ScreeningCandidate } from "@/types/screening";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ApplicantViewSwitcherProps {
  applicants: ScreeningCandidate[];
}

export const ApplicantViewSwitcher: React.FC<ApplicantViewSwitcherProps> = ({ applicants }) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  return (
    <div className="space-y-4">
      <div className="flex justify-start mb-2">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "table" | "grid")}>
          <ToggleGroupItem value="table" aria-label="Table view">
            <LayoutList className="h-4 w-4 mr-2" />
            Table View
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Card View
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {viewMode === "table" ? (
        <ApplicantTable applicants={applicants} />
      ) : (
        <ApplicantGrid applicants={applicants} />
      )}
    </div>
  );
};
