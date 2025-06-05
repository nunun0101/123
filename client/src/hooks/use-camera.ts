import { useState, useRef, useCallback } from 'react';
import { CameraSettings } from '@/types/photo-booth';

export function useCamera() {
  const [settings, setSettings] = useState<CameraSettings>({
    facingMode: 'user',
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: settings.facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setSettings(prev => ({ ...prev, isActive: true }));
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied or not available. Please check your camera permissions.');
    } finally {
      setIsLoading(false);
    }
  }, [settings.facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setSettings(prev => ({ ...prev, isActive: false }));
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacingMode = settings.facingMode === 'user' ? 'environment' : 'user';
    setSettings(prev => ({ ...prev, facingMode: newFacingMode }));
    
    if (settings.isActive) {
      await startCamera();
    }
  }, [settings.facingMode, settings.isActive, startCamera]);

  return {
    settings,
    isLoading,
    error,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
