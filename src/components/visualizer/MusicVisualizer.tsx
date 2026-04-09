import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { VisualizerEngine } from "../../visualizer/engine/VisualizerEngine";
import { defaultConfig } from "../../visualizer/config/defaultConfig";

type MusicVisualizerProps = {
  demoAudio?: string;
};

export function MusicVisualizer({
  demoAudio = "/demo/demo.mp3",
}: MusicVisualizerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixiAppRef = useRef<Application | null>(null);
  const engineRef = useRef<VisualizerEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const setup = async () => {
      const app = new Application();

      await app.init({
        resizeTo: containerRef.current!,
        background: "#000000",
        antialias: true,
      });

      if (!mounted) {
        await app.destroy(true);
        return;
      }

      containerRef.current!.appendChild(app.canvas);
      pixiAppRef.current = app;

      const engine = new VisualizerEngine(app, defaultConfig);
      engineRef.current = engine;

      await engine.init();

      if (demoAudio) {
        await engine.loadDemoAudio(demoAudio);
      }
    };

    void setup();

    return () => {
      mounted = false;
      engineRef.current?.destroy();
      engineRef.current = null;

      if (pixiAppRef.current) {
        void pixiAppRef.current.destroy(true, { children: true });
        pixiAppRef.current = null;
      }
    };
  }, [demoAudio]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}