import { MusicVisualizer } from "./components/visualizer/MusicVisualizer";
import { VisualizerControlsPanel } from "./components/visualizer/VisualizerControlsPanel";

export default function App() {
  return (
    <main className="h-screen w-screen bg-black text-white overflow-hidden">
      <div className="grid h-full w-full grid-cols-1 grid-rows-[56px_1fr_88px] gap-3 p-3 md:grid-cols-[1fr_320px] md:grid-rows-[56px_1fr_88px]">
        {/* Top Toolbar */}
        <header className="col-span-1 md:col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4">
          <div className="text-sm font-semibold tracking-wide text-white/90">
            Music Visualizer
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition">
              File
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition">
              Export
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition">
              Preset
            </button>
          </div>
        </header>

        {/* Main Visualizer Area */}
        <section className="min-h-0 min-w-0">
          <MusicVisualizer />
        </section>

        {/* Right Sidebar */}
        <aside className="hidden min-h-0 md:block">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <VisualizerControlsPanel
              isPlaying={false}
              mode="bars"
              onTogglePlay={() => { }}
              onChangeMode={() => { }}
            />
          </div>
        </aside>

        {/* Bottom Bar */}
        <footer className="col-span-1 md:col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4">
          <div className="text-sm text-white/70">Timeline / transport bar</div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition">
              Play
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition">
              Pause
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}