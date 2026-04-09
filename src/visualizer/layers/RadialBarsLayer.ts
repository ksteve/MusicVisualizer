import { Container, Graphics, type Application } from "pixi.js";
import type { AudioFrame, VisualizerLayer } from "../engine/types";

type RadialBarsLayerOptions = {
  count: number;
  color: number;
  innerRadius: number;
  maxLength: number;
  thickness: number;
};

export class RadialBarsLayer implements VisualizerLayer {
  container = new Container();

  private graphics = new Graphics();
  private options: RadialBarsLayerOptions;
  private width = 0;
  private height = 0;

  constructor(options: RadialBarsLayerOptions) {
    this.options = options;
    this.container.addChild(this.graphics);
  }

  mount(app: Application) {
    app.stage.addChild(this.container);
    this.resize(app.renderer.width, app.renderer.height);
  }

  update(frame: AudioFrame) {
    const { frequencyData, bassLevel } = frame;
    const { count, color, innerRadius, maxLength, thickness } = this.options;

    this.graphics.clear();

    if (frequencyData.length === 0 || this.width === 0 || this.height === 0) return;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const pulseRadius = innerRadius + bassLevel * 12;

    this.graphics.circle(cx, cy, pulseRadius);
    this.graphics.stroke({ width: 3, color, alpha: 0.3 });

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dataIndex = Math.floor((i / count) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;

      const barLength = Math.max(4, value * maxLength);

      const x1 = cx + Math.cos(angle) * innerRadius;
      const y1 = cy + Math.sin(angle) * innerRadius;
      const x2 = cx + Math.cos(angle) * (innerRadius + barLength);
      const y2 = cy + Math.sin(angle) * (innerRadius + barLength);

      this.graphics.moveTo(x1, y1);
      this.graphics.lineTo(x2, y2);
    }

    this.graphics.stroke({
      width: thickness,
      color,
      alpha: 0.95,
      cap: "round",
    });
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  destroy() {
    this.graphics.destroy();
    this.container.destroy({ children: true });
  }
}