import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AIGenerated from "@/components/shared/AIGenerated";
export const AIRecommendations = () => {
  return <Card className="shadow-lg transform transition-all hover:shadow-xl hover:-translate-y-1 border-0 rounded-2xl">
      <div className="p-6 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">AI Recommendations</h3>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        
        <AIGenerated>
          <div className="space-y-4">
            <p className="text-sm">Based on current application trends:</p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Higher quality candidates are applying on Tuesdays and Wednesdays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Senior Developer role is receiving candidates with stronger React skills than Angular</span>
              </li>
            </ul>
            <Button size="sm" variant="outline" className="w-full hover:bg-primary hover:bg-opacity-10 transition-colors">
              See More Insights
            </Button>
          </div>
        </AIGenerated>
      </div>
    </Card>;
};