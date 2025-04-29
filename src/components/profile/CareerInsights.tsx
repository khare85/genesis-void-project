
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AIGenerated from "@/components/shared/AIGenerated";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, RefreshCw } from 'lucide-react';
import { useCareerInsights } from '@/hooks/candidate/useCareerInsights';

const CareerInsights: React.FC = () => {
  const { insights, isLoading, error, refetchInsights, lastFetched } = useCareerInsights();

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Career Insights</CardTitle>
          <CardDescription>
            AI-generated career recommendations based on your profile
            {lastFetched && (
              <span className="block text-xs mt-1">
                Last updated: {lastFetched.toLocaleDateString()} {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </CardDescription>
        </div>
        {!isLoading && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetchInsights()}
            className="w-full sm:w-auto flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate Insights
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <AIGenerated isLoading={isLoading}>
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Generating insights based on your profile...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-500 mb-2">Failed to generate career insights</p>
              <Button variant="outline" size="sm" onClick={() => refetchInsights()}>
                Try Again
              </Button>
            </div>
          )}
          
          {insights && !isLoading && !error && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Profile Strength</h4>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${insights.profileStrength}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{insights.profileStrength}% Complete</span>
                  <span>{100 - insights.profileStrength}% to go</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Suggested Improvements</h4>
                <ul className="space-y-1.5 text-sm">
                  {insights.suggestedImprovements.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-medium text-sm mt-2">Career Path Recommendations</h4>
                <ul className="space-y-2">
                  {insights.careerPathRecommendations.map((path, index) => (
                    <li key={index}>
                      <div className="font-medium text-sm">{path.title}</div>
                      <p className="text-xs text-muted-foreground">{path.explanation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </AIGenerated>
      </CardContent>
    </Card>
  );
};

export default CareerInsights;
