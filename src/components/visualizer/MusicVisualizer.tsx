import { useEffect, useRef, useState } from "react";
import { Application } from "pixi.js";
import { VisualizerEngine } from "../../visualizer/engine/VisualizerEngine";
import { defaultConfig } from "../../visualizer/config/defaultConfig";
import { VisualizerControlsPanel } from "./VisualizerControlsPanel";
import type { VisualizerMode } from "../../visualizer/engine/types";

type MusicVisualizerProps = {
  demoAudio?: string;
};

export function MusicVisualizer({
  demoAudio = "/demo/demo.mp3",
}: MusicVisualizerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixiAppRef = useRef<Application | null>(null);
  const engineRef = useRef<VisualizerEngine | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<VisualizerMode>(defaultConfig.mode);

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

  const handleTogglePlay = async () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.pause();
      setIsPlaying(false);
    } else {
      await engine.start();
      setIsPlaying(true);
    }
  };

  const handleChangeMode = async (nextMode: VisualizerMode) => {
    const engine = engineRef.current;
    if (!engine) return;

    await engine.setMode(nextMode);
    setMode(nextMode);
  };

  return (
    <div className="relative w-5/6 h-[70vh] min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-white">
      <div ref={containerRef} className="w-full h-full" />

      <VisualizerControlsPanel
        isPlaying={isPlaying}
        mode={mode}
        onTogglePlay={handleTogglePlay}
        onChangeMode={handleChangeMode}
      />
    </div>
  );
}