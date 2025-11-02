import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Home, Download, Share2 } from 'lucide-react';
import { exportToImage, copyToClipboard } from '../../utils/shareImage';
import { NameInputModal } from './NameInputModal';
import { VictoryExportView } from './VictoryExportView';

interface VictoryProps {
  score: number;
  onMenu: () => void;
}

export const Victory: React.FC<VictoryProps> = ({ score, onMenu }) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const [exportAction, setExportAction] = useState<'download' | 'share' | null>(null);
  const [playerName, setPlayerName] = useState('');

  const handleExportClick = () => {
    setExportAction('download');
    setShowNameInput(true);
  };

  const handleShareClick = () => {
    setExportAction('share');
    setShowNameInput(true);
  };

  const handleNameSubmit = async (name: string) => {
    setPlayerName(name);
    setShowNameInput(false);

    // Даём больше времени на рендер VictoryExportView и загрузку изображений
    setTimeout(async () => {
      try {
        if (exportAction === 'download') {
          await exportToImage('victory-export', `semon-victory-${name}-${score}.png`);
        } else if (exportAction === 'share') {
          await copyToClipboard('victory-export');
        }
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        // Очищаем состояние через небольшой промежуток
        setTimeout(() => {
          setExportAction(null);
          setPlayerName('');
        }, 500);
      }
    }, 500);
  };
  return (
    <>
      {/* Hidden export view */}
      {playerName && <VictoryExportView playerName={playerName} score={score} />}

      {/* Name input modal */}
      <AnimatePresence>
        {showNameInput && (
          <NameInputModal
            onSubmit={handleNameSubmit}
            onClose={() => {
              setShowNameInput(false);
              setExportAction(null);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-900/90 via-green-900/90 to-emerald-900/90 backdrop-blur-sm flex items-center justify-center p-4"
      >
      <motion.div
        id="victory-screen"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="backdrop-blur-md bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center border-4 border-yellow-300"
      >
        {/* Confetti animation */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * 400 - 200, opacity: 1 }}
              animate={{
                y: 600,
                rotate: Math.random() * 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5],
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative z-10"
        >
          <img 
            src={`${import.meta.env.BASE_URL}assets/images/semon_speech_win.png`}
            alt="Семён радуется" 
            className="w-72 h-auto mx-auto mb-4 drop-shadow-2xl"
          />
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-2xl mb-4">
            <Trophy className="w-8 h-8" />
            <h2 className="text-4xl font-bold">ПОБЕДА!</h2>
            <Trophy className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10"
        >
          <p className="text-xl text-gray-700 mb-6 font-semibold">
            Вы накормили Семёна!
          </p>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-600" fill="currentColor" />
              <p className="text-sm text-gray-600 font-medium">Итоговый счёт</p>
            </div>
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              {score}
            </p>
          </div>

          <div className="flex gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportClick}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              title="Скачать как картинку"
            >
              <Download className="w-5 h-5" />
              Скачать
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareClick}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              title="Копировать в буфер"
            >
              <Share2 className="w-5 h-5" />
              Поделиться
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenu}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            В главное меню
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Сохрани свою победу и поделись с друзьями! 🎉
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
    </>
  );
};

