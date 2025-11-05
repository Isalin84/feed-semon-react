import { useState, useEffect } from 'react';
import { GAME_CONFIG } from '../utils/constants';

interface CanvasSize {
  width: number;
  height: number;
  scale: number;
  displayWidth: number;
  displayHeight: number;
}

export const useCanvasSize = () => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: GAME_CONFIG.CANVAS_WIDTH,
    height: GAME_CONFIG.CANVAS_HEIGHT,
    scale: 1,
    displayWidth: GAME_CONFIG.CANVAS_WIDTH,
    displayHeight: GAME_CONFIG.CANVAS_HEIGHT,
  });

  useEffect(() => {
    const calculateCanvasSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isPortrait = windowHeight > windowWidth;
      const isMobile = windowWidth < 768;

      // Базовые размеры canvas (логические)
      const baseWidth = GAME_CONFIG.CANVAS_WIDTH;
      const baseHeight = GAME_CONFIG.CANVAS_HEIGHT;
      const aspectRatio = baseWidth / baseHeight;

      let displayWidth: number;
      let displayHeight: number;

      if (isMobile) {
        // На мобильных устройствах адаптируем под экран
        const padding = 16; // отступы с обеих сторон
        const availableWidth = windowWidth - padding * 2;
        const availableHeight = windowHeight - padding * 2;

        if (isPortrait) {
          // Портретный режим - используем ширину экрана
          displayWidth = Math.min(availableWidth, baseWidth);
          displayHeight = displayWidth / aspectRatio;

          // Если по высоте не влезает, уменьшаем
          if (displayHeight > availableHeight * 0.7) {
            displayHeight = availableHeight * 0.7;
            displayWidth = displayHeight * aspectRatio;
          }
        } else {
          // Ландшафтный режим - максимально используем экран
          displayHeight = Math.min(availableHeight * 0.85, baseHeight);
          displayWidth = displayHeight * aspectRatio;

          // Если по ширине не влезает, уменьшаем
          if (displayWidth > availableWidth) {
            displayWidth = availableWidth;
            displayHeight = displayWidth / aspectRatio;
          }
        }
      } else {
        // На десктопе используем оригинальные размеры или чуть меньше
        const padding = 32;
        const availableWidth = windowWidth - padding * 2;
        const availableHeight = windowHeight - padding * 2;

        displayWidth = Math.min(baseWidth, availableWidth);
        displayHeight = displayWidth / aspectRatio;

        if (displayHeight > availableHeight) {
          displayHeight = availableHeight;
          displayWidth = displayHeight * aspectRatio;
        }
      }

      // Вычисляем масштаб
      const scale = displayWidth / baseWidth;

      setCanvasSize({
        width: baseWidth,
        height: baseHeight,
        scale,
        displayWidth: Math.round(displayWidth),
        displayHeight: Math.round(displayHeight),
      });
    };

    // Вычисляем при загрузке
    calculateCanvasSize();

    // Пересчитываем при изменении размера окна или ориентации
    window.addEventListener('resize', calculateCanvasSize);
    window.addEventListener('orientationchange', calculateCanvasSize);

    return () => {
      window.removeEventListener('resize', calculateCanvasSize);
      window.removeEventListener('orientationchange', calculateCanvasSize);
    };
  }, []);

  return canvasSize;
};
