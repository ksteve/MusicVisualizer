import { Container, Graphics, type Application } from "pixi.js";
import type { AudioFrame, VisualizerLayer } from "../engine/types";

type BarsLayerOptions = {
  count: number;
  color: number;
  maxHeight: number;
  widthRatio: number;
  spacing: number;
};

export class BarsLayer implements VisualizerLayer {
  container = new Container();

  private graphics = new Graphics();
  private options: BarsLayerOptions;
  private width = 0;
  private height = 0;

  constructor(options: BarsLayerOptions) {
    this.options = options;
    this.container.addChild(this.graphics);
  }

  mount(app: Application) {
    app.stage.addChild(this.container);
    this.resize(app.renderer.width, app.renderer.height);
  }

  update(frame: AudioFrame) {
    const { frequencyData } = frame;
    const { count, color, maxHeight, widthRatio, spacing } = this.options;

    this.graphics.clear();

    if (frequencyData.length === 0 || this.width === 0 || this.height === 0) return;

    const barSlotWidth = this.width / count;
    const barWidth = Math.max(2, barSlotWidth * widthRatio);
    const centerY = this.height * 0.82;

    for (let i = 0; i < count; i++) {
      const dataIndex = Math.floor((i / count) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;

      const barHeight = Math.max(4, value * maxHeight);
      const x = i * barSlotWidth + (barSlotWidth - barWidth) / 2;
      const y = centerY - barHeight;

      this.graphics.roundRect(x, y, barWidth, barHeight, Math.min(6, barWidth / 2));
    }

    this.graphics.fill({ color, alpha: 0.95 });
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