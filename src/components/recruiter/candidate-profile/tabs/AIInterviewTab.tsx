
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Video, Brain, LineChart, CheckCircle2, XCircle, AlertCircle, User } from 'lucide-react';

interface AIInterviewTabProps {
  profile: CompleteCandidateProfile;
}

export const AIInterviewTab: React.FC<AIInterviewTabProps> = ({ profile }) => {
  // Mock data for AI interview analysis
  const mockAnalysis = {
    completedOn: new Date().toLocaleDateString(),
    duration: "28 minutes",
    questions: 12,
    overallScore: 85,
    confidence: 89,
    clarity: 82,
    technicalAccuracy: 87,
    engagement: 83,
    keyInsights: [
      { type: "strength", text: "Shows exceptional problem-solving skills with practical examples" },
      { type: "strength", text: "Demonstrates clear understanding of system architecture principles" },
      { type: "area_for_improvement", text: "Could improve specific knowledge of cloud deployment strategies" },
      { type: "neutral", text: "Prefers collaborative work environments with regular feedback" },
    ],
    skillAssessments: [
      { skill: "JavaScript", score: 90 },
      { skill: "React", score: 87 },
      { skill: "Node.js", score: 78 },
      { skill: "System Design", score: 85 },
      { skill: "Problem Solving", score: 92 },
    ]
  };

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Interview Recording
            </CardTitle>
            <CardDescription>
              AI-conducted interview completed on {mockAnalysis.completedOn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <video
                src="https://example.com/placeholder-interview.mp4" 
                controls
                poster={profile.avatar}
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Duration: {mockAnalysis.duration}</span>
                <span>Questions: {mockAnalysis.questions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Overview */}
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
                <span className="text-sm font-medium">{mockAnalysis.overallScore}%</span>
              </div>
              <Progress value={mockAnalysis.overallScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Confidence</span>
                  <span className="text-xs">{mockAnalysis.confidence}%</span>
                </div>
                <Progress value={mockAnalysis.confidence} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Clarity</span>
                  <span className="text-xs">{mockAnalysis.clarity}%</span>
                </div>
                <Progress value={mockAnalysis.clarity} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Technical Accuracy</span>
                  <span className="text-xs">{mockAnalysis.technicalAccuracy}%</span>
                </div>
                <Progress value={mockAnalysis.technicalAccuracy} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Engagement</span>
                  <span className="text-xs">{mockAnalysis.engagement}%</span>
                </div>
                <Progress value={mockAnalysis.engagement} className="h-1.5" />
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
      </div>

      {/* Detailed Analysis Section */}
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
              {mockAnalysis.keyInsights.map((insight, index) => (
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
              {mockAnalysis.skillAssessments.map((skill, index) => (
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
              The candidate demonstrated strong technical knowledge in frontend development, particularly in React and state management. They were able to explain complex concepts clearly and provided practical examples from their previous work. 
              
              When discussing system architecture, the candidate showed good understanding of microservices and API design principles. The candidate's problem-solving approach was systematic and thorough.
              
              Areas for development include deeper knowledge of cloud infrastructure and deployment strategies. The candidate would benefit from more hands-on experience with container orchestration.
              
              Overall, the candidate would be a valuable addition to the engineering team with their strong technical foundation and collaborative approach to problem-solving.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
