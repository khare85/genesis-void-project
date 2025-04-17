
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface AIScreeningButtonProps {
  selectedCount: number;
  onScreen: () => void;
}

export const AIScreeningButton: React.FC<AIScreeningButtonProps> = ({
  selectedCount,
  onScreen,
}) => {
  return (
    <Button
      onClick={onScreen}
      disabled={selectedCount === 0}
      variant="secondary"
    >
      <Brain className="mr-2 h-4 w-4" />
      Screen {selectedCount} {selectedCount === 1 ? "Candidate" : "Candidates"}
    </Button>
  );
};
