
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CandidatesPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const CandidatesPagination: React.FC<CandidatesPaginationProps> = ({
  currentPage = 1,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        {totalItems > 0 
          ? `${startItem}-${endItem} of ${totalItems} Candidates` 
          : "0 Candidates"}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
