import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying && videoLoaded) {
          handlePlay();
        } else {
          handleSkip();
        }
      } else if (e.code === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, videoLoaded]);

  // Timeout для загрузки видео (15 секунд для iOS и медленного интернета)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.warn('Video loading timeout (15s), showing fallback');
        setVideoError(true);
      }
    }, 15000); // 15 секунд для медленного интернета и iOS
    
    return () => clearTimeout(timeout);
  }, [videoLoaded, videoError]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.warn('Video play failed:', error);
        setVideoError(true);
      });
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  };

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    console.warn('Video failed to load');
    setVideoError(true);
  };

  const handleVideoEnd = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border-4 border-amber-400"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors duration-200 group"
            title="Пропустить (ESC)"
          >
            <X className="w-6 h-6 text-gray-700 group-hover:text-red-600" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-2">
                🐹 Привет от Семёна!
              </h2>
              <p className="text-gray-600">
                Узнай правила игры перед стартом
              </p>
            </div>

            {/* Video container */}
            {!videoError ? (
              <div className="relative bg-black rounded-xl overflow-hidden mb-6 aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  playsInline
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  muted
                  preload="auto"
                  onCanPlay={() => console.log('Video can play now')}
                  onLoadedData={handleLoadedData}
                  onEnded={handleVideoEnd}
                  onError={handleError}
                >
                  <source src={`${import.meta.env.BASE_URL}assets/videos/intro_video.mp4`} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>

                {/* Play overlay */}
                {!isPlaying && videoLoaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={handlePlay}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-6 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl transition-colors duration-200"
                    >
                      <Play className="w-12 h-12 text-white" fill="currentColor" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Loading indicator */}
                {!videoLoaded && !videoError && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                      <p>Загрузка видео...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback if video fails */
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-8 mb-6 text-center">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/images/semon_speech_welcome.png`}
                  alt="Семён приветствует" 
                  className="w-64 h-auto mx-auto mb-4 drop-shadow-lg"
                />
                <div className="text-left max-w-2xl mx-auto space-y-3 text-gray-700">
                  <p>📺 <strong>Видео недоступно</strong>, но ты можешь начать играть!</p>
                  <p>🎮 <strong>Цель:</strong> Помоги Семёну поймать полезные овощи</p>
                  <p>⌨️ <strong>Управление:</strong> Стрелки ← → или касание экрана</p>
                  <p>❤️ <strong>У тебя 5 жизней.</strong> Пройди 3 уровня!</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 justify-center">
              {!isPlaying && videoLoaded && !videoError && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Смотреть видео
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg transition-colors duration-200"
              >
                {isPlaying ? 'Пропустить' : 'Начать игру'}
              </motion.button>
            </div>

            {/* Hint */}
            <p className="text-center text-sm text-gray-500 mt-4">
              {isPlaying ? 'ESC - пропустить видео' : 'ПРОБЕЛ - начать игру'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

