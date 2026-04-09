type VisualizerMode = "bars" | "radialBars";

type VisualizerControlsPanelProps = {
  isPlaying: boolean;
  mode: VisualizerMode;
  onTogglePlay: () => void;
  onChangeMode: (mode: VisualizerMode) => void;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

type ControlButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

function ControlButton({
  active = false,
  children,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-white text-black"
          : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function VisualizerControlsPanel({
  isPlaying,
  mode,
  onTogglePlay,
  onChangeMode,
}: VisualizerControlsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-white/90">
          Controls
        </h2>
        <p className="mt-1 text-xs text-white/50">
          MVP control surface for playback and visual modes
        </p>
      </div>

      {/* Scrollable panel content */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {/* Transport */}
        <Section title="Transport">
          <div className="grid grid-cols-2 gap-2">
            <ControlButton active={isPlaying} onClick={onTogglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </ControlButton>

            <ControlButton>Restart</ControlButton>
          </div>

          <p className="text-xs text-white/50">
            Playback wiring will be connected in the next step.
          </p>
        </Section>

        {/* Mode */}
        <Section title="Visualizer Mode">
          <div className="grid grid-cols-2 gap-2">
            <ControlButton
              active={mode === "bars"}
              onClick={() => onChangeMode("bars")}
            >
              Bars
            </ControlButton>

            <ControlButton
              active={mode === "radialBars"}
              onClick={() => onChangeMode("radialBars")}
            >
              Radial
            </ControlButton>
          </div>

          <p className="text-xs text-white/50">
            Switch between classic horizontal bars and radial bars.
          </p>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="space-y-2">
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="text-sm text-white/80">Background Image</div>
              <div className="mt-1 text-xs text-white/50">
                Ready for toggle + upload in the next pass
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="text-sm text-white/80">Opacity / Blend</div>
              <div className="mt-1 text-xs text-white/50">
                Add image alpha and visual tuning later
              </div>
            </div>
          </div>
        </Section>

        {/* Status */}
        <Section title="Status">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="text-white/60">Playback</span>
              <span className="text-white/90">{isPlaying ? "Playing" : "Paused"}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="text-white/60">Mode</span>
              <span className="text-white/90">
                {mode === "bars" ? "Bars" : "Radial Bars"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="text-white/60">Audio</span>
              <span className="text-white/90">Demo</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}