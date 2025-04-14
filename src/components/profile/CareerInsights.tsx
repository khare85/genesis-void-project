
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AIGenerated from "@/components/shared/AIGenerated";
import { PlusCircle } from 'lucide-react';

const CareerInsights: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Insights</CardTitle>
        <CardDescription>AI-generated career recommendations based on your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <AIGenerated>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Profile Strength</h4>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>85% Complete</span>
                <span>15% to go</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Suggested Improvements</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                  <span>Add more quantifiable achievements to your experience section</span>
                </li>
                <li className="flex items-start gap-2">
                  <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                  <span>Consider adding a portfolio with visual examples of your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                  <span>Expand your skills section with emerging technologies</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium text-sm mt-2">Career Path Recommendations</h4>
              <ul className="space-y-2">
                <li>
                  <div className="font-medium text-sm">Frontend Architect</div>
                  <p className="text-xs text-muted-foreground">Your experience makes you well-positioned for architectural roles. Consider deepening knowledge in system design and performance optimization.</p>
                </li>
                <li>
                  <div className="font-medium text-sm">Full Stack Team Lead</div>
                  <p className="text-xs text-muted-foreground">With your frontend expertise and growing backend skills, you could transition to lead roles with some additional leadership training.</p>
                </li>
              </ul>
            </div>
          </div>
        </AIGenerated>
      </CardContent>
    </Card>
  );
};

export default CareerInsights;
