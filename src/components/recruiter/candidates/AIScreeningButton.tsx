
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
      className={`flex items-center gap-2 rounded-md ${
        selectedCount === 0 
          ? "bg-white border-gray-200 text-gray-500 hover:bg-gray-50" 
          : "bg-primary hover:bg-primary/90 text-primary-foreground"
      }`}
    >
      <Sparkles className="h-4 w-4" />
      {selectedCount > 0
        ? `AI Screen (${selectedCount})`
        : "AI Screen Talents"}
    </Button>
  );
};
