import { motion } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';

interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, level, onRestart, onMenu }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="backdrop-blur-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center border-4 border-white/50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}assets/images/semon_speech_lose.png`}
            alt="Семён грустит" 
            className="w-72 h-auto mx-auto mb-4 drop-shadow-2xl"
          />
          <h2 className="text-4xl font-bold text-red-600 mb-4">
            Конец игры
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-8"
        >
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
            <p className="text-sm text-gray-600">Ваш счёт</p>
            <p className="text-4xl font-bold text-gray-800">{score}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3">
            <p className="text-sm text-gray-600">Достигнутый уровень</p>
            <p className="text-2xl font-bold text-gray-800">{level}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Играть снова
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="w-full px-6 py-3 bg-white/80 hover:bg-white text-gray-700 font-semibold rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            В меню
          </motion.button>
        </motion.div>

        <p className="text-sm text-gray-500 mt-4">
          Нажми C для повторной игры или Q для выхода
        </p>
      </motion.div>
    </motion.div>
  );
};

