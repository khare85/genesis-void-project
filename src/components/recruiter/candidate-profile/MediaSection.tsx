
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share, PlayCircle } from 'lucide-react';
import { FileText, Video } from 'lucide-react';

interface MediaSectionProps {
  resumeUrl?: string;
  videoUrl?: string;
  candidateAvatar?: string;
  onDownloadResume: () => void;
  onShareVideo: () => void;
  onPlayVideo: () => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  resumeUrl,
  videoUrl,
  candidateAvatar,
  onDownloadResume,
  onShareVideo,
  onPlayVideo
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {resumeUrl && (
        <Card className="shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center text-lg font-medium text-gray-800">
              <FileText className="mr-2 h-5 w-5 text-gray-600" />
              Resume
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDownloadResume}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden bg-gray-50">
              <iframe 
                src={resumeUrl} 
                className="w-full h-[400px] border-0"
                title="Resume Preview"
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {videoUrl && (
        <Card className="shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center text-lg font-medium text-gray-800">
              <Video className="mr-2 h-5 w-5 text-gray-600" />
              Video Introduction
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShareVideo}
              className="h-8 w-8 p-0"
            >
              <Share className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-md overflow-hidden aspect-video bg-gray-100">
              <video 
                src={videoUrl} 
                poster={candidateAvatar} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={onPlayVideo}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                <div 
                  className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 cursor-pointer transition-colors"
                  onClick={onPlayVideo}
                >
                  <PlayCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaSection;
