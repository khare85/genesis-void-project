
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface AnalysisScores {
  overallScore: number;
  confidence: number;
  clarity: number;
  technicalAccuracy: number;
  engagement: number;
}

interface AnalysisOverviewCardProps {
  scores: AnalysisScores;
}

export const AnalysisOverviewCard: React.FC<AnalysisOverviewCardProps> = ({ scores }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Analysis Overview
        </CardTitle>
        <CardDescription>
          Overall performance assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm font-medium">{scores.overallScore}%</span>
          </div>
          <Progress value={scores.overallScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Confidence</span>
              <span className="text-xs">{scores.confidence}%</span>
            </div>
            <Progress value={scores.confidence} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Clarity</span>
              <span className="text-xs">{scores.clarity}%</span>
            </div>
            <Progress value={scores.clarity} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Technical Accuracy</span>
              <span className="text-xs">{scores.technicalAccuracy}%</span>
            </div>
            <Progress value={scores.technicalAccuracy} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Engagement</span>
              <span className="text-xs">{scores.engagement}%</span>
            </div>
            <Progress value={scores.engagement} className="h-1.5" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Recommendation</h4>
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            Strongly Recommended for Next Round
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
