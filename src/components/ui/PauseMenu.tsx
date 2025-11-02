import { motion } from 'framer-motion';
import { Play, Home, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { useState } from 'react';
import { audioManager } from '../../utils/audioManager';
import { useFullscreen } from '../../hooks/useFullscreen';

interface PauseMenuProps {
  onResume: () => void;
  onMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onMenu }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  const handleToggleMute = () => {
    if (isMuted) {
      audioManager.setMusicVolume(0.3);
      setIsMuted(false);
    } else {
      audioManager.setMusicVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="backdrop-blur-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center border-4 border-blue-400"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <h2 className="text-5xl font-bold text-blue-600 mb-6">
            ПАУЗА
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResume}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6" />
            Продолжить
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleMute}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isMuted ? 'Включить звук' : 'Выключить звук'}
          </motion.button>

          {isSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              {isFullscreen ? 'Выйти из полноэкранного' : 'Полноэкранный режим'}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="w-full px-6 py-3 bg-white/80 hover:bg-white text-gray-700 font-semibold rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            В главное меню
          </motion.button>
        </motion.div>

        <p className="text-sm text-gray-500 mt-6">
          Пробел - продолжить | ESC - в меню
        </p>
      </motion.div>
    </motion.div>
  );
};

