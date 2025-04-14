import { useState, useRef, useEffect } from 'react';

export interface VideoRecordingState {
  isRecording: boolean;
  recordingTime: number;
  recordedBlob: Blob | null;
  videoURL: string;
  hasError: boolean;
  errorMessage: string;
}

export const useVideoRecording = (maxDuration: number = 30) => {
  const [state, setState] = useState<VideoRecordingState>({
    isRecording: false,
    recordingTime: 0,
    recordedBlob: null,
    videoURL: '',
    hasError: false,
    errorMessage: '',
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
      clearRecordingTimer();
    };
  }, []);

  const clearRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const initializeCamera = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, hasError: false, errorMessage: '' }));
      
      // Stop any existing streams
      stopMediaTracks();
      
      // Request camera access
      console.info('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.info(`Camera access granted, tracks: ${stream.getTracks().length}`);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Prevent feedback
        
        // Make sure the video plays
        try {
          await videoRef.current.play();
        } catch (e) {
          console.error("Error playing video:", e);
          setState(prev => ({
            ...prev,
            hasError: true,
            errorMessage: 'Could not play video feed'
          }));
          return false;
        }
      } else {
        console.error('Video element not ready');
        setState(prev => ({
          ...prev,
          hasError: true,
          errorMessage: 'Video element not ready'
        }));
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: 'Could not access camera and microphone'
      }));
      return false;
    }
  };

  const startRecording = async () => {
    chunksRef.current = [];
    
    const cameraReady = await initializeCamera();
    if (!cameraReady || !streamRef.current) {
      console.error('Camera not ready, cannot start recording');
      return;
    }
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          recordedBlob: blob,
          videoURL: videoURL
        }));
        
        // Stop tracks but keep video displayed
        stopMediaTracks();
        
        // Clear the srcObject but keep the video URL
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = videoURL;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true, recordingTime: 0 }));
      
      // Set timer
      let time = 0;
      timerRef.current = setInterval(() => {
        time += 1;
        setState(prev => ({ ...prev, recordingTime: time }));
        
        if (time >= maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: 'Could not start recording'
      }));
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      clearRecordingTimer();
    }
  };
  
  const resetRecording = () => {
    stopMediaTracks();
    clearRecordingTimer();
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    }
    
    setState({
      isRecording: false,
      recordingTime: 0,
      recordedBlob: null,
      videoURL: '',
      hasError: false,
      errorMessage: '',
    });
  };

  return {
    ...state,
    videoRef,
    startRecording,
    stopRecording,
    resetRecording,
    initializeCamera
  };
};
