import type { Application } from "pixi.js";
import { DemoAudioSource } from "../audio/DemoAudioSource";
import type { VisualizerConfig, VisualizerLayer, VisualizerMode } from "./types";
import { BackgroundLayer } from "../layers/BackgroundLayer";
import { BarsLayer } from "../layers/BarsLayer";
import { RadialBarsLayer } from "../layers/RadialBarsLayer";

export class VisualizerEngine {
  private app: Application;
  private config: VisualizerConfig;
  private audioSource = new DemoAudioSource();
  private layers: VisualizerLayer[] = [];
  private tickerFn: (() => void) | null = null;
  private isRunning = false;

  constructor(app: Application, config: VisualizerConfig) {
    this.app = app;
    this.config = config;
  }

  async init() {
    await this.rebuildLayers();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  async loadDemoAudio(src: string) {
    await this.audioSource.load(src);
  }

  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    await this.audioSource.play();

    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn);
    }

    this.tickerFn = () => {
      const frame = this.audioSource.getFrame();

      for (const layer of this.layers) {
        layer.update(frame);
      }
    };

    this.app.ticker.add(this.tickerFn);
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.audioSource.pause();

    if (this.tickerFn) {
      this.app.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
  }

  async setMode(mode: VisualizerMode) {
    if (this.config.mode === mode) return;

    const wasRunning = this.isRunning;
    this.pause();

    this.config = {
      ...this.config,
      mode,
    };

    await this.rebuildLayers();

    if (wasRunning) {
      await this.start();
    }
  }

  getMode(): VisualizerMode {
    return this.config.mode;
  }

  private async rebuildLayers() {
    for (const layer of this.layers) {
      layer.destroy();
    }

    this.layers = [];

    const background = new BackgroundLayer(this.config.background);
    await background.mount(this.app);
    this.layers.push(background);

    if (this.config.mode === "bars") {
      const bars = new BarsLayer(this.config.bars);
      bars.mount(this.app);
      this.layers.push(bars);
    } else {
      const radial = new RadialBarsLayer(this.config.radial);
      radial.mount(this.app);
      this.layers.push(radial);
    }

    this.handleResize();
  }

  private handleResize = () => {
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;

    for (const layer of this.layers) {
      layer.resize(width, height);
    }
  };

  destroy() {
    this.pause();
    window.removeEventListener("resize", this.handleResize);

    for (const layer of this.layers) {
      layer.destroy();
    }

    this.layers = [];
    this.audioSource.destroy();
  }
}