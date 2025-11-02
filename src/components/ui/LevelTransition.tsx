import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LevelTransitionProps {
  level: number;
  fact: string;
  onComplete: () => void;
}

export const LevelTransition: React.FC<LevelTransitionProps> = ({ level, fact }) => {
  // Выбираем изображение Семёна в зависимости от уровня
  const semonImage = level === 2 
    ? '/assets/images/semon_speech_level2.png'
    : '/assets/images/semon_speech_level3.png';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="backdrop-blur-md bg-white/90 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-4 border-white/50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-6"
        >
          <img 
            src={semonImage}
            alt={`Семён уровень ${level}`}
            className="w-64 h-auto mx-auto mb-6 drop-shadow-2xl"
          />
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl text-4xl font-bold shadow-lg">
            <Sparkles className="w-8 h-8" />
            Уровень {level}!
            <Sparkles className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-blue-600 font-bold text-xl mb-4">
            Знаете ли вы?
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {fact}
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="animate-pulse">●</div>
            <div className="animate-pulse delay-100">●</div>
            <div className="animate-pulse delay-200">●</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

