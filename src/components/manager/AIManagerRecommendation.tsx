
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";

export const AIManagerRecommendation = () => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">AI Recommendation</h3>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        
        <AIGenerated>
          <div className="space-y-4">
            <p className="text-sm">
              Based on your current hiring processes, we recommend focusing on these improvements:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Reduce time-to-decision after final interviews by 30%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Enhance job descriptions for Frontend roles to attract more diverse candidates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Schedule pending candidate reviews (5 awaiting feedback)</span>
              </li>
            </ul>
          </div>
        </AIGenerated>
      </div>
    </Card>
  );
};
