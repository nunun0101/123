import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCanvas } from '@/hooks/use-canvas';

const kawaiiStickers = [
  '🎀', '💖', '🌸', '✨', '🦄', '🌙', '⭐', '🎈',
  '🎭', '🌺', '🧁', '🍭', '🎪', '🎨', '🎀', '💕'
];

export function StickerPanel() {
  const { addSticker } = useCanvas();

  const handleStickerClick = (emoji: string) => {
    // Add sticker at random position near center
    const x = 300 + Math.random() * 100; // Random position
    const y = 200 + Math.random() * 100; 
    addSticker(emoji, x, y);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
      <h3 className="text-sm font-bold text-pink-600 mb-3 flex items-center">
        <span className="mr-1">🎀</span>
        Sticker
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {kawaiiStickers.map((sticker, index) => (
          <motion.div
            key={index}
            className="cursor-pointer text-lg text-center p-2 hover:bg-pink-100 rounded-lg transition-all duration-300 flex items-center justify-center aspect-square"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStickerClick(sticker)}
          >
            {sticker}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
