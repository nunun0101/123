import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CameraPreview } from '@/components/camera-preview';
import { FilterPanel } from '@/components/filter-panel';
import { FramePanel } from '@/components/frame-panel';
import { StickerPanel } from '@/components/sticker-panel';
import { useCanvas } from '@/hooks/use-canvas';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function PhotoBooth() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState("3");
  const [timeDelay, setTimeDelay] = useState("3");
  const { reset, downloadPhoto } = useCanvas();

  const handlePhotoCapture = (imageUrl: string) => {
    setCapturedPhotoUrl(imageUrl);
    setShowPhotoModal(true);
  };

  const handleRetake = () => {
    setShowPhotoModal(false);
    setCapturedPhotoUrl(null);
  };

  const { state } = useCanvas();
  
  const savePhotoMutation = useMutation({
    mutationFn: async (photoData: any) => {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: JSON.stringify(photoData),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
    }
  });

  const handleSavePhoto = () => {
    if (capturedPhotoUrl && state.stickers) {
      const photoData = {
        imageUrl: capturedPhotoUrl,
        filters: {
          currentFilter: state.currentFilter,
          currentFrame: state.currentFrame,
          stickers: state.stickers
        },
        photoCount: parseInt(photoCount),
        userId: null // For guest users
      };
      
      savePhotoMutation.mutate(photoData);
    }
    
    downloadPhoto();
    setShowPhotoModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Select value={photoCount} onValueChange={setPhotoCount}>
            <SelectTrigger className="w-28 h-8 rounded-lg border-gray-200 text-sm">
              <div className="flex items-center">
                <span className="mr-1 text-xs">📷</span>
                <SelectValue placeholder="3 ảnh" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 ảnh</SelectItem>
              <SelectItem value="3">3 ảnh</SelectItem>
              <SelectItem value="4">4 ảnh</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeDelay} onValueChange={setTimeDelay}>
            <SelectTrigger className="w-32 h-8 rounded-lg border-gray-200 text-sm">
              <div className="flex items-center">
                <span className="mr-1 text-xs">⏰</span>
                <SelectValue placeholder="Trễ 3 giây" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Trễ 3 giây</SelectItem>
              <SelectItem value="5">Trễ 5 giây</SelectItem>
              <SelectItem value="10">Trễ 10 giây</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Upload className="mr-1 h-3 w-3" />
          Tải lên ảnh
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] gap-4">
        {/* Left Sidebar */}
        <div className="lg:w-64 bg-pink-100/50 p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="text-pink-600 text-xs leading-relaxed mb-3">
              Tải app để có thêm nhiều tính năng!
            </div>
            
            <div className="bg-white p-3 rounded-lg">
              <div className="w-16 h-16 bg-black mx-auto mb-2">
                <div className="w-full h-full bg-gradient-to-br from-black to-gray-800 rounded flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array.from({length: 9}).map((_, i) => (
                      <div key={i} className={`w-1 h-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-600">Quét QR</div>
            </div>
          </div>

          <FilterPanel />
        </div>

        {/* Center Camera Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <CameraPreview onPhotoCapture={handlePhotoCapture} />
          </div>
          
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-1 mt-4 mb-3 justify-center">
            <span className="px-3 py-1 bg-pink-200 text-pink-700 rounded-full text-xs font-medium">
              Bình thường
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              Mềm mại
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              Đồng quê
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              Trắng đen
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              Cổ điển
            </span>
          </div>

          {/* Capture Button */}
          <Button 
            className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            onClick={() => document.querySelector<HTMLButtonElement>('[data-camera-capture]')?.click()}
          >
            <span className="mr-2">📸</span>
            Bắt đầu chụp
          </Button>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-64 p-4">
          <div className="space-y-4">
            <StickerPanel />
            <FramePanel />
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-pink-600 flex items-center">
              <span className="mr-2">📸</span>
              Ảnh của bạn!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            {capturedPhotoUrl && (
              <div className="bg-white rounded-2xl p-4 mb-6">
                <img
                  src={capturedPhotoUrl}
                  alt="Captured photo"
                  className="max-w-full rounded-xl mx-auto"
                />
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleRetake}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
              >
                <span className="mr-2">🔄</span>
                Chụp lại
              </Button>
              <Button
                onClick={handleSavePhoto}
                className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
              >
                <span className="mr-2">💾</span>
                Lưu ảnh
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
