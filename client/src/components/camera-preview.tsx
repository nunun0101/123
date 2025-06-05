import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, RotateCcw, Download, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/use-camera';
import { useCanvas } from '@/hooks/use-canvas';

interface CameraPreviewProps {
  onPhotoCapture?: (imageUrl: string) => void;
}

export function CameraPreview({ onPhotoCapture }: CameraPreviewProps) {
  const { settings, isLoading, error, videoRef, startCamera, switchCamera } = useCamera();
  const { state, canvasRef, capturePhoto, downloadPhoto } = useCanvas();
  const [showCaptured, setShowCaptured] = useState(false);

  useEffect(() => {
    // Set canvas dimensions when video loads
    if (videoRef.current && settings.isActive) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        if (canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        }
      });
    }
  }, [settings.isActive, videoRef, canvasRef]);

  const handleCapture = () => {
    if (!videoRef.current || !settings.isActive) return;

    const imageUrl = capturePhoto(videoRef.current);
    if (imageUrl) {
      setShowCaptured(true);
      onPhotoCapture?.(imageUrl);
    }
  };

  const handleRetake = () => {
    setShowCaptured(false);
  };

  return (
    <div className="relative">
      {/* Camera Preview Container */}
      <div className="w-full max-w-2xl mx-auto bg-gray-600 rounded-3xl overflow-hidden aspect-[4/3] relative">
        {/* Video Element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${settings.isActive && !showCaptured ? 'block' : 'hidden'}`}
          autoPlay
          muted
          playsInline
        />

        {/* Canvas for captured photo */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover ${showCaptured ? 'block' : 'hidden'}`}
        />

        {/* Placeholder state */}
        {!settings.isActive && !showCaptured && (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-lg font-medium mb-2">Truy cập camera bị từ chối.</p>
            <Button
              onClick={startCamera}
              className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold mt-4"
              disabled={isLoading}
            >
              <Camera className="mr-2 h-5 w-5" />
              Camera không hoạt động?
            </Button>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <Loader className="animate-spin text-4xl mb-4 mx-auto" />
              <p>Đang khởi động camera...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-white text-center p-6">
              <p className="text-lg font-semibold mb-2">Truy cập camera bị từ chối.</p>
              <Button
                onClick={startCamera}
                className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold"
              >
                <Camera className="mr-2 h-5 w-5" />
                Camera không hoạt động?
              </Button>
            </div>
          </div>
        )}

        {/* Sticker overlay for live preview */}
        {settings.isActive && !showCaptured && (
          <div className="absolute inset-0 pointer-events-none">
            {state.stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="absolute pointer-events-none"
                style={{
                  left: sticker.x - sticker.size / 2,
                  top: sticker.y - sticker.size / 2,
                  fontSize: sticker.size,
                  transform: `rotate(${sticker.rotation}deg)`,
                }}
              >
                {sticker.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Hidden capture button for programmatic access */}
        <button
          data-camera-capture
          onClick={handleCapture}
          className="hidden"
          disabled={!settings.isActive}
        />
      </div>
    </div>
  );
}
