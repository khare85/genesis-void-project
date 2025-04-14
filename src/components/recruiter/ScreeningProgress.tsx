
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";

export const ScreeningProgress = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Screening Progress</h3>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Senior Developer</span>
              <span className="text-xs font-medium">18/24 screened</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Product Manager</span>
              <span className="text-xs font-medium">12/28 screened</span>
            </div>
            <Progress value={43} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">UX Designer</span>
              <span className="text-xs font-medium">8/15 screened</span>
            </div>
            <Progress value={53} className="h-2" />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <AIGenerated>
            <p className="text-sm mb-3">
              Today's screening efficiency is <span className="font-semibold">28% higher</span> than your average, resulting in an estimated 2.4 hours saved.
            </p>
            <Button size="sm" variant="outline" className="w-full">
              View Full Analysis
            </Button>
          </AIGenerated>
        </div>
      </div>
    </Card>
  );
};
