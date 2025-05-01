
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useServices = () => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  
  const openVideoDialog = (videoUrl: string, poster?: string) => {
    setCurrentVideo(videoUrl);
    setPosterUrl(poster || null);
    setVideoDialogOpen(true);
  };
  
  const closeVideoDialog = () => {
    setVideoDialogOpen(false);
  };
  
  const generateShareableLink = async (videoUrl: string, candidateId: string) => {
    try {
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
      toast.success('Shareable link copied to clipboard! Link valid for 7 days.');
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      toast.error('Failed to generate shareable link');
      return null;
    }
  };
  
  const VideoDialog = () => {
    if (!currentVideo) return null;
    
    return (
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="aspect-video w-full">
            <video 
              src={currentVideo} 
              poster={posterUrl || undefined}
              controls 
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    VideoDialog,
    openVideoDialog,
    closeVideoDialog,
    generateShareableLink
  };
};
