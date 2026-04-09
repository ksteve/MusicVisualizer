import type { Application, Container } from "pixi.js";

export type VisualizerMode = "bars" | "radial";

export type AudioFrame = {
    frequencyData: Uint8Array;
    waveformData: Uint8Array;
    bassLevel: number; // 0..1
};

export type VisualizerConfig = {
    mode: VisualizerMode;
    bars: {
        count: number;
        color: number;
        maxHeight: number;
        widthRatio: number;
        spacing: number;
    };
    radial: {
        count: number;
        color: number;
        innerRadius: number;
        maxLength: number;
        thickness: number;
    };
    background: {
        color: number;
        imageUrl?: string;
        imageAlpha: number;
    };
};

export interface VisualizerLayer {
    container: Container;
    mount(app: Application): void | Promise<void>;
    update(frame: AudioFrame): void;
    resize(width: number, height: number): void;
    destroy(): void;
}