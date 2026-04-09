import { useState } from "react";
import { MusicVisualizer } from "./components/visualizer/MusicVisualizer";
import { VisualizerControlsPanel } from "./components/visualizer/VisualizerControlsPanel";
import type { VisualizerMode } from "./visualizer/engine/types";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<VisualizerMode>("radial");

  return (
    <main className="h-screen w-screen bg-black text-white overflow-hidden">
      <div className="grid h-full w-full grid-cols-1 grid-rows-[56px_1fr_88px] gap-3 p-3 md:grid-cols-[1fr_320px]">
        
        {/* Top Toolbar */}
        <header className="col-span-1 md:col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4">
          <div className="text-sm font-semibold">Music Visualizer</div>
        </header>

        {/* Visualizer */}
        <section className="min-h-0 min-w-0">
          <MusicVisualizer
            isPlaying={isPlaying}
            mode={mode}
          />
        </section>

        {/* Sidebar */}
        <aside className="hidden min-h-0 md:block">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <VisualizerControlsPanel
              isPlaying={isPlaying}
              mode={mode}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onChangeMode={setMode}
            />
          </div>
        </aside>

        {/* Bottom bar */}
        <footer className="col-span-1 md:col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4">
          <div className="text-sm text-white/70">Transport</div>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </footer>
      </div>
    </main>
  );
}