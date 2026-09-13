// Type stubs for the SoundCloud HTML5 Widget API
// https://developers.soundcloud.com/docs/api/html5-widget

interface SCSound {
  title: string;
  user: { username: string };
  id: number;
  permalink_url: string;
  duration: number;
}

interface SCWidget {
  play(): void;
  pause(): void;
  toggle(): void;
  next(): void;
  prev(): void;
  skip(soundIndex: number): void;
  seekTo(milliseconds: number): void;
  setVolume(volume: number): void;
  getVolume(callback: (volume: number) => void): void;
  getDuration(callback: (duration: number) => void): void;
  getPosition(callback: (position: number) => void): void;
  getSounds(callback: (sounds: SCSound[]) => void): void;
  getCurrentSound(callback: (sound: SCSound) => void): void;
  getCurrentSoundIndex(callback: (index: number) => void): void;
  isPaused(callback: (paused: boolean) => void): void;
  bind(eventName: string, listener: (...args: unknown[]) => void): void;
  unbind(eventName: string): void;
  load(url: string, options?: Record<string, unknown>): void;
}

interface Window {
  SC: {
    Widget: {
      (element: HTMLIFrameElement | string): SCWidget;
      Events: {
        READY: string;
        PLAY: string;
        PAUSE: string;
        FINISH: string;
        PLAY_PROGRESS: string;
        LOAD_PROGRESS: string;
        SEEK: string;
        ERROR: string;
        CLICK_DOWNLOAD: string;
        CLICK_BUY: string;
        OPEN_SHARE_PANEL: string;
      };
    };
  };
}
