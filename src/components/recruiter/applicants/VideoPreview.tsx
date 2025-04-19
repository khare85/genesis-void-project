
import { Play } from "lucide-react";

const VideoPreview = ({ src }: { src: string }) => (
  <div className="relative w-full h-full min-h-[180px] rounded-md overflow-hidden bg-black">
    <div className="absolute inset-0 flex items-center justify-center">
      <Play className="text-white h-8 w-8 z-10" />
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
    <video 
      className="w-full h-full object-cover" 
      src={src}
      poster={src ? "" : undefined} 
      controls={false}
      muted
      loop
    />
    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
      30s intro
    </div>
  </div>
);

export default VideoPreview;
