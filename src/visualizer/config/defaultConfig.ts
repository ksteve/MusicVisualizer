import type { VisualizerConfig } from "../engine/types";

export const defaultConfig: VisualizerConfig = {
  mode: "bars",
  bars: {
    count: 64,
    color: 0x00e5ff,
    maxHeight: 260,
    widthRatio: 0.18,
    spacing: 4,
  },
  radial: {
    count: 96,
    color: 0xff4df0,
    innerRadius: 110,
    maxLength: 140,
    thickness: 4,
  },
  background: {
    color: 0x1ff120,
    imageUrl: "/demo/demo.png", // optional
    imageAlpha: 0.85,
  },
};