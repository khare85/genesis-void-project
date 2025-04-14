
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2, CheckCircle } from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob | null) => void;
  isUploadingVideo: boolean;
  videoStorageUrl: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  isUploadingVideo,
  videoStorageUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoURL, setVideoURL] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute to prevent feedback
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setVideoURL(videoURL);
        setRecordedBlob(blob);
        onVideoRecorded(blob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Clear video srcObject
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set timer for 30 seconds
      let time = 0;
      setRecordingTime(time);
      timerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);
        
        if (time >= 30) {
          stopRecording();
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Could not access camera and microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const resetRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoURL('');
    setRecordedBlob(null);
    setRecordingTime(0);
    onVideoRecorded(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Video Introduction (30 seconds)</h2>
      <div className="border rounded-lg p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Record a brief introduction about yourself and why you're interested in this position.
        </div>
        
        {/* Video display area */}
        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
          {!videoURL && !isRecording ? (
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Your video will appear here</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay={true}
                muted={isRecording}
                src={videoURL || undefined} 
                controls={!!videoURL && !isRecording}
              />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white"></span>
                  Recording: {recordingTime}s / 30s
                </div>
              )}
              {isUploadingVideo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Uploading video...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-3 justify-center">
          {!isRecording && !videoURL ? (
            <Button 
              type="button"
              onClick={startRecording}
              className="bg-[#3054A5] hover:bg-[#264785]"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : isRecording ? (
            <Button 
              type="button"
              onClick={stopRecording}
              variant="destructive"
            >
              Stop Recording
            </Button>
          ) : (
            <>
              <Button 
                type="button"
                onClick={resetRecording}
                variant="outline"
              >
                Record Again
              </Button>
            </>
          )}
        </div>
        {videoStorageUrl && (
          <p className="text-xs text-green-600 mt-4 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Video uploaded successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
