import { Assets, Container, Graphics, Sprite, type Application } from "pixi.js";
import type { AudioFrame, VisualizerLayer } from "../engine/types";

type BackgroundLayerOptions = {
  color: number;
  imageUrl?: string;
  imageAlpha: number;
};

export class BackgroundLayer implements VisualizerLayer {
  container = new Container();

  private rect = new Graphics();
  private sprite: Sprite | null = null;
  private options: BackgroundLayerOptions;
  private width = 0;
  private height = 0;

  constructor(options: BackgroundLayerOptions) {
    this.options = options;
    this.container.addChild(this.rect);
  }

  async mount(app: Application) {
    app.stage.addChild(this.container);

    if (this.options.imageUrl) {
      const texture = await Assets.load(this.options.imageUrl);
      this.sprite = new Sprite(texture);
      this.sprite.alpha = this.options.imageAlpha;
      this.container.addChild(this.sprite);
    }

    this.resize(app.renderer.width, app.renderer.height);
  }

  update(frame: AudioFrame) {
    const alpha = 0.88 + frame.bassLevel * 0.12;

    this.rect.clear();
    this.rect.rect(0, 0, this.width, this.height);
    this.rect.fill({ color: this.options.color, alpha });
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.sprite) {
      const texW = this.sprite.texture.width || 1;
      const texH = this.sprite.texture.height || 1;

      const scale = Math.max(width / texW, height / texH);

      this.sprite.scale.set(scale);
      this.sprite.x = (width - texW * scale) / 2;
      this.sprite.y = (height - texH * scale) / 2;
    }
  }

  destroy() {
    this.rect.destroy();
    this.sprite?.destroy();
    this.container.destroy({ children: true });
  }
}