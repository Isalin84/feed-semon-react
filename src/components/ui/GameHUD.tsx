import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { GameState } from '../../types/game.types';

interface GameHUDProps {
  gameState: GameState;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  const progressPercent = (gameState.score / gameState.targetScore) * 100;

  return (
    <div className="absolute top-4 left-4 right-4 pointer-events-none z-20">
      <div className="flex items-start justify-between gap-4">
        {/* Left panel - Stats */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="backdrop-blur-md bg-white/80 rounded-2xl shadow-lg p-4 border border-white/50"
        >
          <div className="flex flex-col gap-3">
            {/* Score */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <img src={`${import.meta.env.BASE_URL}assets/images/icon_star.png`} alt="⭐" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Очки</p>
                <p className="text-2xl font-bold text-green-600">{gameState.score}</p>
              </div>
            </div>

            {/* Lives */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <img src={`${import.meta.env.BASE_URL}assets/images/icon_heart.png`} alt="❤️" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Жизни</p>
                <p className={`text-2xl font-bold ${gameState.lives < 3 ? 'text-red-600' : 'text-gray-800'}`}>
                  {gameState.lives}/{gameState.maxLives}
                </p>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Уровень</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.level}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right panel - Progress */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="backdrop-blur-md bg-white/80 rounded-2xl shadow-lg p-4 border border-white/50 min-w-[200px]"
        >
          <p className="text-xs text-gray-500 font-medium mb-2">
            Цель: {gameState.targetScore}
          </p>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
          <p className="text-xs text-right mt-1 text-gray-600 font-medium">
            {Math.min(progressPercent, 100).toFixed(0)}%
          </p>
        </motion.div>
      </div>

      {/* Combo display */}
      {gameState.comboCounter > 0 && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="absolute top-32 left-1/2 -translate-x-1/2"
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-3xl sm:text-5xl px-8 py-4 rounded-2xl shadow-2xl border-4 border-white/50">
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            >
              COMBO x{gameState.comboMultiplier}!
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

