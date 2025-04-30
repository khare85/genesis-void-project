
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIGenerated from "@/components/shared/AIGenerated";
import { Loader2, SparklesIcon } from 'lucide-react';
import { useCareerInsights } from '@/hooks/candidate/useCareerInsights';
import { Link } from 'react-router-dom';

const DashboardCareerInsights: React.FC = () => {
  const { insights, isLoading, error, refetchInsights } = useCareerInsights();

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">AI Career Insights</h3>
          <SparklesIcon className="h-4 w-4 text-primary" />
        </div>
        
        <AIGenerated isLoading={isLoading}>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Unable to generate insights right now</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/candidate/profile">Visit Profile for Insights</Link>
              </Button>
            </div>
          )}
          
          {!insights && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-4">
              <SparklesIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Generate AI-powered insights to enhance your career opportunities
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/candidate/profile">Visit Profile for Insights</Link>
              </Button>
            </div>
          )}
          
          {insights && !isLoading && !error && (
            <div className="space-y-4">
              <p className="text-sm">
                Based on your profile and current market trends, here are some personalized insights:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-1">Skill Gaps</h4>
                  <p className="text-xs text-muted-foreground">{insights.skillGaps}</p>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-1">Market Trends</h4>
                  <p className="text-xs text-muted-foreground">{insights.marketTrends}</p>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-1">Interview Performance</h4>
                  <p className="text-xs text-muted-foreground">{insights.interviewPerformance}</p>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-1">Resume Enhancement</h4>
                  <p className="text-xs text-muted-foreground">{insights.resumeEnhancement}</p>
                </div>
              </div>
              
              <Button size="sm" className="w-full" asChild>
                <Link to="/candidate/profile">Get Full Career Report</Link>
              </Button>
            </div>
          )}
        </AIGenerated>
      </div>
    </Card>
  );
};

export default DashboardCareerInsights;
