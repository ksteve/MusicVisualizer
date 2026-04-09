import type { AudioFrame } from "../engine/types";

export class DemoAudioSource {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private audioEl: HTMLAudioElement | null = null;

  private frequencyData: Uint8Array | null = null;
  private waveformData: Uint8Array | null = null;

  async load(src: string) {
    this.audioEl = new Audio(src);
    this.audioEl.crossOrigin = "anonymous";
    this.audioEl.loop = true;
  
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
  
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
  
    this.sourceNode = this.audioContext.createMediaElementSource(this.audioEl);
    this.sourceNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
  
    await new Promise<void>((resolve, reject) => {
      if (!this.audioEl) return reject(new Error("Audio element missing"));
  
      this.audioEl.addEventListener("canplaythrough", () => resolve(), { once: true });
      this.audioEl.addEventListener("error", () => reject(new Error("Failed to load audio")), {
        once: true,
      });
  
      this.audioEl.load();
    });
  }

  async play() {
    if (!this.audioContext || !this.audioEl) return;

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    await this.audioEl.play();
  }

  pause() {
    this.audioEl?.pause();
  }

  getFrame(): AudioFrame {
    if (!this.analyser || !this.frequencyData || !this.waveformData) {
      return {
        frequencyData: new Uint8Array(0),
        waveformData: new Uint8Array(0),
        bassLevel: 0,
      };
    }

    this.analyser.getByteFrequencyData(this.frequencyData  as unknown as Uint8Array<ArrayBuffer>);
    this.analyser.getByteTimeDomainData(this.waveformData  as unknown as Uint8Array<ArrayBuffer>);

    const bassBins = Math.min(12, this.frequencyData.length);
    let bassSum = 0;
    for (let i = 0; i < bassBins; i++) {
      bassSum += this.frequencyData[i];
    }

    const bassLevel = bassBins > 0 ? bassSum / bassBins / 255 : 0;

    return {
      frequencyData: this.frequencyData,
      waveformData: this.waveformData,
      bassLevel,
    };
  }

  destroy() {
    this.audioEl?.pause();
    this.audioEl = null;

    this.sourceNode?.disconnect();
    this.analyser?.disconnect();

    void this.audioContext?.close();

    this.sourceNode = null;
    this.analyser = null;
    this.audioContext = null;
    this.frequencyData = null;
    this.waveformData = null;
  }
}