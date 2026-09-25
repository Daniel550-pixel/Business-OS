// Web Speech API Voice Synthesizer for JARVIS / AIOS UAE
class JarvisVoiceEngine {
  private isMuted: boolean = false;
  private isSpeaking: boolean = false;
  private voice: SpeechSynthesisVoice | null = null;
  private listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prefer natural English voices (Google UK English Male, Daniel, Alex, Samantha)
        const preferred = voices.find(
          (v) =>
            (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('Alex'))) ||
            v.lang === 'en-US' ||
            v.lang === 'en-GB'
        );
        this.voice = preferred || voices[0] || null;
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  public subscribe(cb: (speaking: boolean, text: string) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(speaking: boolean, text: string = '') {
    this.isSpeaking = speaking;
    this.listeners.forEach((cb) => cb(speaking, text));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false, '');
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isVoiceMuted(): boolean {
    return this.isMuted;
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  public speak(text: string, force: boolean = false) {
    if ((this.isMuted && !force) || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 0.95; // Slightly deeper, authoritative voice
      utterance.volume = 0.9;

      utterance.onstart = () => {
        this.notify(true, text);
      };

      utterance.onend = () => {
        this.notify(false, '');
      };

      utterance.onerror = () => {
        this.notify(false, '');
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify(false, '');
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false, '');
    }
  }
}

export const jarvisVoice = new JarvisVoiceEngine();
