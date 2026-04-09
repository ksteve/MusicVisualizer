import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { VisualizerEngine } from "../../visualizer/engine/VisualizerEngine";
import { defaultConfig } from "../../visualizer/config/defaultConfig";
import type { VisualizerMode } from "../../visualizer/engine/types";

type Props = {
  demoAudio?: string;
  isPlaying: boolean;
  mode: VisualizerMode;
};

export function MusicVisualizer({
  demoAudio = "/demo/demo.mp3",
  isPlaying,
  mode,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const engineRef = useRef<VisualizerEngine | null>(null);

  // Init Pixi + Engine ONCE
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
      appRef.current = app;

      const engine = new VisualizerEngine(app, defaultConfig);
      engineRef.current = engine;

      await engine.init();
      await engine.loadDemoAudio(demoAudio);
    };

    void setup();

    return () => {
      mounted = false;
      engineRef.current?.destroy();
      engineRef.current = null;

      if (appRef.current) {
        void appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [demoAudio]);

  // React to play/pause
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPlaying) {
      void engine.start();
    } else {
      engine.pause();
    }
  }, [isPlaying]);

  // React to mode changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    void engine.setMode(mode);
  }, [mode]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}