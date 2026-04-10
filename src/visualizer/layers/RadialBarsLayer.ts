import { Assets, Container, Graphics, Sprite, Texture, type Application } from "pixi.js";
import type { AudioFrame, VisualizerLayer } from "../engine/types";

type RadialBarsLayerOptions = {
  count: number;
  color: number;
  innerRadius: number;
  maxLength: number;
  thickness: number;
  imageUrl?: string;
  imageAlpha: number;
};

export class RadialBarsLayer implements VisualizerLayer {
  container = new Container();

  private graphics = new Graphics();
  private sprite: Sprite | null = null;
  private texture: Texture | null = null;
  private options: RadialBarsLayerOptions;
  private width = 0;
  private height = 0;

  constructor(options: RadialBarsLayerOptions) {
    this.options = options;
    this.container.addChild(this.graphics);
  }

  async mount(app: Application) {
    app.stage.addChild(this.container);

    if (this.options.imageUrl) {
      this.texture = await Assets.load(this.options.imageUrl);
     // this.sprite = new Sprite(texture);
     // this.sprite.alpha = this.options.imageAlpha;
   //   this.graphics.fill({ texture: this.texture, textureSpace: 'local'});
    }

    this.resize(app.renderer.width, app.renderer.height);
  }

  update(frame: AudioFrame) {
    const { frequencyData, bassLevel } = frame;
    const { count, color, innerRadius, maxLength, thickness } = this.options;

    this.graphics.clear();

    if (frequencyData.length === 0 || this.width === 0 || this.height === 0) return;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const pulseRadius = innerRadius + bassLevel * 200;

    this.graphics.circle(cx, cy, pulseRadius);
    this.graphics.stroke({ width: 3, color, alpha: 0.3 });
   // this.graphics.fill({ texture: this.texture, textureSpace: 'global'});

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dataIndex = Math.floor((i / count) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;

      const barLength = Math.max(4, value * maxLength);

      const x1 = cx + Math.cos(angle) * pulseRadius;
      const y1 = cy + Math.sin(angle) * pulseRadius;
      const x2 = cx + Math.cos(angle) * (pulseRadius + barLength);
      const y2 = cy + Math.sin(angle) * (pulseRadius + barLength);

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