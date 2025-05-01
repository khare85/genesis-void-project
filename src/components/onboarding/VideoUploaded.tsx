
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface VideoUploadedProps {
  videoUrl: string;
  recordedBlob: Blob | null;
  onComplete: (videoBlob: Blob | null, videoUrl: string | null) => void;
}

const VideoUploaded: React.FC<VideoUploadedProps> = ({ videoUrl, recordedBlob, onComplete }) => {
  return (
    <div className="w-full space-y-4">
      <div className="border rounded-lg p-6 bg-green-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Video uploaded successfully</h3>
            <p className="text-sm text-muted-foreground">
              Your 30-second introduction is ready
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => onComplete(recordedBlob, videoUrl)}
          className="bg-primary hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default VideoUploaded;
