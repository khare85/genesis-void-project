
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl: string | undefined;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <Card>
      <CardContent className="p-6">
        {videoUrl ? (
          <video 
            controls
            className="w-full aspect-video"
            src={videoUrl}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No video introduction available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
