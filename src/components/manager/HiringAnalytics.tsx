
import { Card } from "@/components/ui/card";
import { BarChart, TrendingUp } from "lucide-react";

export const HiringAnalytics = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Hiring Analytics</h3>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Time-to-hire</span>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">24 days</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost-per-hire</span>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">$2,450</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Offer acceptance rate</span>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">86%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Interview to hire ratio</span>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="font-medium">5:1</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
