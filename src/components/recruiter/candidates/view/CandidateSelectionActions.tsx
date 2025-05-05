
import React from "react";
import { AIScreeningButton } from "../AIScreeningButton";
import { Button } from "@/components/ui/button";
import { Download, Filter, CheckSquare } from "lucide-react";

interface CandidateSelectionActionsProps {
  selectedCandidates: string[];
  onScreen: () => void;
}

export const CandidateSelectionActions: React.FC<CandidateSelectionActionsProps> = ({
  selectedCandidates,
  onScreen
}) => {
  const handleExport = () => {
    console.log("Exporting selected candidates:", selectedCandidates);
  };

  const handleBulkAction = () => {
    console.log("Performing bulk action on:", selectedCandidates);
  };

  return (
    <div className="flex items-center gap-2">
      <AIScreeningButton 
        selectedCount={selectedCandidates.length} 
        onScreen={onScreen}
      />
      
      {selectedCandidates.length > 0 && (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBulkAction}
            className="flex items-center gap-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <CheckSquare className="h-4 w-4" />
            Bulk Action
          </Button>
        </>
      )}
    </div>
  );
};
