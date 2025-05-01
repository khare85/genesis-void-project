
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Share, Maximize } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useServices } from '@/hooks/recruiter/screening/useServices';

interface CandidateVideoProps {
  videoUrl: string;
  posterUrl?: string;
  candidateId: string;
}

export const CandidateVideo: React.FC<CandidateVideoProps> = ({
  videoUrl,
  posterUrl,
  candidateId
}) => {
  const { openVideoDialog, generateShareableLink } = useServices();
  
  const handleWatchVideo = () => {
    if (videoUrl) {
      openVideoDialog(videoUrl, posterUrl);
    }
  };
  
  const handleShareVideo = async () => {
    await generateShareableLink(videoUrl, candidateId);
  };
  
  if (!videoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <Video className="h-4 w-4" /> Video Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No video introduction available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Video className="h-4 w-4" /> Video Introduction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="aspect-video bg-muted rounded-md overflow-hidden relative cursor-pointer"
          onClick={handleWatchVideo}
        >
          {/* Video thumbnail with play button */}
          <img 
            src={posterUrl || videoUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-primary rounded-full p-3">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleWatchVideo} 
            variant="secondary" 
            className="flex-1"
          >
            <Maximize className="mr-2 h-4 w-4" /> Watch Full Video
          </Button>
          
          <Button 
            onClick={handleShareVideo} 
            variant="outline"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
