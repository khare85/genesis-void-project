
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize, Share } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoUrl: string | undefined;
  posterUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, posterUrl }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenFullscreen = () => {
    setIsDialogOpen(true);
  };

  const handleShareVideo = async () => {
    try {
      if (!videoUrl) {
        toast.error('No video available to share');
        return;
      }
      
      // Extract the path from the URL
      const urlObj = new URL(videoUrl);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1];
      const filePath = pathParts.slice(2).join('/');
      
      // Generate a signed URL that expires in 7 days (604800 seconds)
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 604800);
      
      if (error) {
        throw error;
      }
      
      // Copy the URL to clipboard
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('Shareable video link copied to clipboard! Link valid for 7 days.');
    } catch (error) {
      console.error('Error generating shareable link:', error);
      toast.error('Failed to generate shareable link');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Video Introduction</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {videoUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
              <img 
                src={posterUrl || videoUrl} 
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={handleOpenFullscreen}
              >
                <div className="bg-white/90 rounded-full p-3">
                  <Maximize className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={handleOpenFullscreen}
              >
                Watch Video
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShareVideo}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No video introduction available</p>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            {videoUrl && (
              <video 
                src={videoUrl} 
                poster={posterUrl}
                controls 
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VideoPlayer;
