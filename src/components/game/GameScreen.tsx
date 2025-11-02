import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause } from 'lucide-react';
import { GameHUD } from '../ui/GameHUD';
import { GameOver } from '../ui/GameOver';
import { Victory } from '../ui/Victory';
import { LevelTransition } from '../ui/LevelTransition';
import { PauseMenu } from '../ui/PauseMenu';
import type { GameState, GameObject, Particle } from '../../types/game.types';
import { GAME_CONFIG, OBJECT_CONFIGS, SPAWN_PROBABILITIES, OBJECT_IMAGES, COLORS } from '../../utils/constants';
import { checkCollision } from '../../utils/collision';
import { getRandomFact } from '../../utils/educationalFacts';
import { audioManager } from '../../utils/audioManager';

interface GameScreenProps {
  onBackToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: GAME_CONFIG.INITIAL_LIVES,
    maxLives: GAME_CONFIG.MAX_LIVES,
    level: 1,
    targetScore: GAME_CONFIG.LEVEL_1_TARGET,
    comboCounter: 0,
    comboMultiplier: 1,
    lastCatchTime: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    victory: false,
  });

  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [transitionFact, setTransitionFact] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [playerX, setPlayerX] = useState(GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_WIDTH / 2);
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [playerImage, setPlayerImage] = useState<HTMLImageElement | null>(null);

  const animationFrameRef = useRef<number | undefined>(undefined);
  const objectSpawnCounterRef = useRef(0);
  const objectSpeedRef = useRef(GAME_CONFIG.INITIAL_OBJECT_SPEED);
  const maxObjectsRef = useRef(GAME_CONFIG.MAX_OBJECTS);

  // Load images
  useEffect(() => {
    const loadedImages: Record<string, HTMLImageElement> = {};
    
    // Load object images
    Object.entries(OBJECT_IMAGES).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      loadedImages[key] = img;
    });

    // Load player image
    const player = new Image();
    player.src = '/assets/images/semion.png';
    setPlayerImage(player);

    // Load background
    const bg = new Image();
    bg.src = '/assets/images/background.png';
    setBackgroundImage(bg);

    setImages(loadedImages);
    setGameState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        setPlayerSpeed(-GAME_CONFIG.PLAYER_SPEED);
      } else if (e.code === 'ArrowRight') {
        setPlayerSpeed(GAME_CONFIG.PLAYER_SPEED);
      } else if (e.code === 'KeyC' && gameState.gameOver) {
        e.preventDefault();
        handleRestart();
      } else if (e.code === 'KeyQ' && gameState.gameOver) {
        e.preventDefault();
        onBackToMenu();
      } else if (e.code === 'Space' && gameState.victory) {
        e.preventDefault();
        onBackToMenu();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        if (!gameState.gameOver && !gameState.victory && !showLevelTransition) {
          togglePause();
        }
      } else if (e.code === 'Space' && isPaused) {
        e.preventDefault();
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        setPlayerSpeed(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.gameOver, gameState.victory]);

  // Touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const centerX = rect.width / 2;

      if (x < centerX) {
        setPlayerSpeed(-GAME_CONFIG.PLAYER_SPEED);
      } else {
        setPlayerSpeed(GAME_CONFIG.PLAYER_SPEED);
      }
    };

    const handleTouchEnd = () => {
      setPlayerSpeed(0);
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const togglePause = () => {
    setIsPaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        audioManager.pauseMusic();
      } else {
        audioManager.playMusic();
      }
      return newPaused;
    });
  };

  const handleResumeFromPause = () => {
    setIsPaused(false);
    audioManager.playMusic();
  };

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || gameState.victory || showLevelTransition || isPaused) {
      return;
    }

    const gameLoop = () => {
      // Update player position
      setPlayerX(prev => {
        const newX = prev + playerSpeed;
        return Math.max(0, Math.min(newX, GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PLAYER_WIDTH));
      });

      // Spawn objects
      objectSpawnCounterRef.current++;
      if (objects.length < maxObjectsRef.current && objectSpawnCounterRef.current >= GAME_CONFIG.SPAWN_DELAY) {
        spawnObject();
        objectSpawnCounterRef.current = 0;
      }

      // Update objects
      setObjects(prev => {
        const updated = prev.map(obj => ({
          ...obj,
          y: obj.y + objectSpeedRef.current,
        }));

        // Check collisions and remove off-screen objects
        return updated.filter(obj => {
          const playerRect = {
            x: playerX,
            y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 20,
            width: GAME_CONFIG.PLAYER_WIDTH,
            height: GAME_CONFIG.PLAYER_HEIGHT,
          };

          const objRect = {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
          };

          if (checkCollision(playerRect, objRect)) {
            handleObjectCatch(obj);
            return false;
          }

          if (obj.y > GAME_CONFIG.CANVAS_HEIGHT) {
            if (obj.config.category === 'good') {
              handleObjectMiss();
            }
            return false;
          }

          return true;
        });
      });

      // Update particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            lifetime: p.lifetime - 1,
          }))
          .filter(p => p.lifetime > 0)
      );

      // Check combo timeout
      if (gameState.comboCounter > 0) {
        const now = Date.now();
        if (now - gameState.lastCatchTime > GAME_CONFIG.COMBO_TIMEOUT) {
          setGameState(prev => ({
            ...prev,
            comboCounter: 0,
            comboMultiplier: 1,
          }));
        }
      }

      // Check game over
      if (gameState.lives <= 0) {
        audioManager.play('gameOver');
        setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }));
        return;
      }

      // Check level completion
      if (gameState.score >= gameState.targetScore) {
        if (gameState.level === 3) {
          audioManager.play('win');
          setGameState(prev => ({ ...prev, victory: true, isPlaying: false }));
        } else {
          handleLevelComplete();
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, playerX, playerSpeed, objects, showLevelTransition]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw background
    if (backgroundImage && backgroundImage.complete) {
      ctx.drawImage(backgroundImage, 0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#F4E4B8';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }

    // Draw objects
    objects.forEach(obj => {
      if (obj.image && obj.image.complete) {
        ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
      }
    });

    // Draw player
    if (playerImage && playerImage.complete) {
      ctx.drawImage(
        playerImage,
        playerX,
        GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT - 20,
        GAME_CONFIG.PLAYER_WIDTH,
        GAME_CONFIG.PLAYER_HEIGHT
      );
    }

    // Draw particles
    particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.lifetime / particle.maxLifetime;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, [objects, playerX, particles, backgroundImage, playerImage]);

  const spawnObject = () => {
    const rand = Math.random();
    let objType: string;

    if (rand < SPAWN_PROBABILITIES.GOOD) {
      objType = ['dill', 'carrot', 'zucchini'][Math.floor(Math.random() * 3)];
    } else if (rand < SPAWN_PROBABILITIES.BONUS) {
      objType = ['pepper', 'heart'][Math.floor(Math.random() * 2)];
    } else {
      objType = ['stone', 'chocolate'][Math.floor(Math.random() * 2)];
    }

    const newObj: GameObject = {
      id: `obj-${Date.now()}-${Math.random()}`,
      x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.OBJECT_SIZE),
      y: 0,
      type: objType,
      width: GAME_CONFIG.OBJECT_SIZE,
      height: GAME_CONFIG.OBJECT_SIZE,
      speed: objectSpeedRef.current,
      image: images[objType],
      config: OBJECT_CONFIGS[objType],
    };

    setObjects(prev => [...prev, newObj]);
  };

  const handleObjectCatch = (obj: GameObject) => {
    const category = obj.config.category;

    if (category === 'good') {
      audioManager.play('catch');
      const newComboCounter = gameState.comboCounter + 1;
      const newMultiplier = Math.min(Math.floor(newComboCounter / 3) + 1, 5);
      const pointsEarned = obj.config.points * gameState.comboMultiplier;

      if (newMultiplier > gameState.comboMultiplier) {
        audioManager.play('combo');
      }

      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        comboCounter: newComboCounter,
        comboMultiplier: newMultiplier,
        lastCatchTime: Date.now(),
      }));

      // Spawn particles
      createParticles(obj.x + obj.width / 2, obj.y, COLORS.COMBO_GOLD, 5);
    } else if (category === 'bonus') {
      audioManager.play('bonus');
      
      if (obj.config.combo) {
        setGameState(prev => ({
          ...prev,
          comboMultiplier: 2,
          comboCounter: prev.comboCounter + 3,
          score: prev.score + obj.config.points,
        }));
        createParticles(obj.x + obj.width / 2, obj.y, COLORS.ORANGE, 10);
      } else if (obj.config.lives > 0) {
        audioManager.play('healthRestore');
        setGameState(prev => ({
          ...prev,
          lives: Math.min(prev.lives + obj.config.lives, prev.maxLives),
        }));
        createParticles(obj.x + obj.width / 2, obj.y, COLORS.PINK, 8);
      }
    } else if (category === 'bad') {
      audioManager.play('badObject');
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score + obj.config.points),
        lives: prev.lives + obj.config.lives,
        comboCounter: 0,
        comboMultiplier: 1,
      }));
      createParticles(obj.x + obj.width / 2, obj.y, COLORS.RED, 6);
    }
  };

  const handleObjectMiss = () => {
    audioManager.play('miss');
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      comboCounter: 0,
      comboMultiplier: 1,
    }));
  };

  const createParticles = (x: number, y: number, color: string, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        color,
        size: Math.random() * 10 + 5,
        lifetime: 30,
        maxLifetime: 30,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleLevelComplete = () => {
    audioManager.play('funFact');
    setShowLevelTransition(true);
    setTransitionFact(getRandomFact());
    setGameState(prev => ({ ...prev, isPaused: true }));

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        targetScore: prev.targetScore + 100,
        isPaused: false,
      }));
      objectSpeedRef.current += 1;
      maxObjectsRef.current = Math.min(maxObjectsRef.current + 1, 5);
      setShowLevelTransition(false);
    }, 4000);
  };

  const handleRestart = () => {
    setGameState({
      score: 0,
      lives: GAME_CONFIG.INITIAL_LIVES,
      maxLives: GAME_CONFIG.MAX_LIVES,
      level: 1,
      targetScore: GAME_CONFIG.LEVEL_1_TARGET,
      comboCounter: 0,
      comboMultiplier: 1,
      lastCatchTime: 0,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      victory: false,
    });
    setObjects([]);
    setParticles([]);
    objectSpeedRef.current = GAME_CONFIG.INITIAL_OBJECT_SPEED;
    maxObjectsRef.current = GAME_CONFIG.MAX_OBJECTS;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          className="border-4 border-amber-600 rounded-lg shadow-2xl max-w-full h-auto"
          style={{ touchAction: 'none' }}
        />
        
        {gameState.isPlaying && !gameState.gameOver && !gameState.victory && !isPaused && (
          <>
            <GameHUD gameState={gameState} />
            
            {/* Pause button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePause}
              className="absolute top-4 right-4 z-30 p-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 border border-gray-200"
              title="Пауза (P или ESC)"
            >
              <Pause className="w-6 h-6 text-gray-700" />
            </motion.button>
          </>
        )}

        <AnimatePresence>
          {isPaused && (
            <PauseMenu
              key="pause"
              onResume={handleResumeFromPause}
              onMenu={onBackToMenu}
            />
          )}

          {showLevelTransition && (
            <LevelTransition
              key="transition"
              level={gameState.level + 1}
              fact={transitionFact}
              onComplete={() => setShowLevelTransition(false)}
            />
          )}

          {gameState.gameOver && (
            <GameOver
              key="gameover"
              score={gameState.score}
              level={gameState.level}
              onRestart={handleRestart}
              onMenu={onBackToMenu}
            />
          )}

          {gameState.victory && (
            <Victory
              key="victory"
              score={gameState.score}
              onMenu={onBackToMenu}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

