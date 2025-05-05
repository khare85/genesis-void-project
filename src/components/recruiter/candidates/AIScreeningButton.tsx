
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
      className={`flex items-center gap-2 ${selectedCount === 0 ? "border-gray-200 text-gray-500" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
    >
      <Sparkles className="h-4 w-4" />
      {selectedCount > 0
        ? `AI Screen (${selectedCount})`
        : "AI Screen Talents"}
    </Button>
  );
};
