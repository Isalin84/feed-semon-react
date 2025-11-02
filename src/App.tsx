import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IntroVideo } from './components/ui/IntroVideo';
import { MainMenu } from './components/ui/MainMenu';
import { GameScreen } from './components/game/GameScreen';
import { audioManager } from './utils/audioManager';
import type { GameScreen as GameScreenType } from './types/game.types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('intro');

  useEffect(() => {
    // Инициализация аудио при первом взаимодействии (включая мобильные touch события)
    const initAudio = () => {
      audioManager.init();
      
      // Разблокировка audio context для iOS
      if (typeof window !== 'undefined') {
        const unlockAudio = () => {
          const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            audioContext.resume().then(() => {
              console.log('Audio context unlocked for mobile');
            }).catch((err: unknown) => {
              console.warn('Audio context unlock failed:', err);
            });
          }
        };
        unlockAudio();
      }
      
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('touchend', initAudio);
    };

    window.addEventListener('click', initAudio, { passive: true });
    window.addEventListener('keydown', initAudio, { passive: true });
    window.addEventListener('touchstart', initAudio, { passive: true });
    window.addEventListener('touchend', initAudio, { passive: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('touchend', initAudio);
    };
  }, []);

  const handleIntroComplete = () => {
    setCurrentScreen('menu');
    audioManager.playMusic();
  };

  const handleStartGame = () => {
    setCurrentScreen('playing');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    audioManager.playMusic();
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'intro' && (
          <IntroVideo key="intro" onComplete={handleIntroComplete} />
        )}
        
        {currentScreen === 'menu' && (
          <MainMenu key="menu" onStart={handleStartGame} />
        )}
        
        {currentScreen === 'playing' && (
          <GameScreen key="game" onBackToMenu={handleBackToMenu} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
