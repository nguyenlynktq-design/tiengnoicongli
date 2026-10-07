import { soundFx } from './sound';

export interface NarrationOptions {
  audioId?: string; // Pre-generated static audio ID (e.g. "intro", "q1", "a1")
  title?: string;
  promptGuidance?: string;
  playbackRate?: number;
  onEnd?: () => void;
}

export interface SubtitleState {
  visible: boolean;
  title: string;
  text: string;
  isPlaying: boolean;
  activeId: string | null;
}

type SubtitleListener = (state: SubtitleState) => void;

class AudioNarrator {
  private currentAudioElement: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private currentActiveId: string | null = null;
  private playbackRate: number = 1.2;
  private selectedBrowserVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<SubtitleListener> = new Set();
  private subtitleState: SubtitleState = {
    visible: false,
    title: '',
    text: '',
    isPlaying: false,
    activeId: null,
  };

  constructor() {
    this.setupBrowserVoices();
  }

  public subscribe(listener: SubtitleListener): () => void {
    this.listeners.add(listener);
    listener(this.subtitleState);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.subtitleState));
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = rate;
    }
  }

  public getPlaybackRate(): number {
    return this.playbackRate;
  }

  public getActiveId(): string | null {
    return this.currentActiveId;
  }

  public getIsPlaying(): boolean {
    return this.isSpeaking;
  }

  private setupBrowserVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const findHanoiVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const viVoices = voices.filter(
        (v) => v.lang && (v.lang.startsWith('vi') || v.lang.toLowerCase().includes('vie'))
      );
      if (viVoices.length === 0) return;

      const isMale = (name: string) => {
        const n = name.toLowerCase();
        return (
          n.includes(' nam') ||
          n.includes('male') ||
          n.includes('khoi') ||
          n.includes('minh') ||
          n.includes('trung')
        );
      };

      const hanoiFemale = viVoices.find((v) => {
        const n = (v.name || '').toLowerCase();
        return (
          !isMale(n) &&
          (n.includes('hoaimy') ||
            n.includes('mai') ||
            n.includes('linh') ||
            n.includes('an') ||
            n.includes('hanoi') ||
            n.includes('north'))
        );
      });

      const anyFemale = viVoices.find((v) => !isMale(v.name));
      this.selectedBrowserVoice =
        hanoiFemale || anyFemale || viVoices.find((v) => v.name.includes('Google')) || viVoices[0];
    };

    findHanoiVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findHanoiVoice;
    }
  }

  public stop() {
    this.isSpeaking = false;
    this.currentActiveId = null;

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.subtitleState = {
      ...this.subtitleState,
      visible: false,
      isPlaying: false,
      activeId: null,
    };
    this.notify();
  }

  public async speak(text: string, options: NarrationOptions = {}) {
    soundFx.init();
    if (soundFx.isMuted()) return;

    // Toggle stop if already playing the exact same id
    if (options.audioId && this.currentActiveId === options.audioId && this.isSpeaking) {
      this.stop();
      return;
    }

    this.stop();

    const title = options.title || 'CÔ QUYÊN THUYẾT MINH (GIỌNG NỮ MIỀN BẮC HÀ NỘI)';
    this.isSpeaking = true;
    this.currentActiveId = options.audioId || 'dynamic';

    this.subtitleState = {
      visible: true,
      title,
      text,
      isPlaying: true,
      activeId: this.currentActiveId,
    };
    this.notify();

    // 1. Try static pre-generated audio file if audioId is provided
    if (options.audioId) {
      const staticUrl = `/audio/${options.audioId}.wav`;
      const played = await this.playAudioUrl(staticUrl, options);
      if (played) return;
    }

    // 2. Try fetching server-synthesized audio via /api/tts
    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          style: options.promptGuidance || 'Giọng nữ miền Bắc Hà Nội thanh lịch, chuẩn mực sư phạm',
          voice: 'Aoede',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.audioUrl) {
          const played = await this.playAudioUrl(data.audioUrl, options);
          if (played) return;
        }
      }
    } catch {
      // Fall through to browser speech synthesis
    }

    // 3. Fallback to Web Speech API
    this.speakWithWebSpeech(text, options);
  }

  private playAudioUrl(url: string, options: NarrationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      this.currentAudioElement = audio;
      audio.playbackRate = options.playbackRate || this.playbackRate;

      audio.onended = () => {
        this.isSpeaking = false;
        this.currentActiveId = null;
        this.currentAudioElement = null;
        this.subtitleState = {
          ...this.subtitleState,
          visible: false,
          isPlaying: false,
          activeId: null,
        };
        this.notify();
        if (options.onEnd) options.onEnd();
        resolve(true);
      };

      audio.onerror = () => {
        this.currentAudioElement = null;
        resolve(false);
      };

      audio.play().then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  private speakWithWebSpeech(text: string, options: NarrationOptions) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(() => this.stop(), 5000);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    if (this.selectedBrowserVoice) {
      utterance.voice = this.selectedBrowserVoice;
    }
    utterance.rate = (options.playbackRate || this.playbackRate) * 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentActiveId = null;
      this.subtitleState = {
        ...this.subtitleState,
        visible: false,
        isPlaying: false,
        activeId: null,
      };
      this.notify();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.stop();
    };

    window.speechSynthesis.speak(utterance);
    setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 200);
  }
}

export const narrator = new AudioNarrator();
