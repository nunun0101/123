import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCanvas } from '@/hooks/use-canvas';
import { Filter } from '@/types/photo-booth';

const filters: Filter[] = [
  { id: '1', name: 'Bình thường', emoji: '📷', effect: 'none' },
  { id: '2', name: 'Mềm mại', emoji: '😍', effect: 'beauty' },
  { id: '3', name: 'Đồng quê', emoji: '🌾', effect: 'vintage' },
  { id: '4', name: 'Trắng đen', emoji: '⚫', effect: 'cool' },
  { id: '5', name: 'Cổ điển', emoji: '🎞️', effect: 'warm' },
  { id: '6', name: 'Ảnh cũ', emoji: '📸', effect: 'vintage' },
];

export function FilterPanel() {
  const { state, setFilter } = useCanvas();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
      <h3 className="text-sm font-bold text-pink-600 mb-3 flex items-center">
        <span className="mr-1">🎨</span>
        Bộ lọc
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setFilter(filter.effect)}
              className={`w-full p-2 rounded-lg font-medium transition-all duration-300 text-xs ${
                state.currentFilter === filter.effect
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1 text-xs">{filter.emoji}</span>
              {filter.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
