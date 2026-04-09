import type { VisualizerMode } from "../../visualizer/engine/types";

type VisualizerControlsPanelProps = {
  isPlaying: boolean;
  mode: VisualizerMode;
  onTogglePlay: () => void;
  onChangeMode: (mode: VisualizerMode) => void;
};

export function VisualizerControlsPanel({
  isPlaying,
  mode,
  onTogglePlay,
  onChangeMode,
}: VisualizerControlsPanelProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-xl bg-black/60 px-4 py-3 backdrop-blur-md border border-white/10">
      <button
        onClick={onTogglePlay}
        className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button
        onClick={() => onChangeMode("bars")}
        className={`rounded-lg px-3 py-2 text-sm transition ${
          mode === "bars"
            ? "bg-cyan-400 text-black"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Bars
      </button>

      <button
        onClick={() => onChangeMode("radial")}
        className={`rounded-lg px-3 py-2 text-sm transition ${
          mode === "radial"
            ? "bg-pink-400 text-black"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Radial
      </button>
    </div>
  );
}