
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
      variant={selectedCount > 0 ? "default" : "outline"}
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {selectedCount > 0
        ? `AI Screen (${selectedCount})`
        : "AI Screen Talents"}
    </Button>
  );
};
