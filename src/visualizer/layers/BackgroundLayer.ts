import { Assets, Container, Graphics, Sprite, TilingSprite, type Application } from "pixi.js";
import type { AudioFrame, VisualizerLayer } from "../engine/types";

type BackgroundLayerOptions = {
  color: number;
  imageUrl?: string;
  imageAlpha: number;
  motion: {
    parallaxStrength: number; // slow drift
    bassShake: number;        // vibration strength
  };
};

export class BackgroundLayer implements VisualizerLayer {
  container = new Container();

  private rect = new Graphics();
  private sprite: TilingSprite | null = null;
  private options: BackgroundLayerOptions;
  private width = 0;
  private height = 0;
  private time = 0;
  private baseX = 0;
  private baseY = 0;
  private shakeX = 0;
  private shakeY = 0;
  private baseScale = 1;

  constructor(options: BackgroundLayerOptions) {
    this.options = options;
    this.container.addChild(this.rect);
  }

  async mount(app: Application) {
    app.stage.addChild(this.container);

    if (this.options.imageUrl) {
      const texture = await Assets.load(this.options.imageUrl);
      this.sprite = new TilingSprite(texture);
      this.sprite.alpha = this.options.imageAlpha;
      this.container.addChild(this.sprite);
    }

    this.resize(app.renderer.width, app.renderer.height);
  }

  update(frame: AudioFrame) {
    const alpha = 0.88 + frame.bassLevel * 0.12;

    // background color pulse
    this.rect.clear();
    this.rect.rect(0, 0, this.width, this.height);
    this.rect.fill({ color: this.options.color, alpha });

    if (!this.sprite) return;

    const { parallaxStrength, bassShake } = this.options.motion;

    // ✅ better time progression (frame-rate independent)
    this.time += 0.016; // (fine for now, can upgrade later to ticker delta)

    // 🎯 Parallax
    const parallaxX = Math.sin(this.time * 0.4) * parallaxStrength;
    const parallaxY = Math.cos(this.time * 0.3) * parallaxStrength;

    // 🎯 Bass shake (smoothed)
    const shakePower = frame.bassLevel * bassShake;

    const targetShakeX = (Math.random() - 0.5) * 2 * shakePower;
    const targetShakeY = (Math.random() - 0.5) * 2 * shakePower;

    this.shakeX += (targetShakeX - this.shakeX) * 0.15;
    this.shakeY += (targetShakeY - this.shakeY) * 0.15;

    // ✅ combine transforms
    this.sprite.x = this.baseX + parallaxX + this.shakeX;
    this.sprite.y = this.baseY + parallaxY + this.shakeY;

    // 🔥 OPTIONAL (very nice effect)
    // const zoom = 1 + frame.bassLevel * 0.03;
    // this.sprite.scale.set(this.baseScale * zoom);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (!this.sprite) return;

    const texW = this.sprite.texture.width || 1;
    const texH = this.sprite.texture.height || 1;

    const { parallaxStrength, bassShake } = this.options.motion;

    // ✅ how far the image can move (worst case)
    const maxOffset = parallaxStrength + bassShake;

    // convert pixel movement into scale padding
    const paddingX = (maxOffset * 2) / width;
    const paddingY = (maxOffset * 2) / height;

    const overscan = 1 + Math.max(paddingX, paddingY);

    // ✅ cover + overscan
    const baseScale = Math.max(width / texW, height / texH);
    const scale = baseScale * overscan;

    this.baseScale = scale; // store for zoom later

    this.sprite.scale.set(scale);

    // ✅ recenter AFTER scaling
    this.baseX = (width - texW * scale) / 2;
    this.baseY = (height - texH * scale) / 2;

    this.sprite.x = this.baseX;
    this.sprite.y = this.baseY;
  }

  destroy() {
    this.rect.destroy();
    this.sprite?.destroy();
    this.container.destroy({ children: true });
  }
}