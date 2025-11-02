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
    
    const soundFiles = {
      catch: '/assets/sounds/catch.mp3',
      miss: '/assets/sounds/miss.mp3',
      gameOver: '/assets/sounds/game_over.mp3',
      win: '/assets/sounds/win.mp3',
      bonus: '/assets/sounds/bonus.mp3',
      combo: '/assets/sounds/combo.mp3',
      badObject: '/assets/sounds/bad_object.mp3',
      healthRestore: '/assets/sounds/health_restore.mp3',
      funFact: '/assets/sounds/fun_fact.mp3',
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
        src: ['/assets/sounds/background_music.mp3'],
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

