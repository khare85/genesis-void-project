
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { LineChart, CheckCircle2, XCircle, AlertCircle, User } from 'lucide-react';

interface KeyInsight {
  type: string;
  text: string;
}

interface SkillAssessment {
  skill: string;
  score: number;
}

interface DetailedAnalysisProps {
  keyInsights: KeyInsight[];
  skillAssessments: SkillAssessment[];
  interviewSummary: string;
}

export const DetailedAnalysisCard: React.FC<DetailedAnalysisProps> = ({
  keyInsights,
  skillAssessments,
  interviewSummary
}) => {
  // Get the insight icon based on type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "area_for_improvement":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <User className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Detailed Interview Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insights */}
        <div>
          <h3 className="text-lg font-medium mb-4">Key Insights</h3>
          <div className="space-y-3">
            {keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                {getInsightIcon(insight.type)}
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Skills Assessment */}
        <div>
          <h3 className="text-lg font-medium mb-4">Skills Assessment</h3>
          <div className="space-y-4">
            {skillAssessments.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <span className="text-sm">{skill.score}%</span>
                </div>
                <Progress value={skill.score} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Interview Transcript Summary */}
        <div>
          <h3 className="text-lg font-medium mb-4">Interview Summary</h3>
          <p className="text-sm whitespace-pre-line">
            {interviewSummary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
