export type AudioAnalyserOptions = {
  fftSize?: number;
  smoothingTimeConstant?: number;
};

export class AudioAnalyser {
  private audioEl: HTMLAudioElement;
  private ctx: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private timeDomainData: Uint8Array<ArrayBuffer> | null = null;
  private opts: Required<AudioAnalyserOptions>;

  constructor(audioEl: HTMLAudioElement, options: AudioAnalyserOptions = {}) {
    this.audioEl = audioEl;
    this.opts = {
      fftSize: options.fftSize ?? 2048,
      smoothingTimeConstant: options.smoothingTimeConstant ?? 0.8,
    };
  }

  get isReady() {
    return Boolean(this.ctx && this.analyser);
  }

  /**
   * Creates AudioContext graph if needed. Note: `resume()` must be called from a
   * user gesture to satisfy autoplay policies in most browsers.
   */
  ensureInitialized() {
    if (this.ctx && this.analyser) return;

    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) throw new Error("WebAudio AudioContext is not supported in this browser.");

    this.ctx = new Ctx();
    this.source = this.ctx.createMediaElementSource(this.audioEl);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = this.opts.fftSize;
    this.analyser.smoothingTimeConstant = this.opts.smoothingTimeConstant;

    this.source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Create buffers backed by ArrayBuffer (not SharedArrayBuffer) to satisfy TS DOM typings.
    this.frequencyData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
    this.timeDomainData = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));
  }

  async resume() {
    this.ensureInitialized();
    if (!this.ctx) return;
    if (this.ctx.state !== "running") await this.ctx.resume();
  }

  getFrequencyData() {
    if (!this.analyser || !this.frequencyData) return null;
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getTimeDomainData() {
    if (!this.analyser || !this.timeDomainData) return null;
    this.analyser.getByteTimeDomainData(this.timeDomainData);
    return this.timeDomainData;
  }

  destroy() {
    this.frequencyData = null;
    this.timeDomainData = null;

    try {
      this.source?.disconnect();
    } catch {
      // ignore
    }
    try {
      this.analyser?.disconnect();
    } catch {
      // ignore
    }

    this.source = null;
    this.analyser = null;

    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) void ctx.close();
  }
}

