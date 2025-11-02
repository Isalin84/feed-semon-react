import { Howl } from 'howler';

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private initialized = false;
  private isMusicPlaying = false;

  constructor() {
    // Отложенная инициализация для лучшей производительности
  }

  init() {
    if (this.initialized) return;
    
    // iOS Audio unlock workaround - создаем временный звук для разблокировки
    if (typeof window !== 'undefined') {
      try {
        const unlockHowler = () => {
          const dummySound = new Howl({
            src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=='],
            volume: 0,
          });
          dummySound.play();
          setTimeout(() => {
            dummySound.unload();
          }, 100);
        };
        unlockHowler();
      } catch (error) {
        console.warn('iOS audio unlock failed:', error);
      }
    }
    
    const baseUrl = import.meta.env.BASE_URL;
    const soundFiles = {
      catch: `${baseUrl}assets/sounds/catch.mp3`,
      miss: `${baseUrl}assets/sounds/miss.mp3`,
      gameOver: `${baseUrl}assets/sounds/game_over.mp3`,
      win: `${baseUrl}assets/sounds/win.mp3`,
      bonus: `${baseUrl}assets/sounds/bonus.mp3`,
      combo: `${baseUrl}assets/sounds/combo.mp3`,
      badObject: `${baseUrl}assets/sounds/bad_object.mp3`,
      healthRestore: `${baseUrl}assets/sounds/health_restore.mp3`,
      funFact: `${baseUrl}assets/sounds/fun_fact.mp3`,
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      try {
        this.sounds.set(key, new Howl({ 
          src: [src], 
          volume: 0.4,
          preload: true 
        }));
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error);
      }
    });

    try {
      this.music = new Howl({
        src: [`${baseUrl}assets/sounds/background_music.mp3`],
        loop: true,
        volume: 0.3,
        preload: true
      });
    } catch (error) {
      console.warn('Failed to load background music', error);
    }

    this.initialized = true;
  }

  play(soundName: string) {
    if (!this.initialized) this.init();
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  playMusic() {
    if (!this.initialized) this.init();
    
    // Проверяем, не играет ли музыка уже
    if (this.isMusicPlaying && this.music?.playing()) {
      console.log('Music is already playing, skipping...');
      return;
    }
    
    this.music?.play();
    this.isMusicPlaying = true;
  }

  forceUnlock() {
    // Явная разблокировка аудио для мобильных устройств
    if (!this.initialized) this.init();
    
    console.log('Force unlocking audio for mobile...');
    
    // Проигрываем и сразу останавливаем все звуки для разблокировки
    this.sounds.forEach((sound) => {
      const id = sound.play();
      sound.stop(id);
    });
    
    // Также разблокируем музыку
    if (this.music) {
      const musicId = this.music.play();
      this.music.pause(musicId);
    }
    
    console.log('Audio unlocked successfully!');
  }

  pauseMusic() {
    this.music?.pause();
    this.isMusicPlaying = false;
  }

  stopMusic() {
    this.music?.stop();
    this.isMusicPlaying = false;
  }

  setMusicVolume(volume: number) {
    this.music?.volume(volume);
  }

  setSoundVolume(soundName: string, volume: number) {
    this.sounds.get(soundName)?.volume(volume);
  }
}

export const audioManager = new AudioManager();

