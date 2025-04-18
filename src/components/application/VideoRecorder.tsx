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
  videoStorageUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoURL, setVideoURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const checkCameraPermissions = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissionStatus.state === 'denied') {
        throw new Error('Camera access denied by user.');
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      setCameraError('Please grant camera access to proceed.');
    }
  };

  const startRecording = async () => {
    setIsLoading(true);
    setCameraError(null);

    try {
      await checkCameraPermissions();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access.');
      }

      if (!videoRef.current) {
        throw new Error('Video element reference is not available');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      videoRef.current.srcObject = stream;

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

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      let time = 0;
      setRecordingTime(time);
      timerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);

        if (time >= 30) {
          stopRecording();
        }
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      const errorMessage = err.name === 'NotAllowedError'
        ? 'Camera access denied. Please allow camera access and try again.'
        : err.name === 'NotFoundError'
        ? 'No camera found. Please connect a camera and try again.'
        : 'Failed to access camera. Please try again.';
      setCameraError(errorMessage);
    } finally {
      setIsLoading(false);
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
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setVideoURL('');
    setRecordedBlob(null);
    setRecordingTime(0);
    setCameraError(null);
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
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium">Loading camera...</p>
            </div>
          ) : cameraError ? (
            <div className="text-center p-4">
              <Video className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-500">{cameraError}</p>
              <Button
                type="button"
                onClick={startRecording}
                className="mt-4 bg-[#3054A5] hover:bg-[#264785]"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : !videoURL && !isRecording ? (
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Your video will appear here</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted={isRecording}
                playsInline
                src={videoURL || undefined}
                controls={!!videoURL}
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

        {/* Buttons */}
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
            <Button type="button" onClick={stopRecording} variant="destructive">
              Stop Recording
            </Button>
          ) : (
            <>
              <Button type="button" onClick={resetRecording} variant="outline">
                Record Again
              </Button>
            </>
          )}
        </div>

        {/* Success Message */}
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