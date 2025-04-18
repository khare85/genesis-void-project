
import { useState, useRef, useEffect } from 'react';

interface UseVideoRecorderProps {
  maxDuration?: number;
}

export const useVideoRecorder = ({ maxDuration = 30 }: UseVideoRecorderProps = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoURL, setVideoURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopMediaTracks();
    };
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      // Safari-specific handling - play the video when it can
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
          });
        }
      };
    }
  }, [stream, videoRef.current]);

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setIsLoading(true);
    setError(null);
    stopMediaTracks();
    chunksRef.current = [];

    try {
      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Create a new MediaRecorder instance
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      let mediaRecorder;
      
      // Safari may not support the specified MIME type
      try {
        mediaRecorder = new MediaRecorder(mediaStream, options);
      } catch (e) {
        // Fallback to default MIME type
        mediaRecorder = new MediaRecorder(mediaStream);
      }
      
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop event
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        setRecordedBlob(blob);
        stopMediaTracks();
        setStream(null);
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start timer
      let time = 0;
      setRecordingTime(time);
      timerRef.current = setInterval(() => {
        time += 1;
        setRecordingTime(time);

        if (time >= maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera access and try again.'
          : err.name === 'NotFoundError'
          ? 'No camera found. Please connect a camera and try again.'
          : err.name === 'NotSupportedError'
          ? 'Your browser does not support video recording. Try using Chrome, Firefox, or Edge.'
          : 'Failed to access camera. Please try again.'
      );
      stopMediaTracks();
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
    stopMediaTracks();
    setStream(null);
    setVideoURL('');
    setRecordedBlob(null);
    setRecordingTime(0);
    setError(null);
  };

  return {
    isRecording,
    recordingTime,
    recordedBlob,
    videoURL,
    isLoading,
    error,
    videoRef,
    startRecording,
    stopRecording,
    resetRecording,
    stream,
  };
};
