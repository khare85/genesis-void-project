
import React from 'react';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react';

interface AIGeneratedProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const AIGenerated = ({ children, className, isLoading = false }: AIGeneratedProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-md border border-primary/10 bg-primary/5 p-4",
        className
      )}>
        <div className="absolute -top-2.5 -right-2.5">
          <div className="bg-primary flex items-center justify-center rounded-full p-1">
            <Sparkles className="h-3 w-3 text-primary-foreground" aria-hidden="true" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AIGenerated;
