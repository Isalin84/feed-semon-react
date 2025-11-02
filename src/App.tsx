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
    // Инициализация аудио при первом взаимодействии
    const initAudio = () => {
      audioManager.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
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
