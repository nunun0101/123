export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface Filter {
  id: string;
  name: string;
  emoji: string;
  effect: 'none' | 'beauty' | 'vintage' | 'warm' | 'cool';
}

export interface Frame {
  id: string;
  name: string;
  emoji: string;
  type: 'none' | 'heart' | 'flower' | 'star' | 'rainbow';
}

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  isActive: boolean;
}

export interface CanvasState {
  stickers: Sticker[];
  currentFilter: Filter['effect'];
  currentFrame: Frame['type'];
  lastCapturedImage: string | null;
}
