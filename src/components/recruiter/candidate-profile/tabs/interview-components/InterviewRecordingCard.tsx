
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface InterviewRecordingCardProps {
  completedOn: string;
  duration: string;
  questions: number;
  videoUrl: string;
  posterImage: string;
}

export const InterviewRecordingCard: React.FC<InterviewRecordingCardProps> = ({
  completedOn,
  duration,
  questions,
  videoUrl,
  posterImage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Interview Recording
        </CardTitle>
        <CardDescription>
          AI-conducted interview completed on {completedOn}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md overflow-hidden">
          <video
            src={videoUrl} 
            controls
            poster={posterImage}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Duration: {duration}</span>
            <span>Questions: {questions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
