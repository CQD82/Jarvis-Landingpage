import { useEffect, useState } from "react";

export interface NodeState {
  id: string;
  status: "online" | "suspended";
}

const NODE_COUNT = 18;

/** Roughly the continuous draw from the power section (~270 W). */
const BASE_POWER_W = 270;
const POWER_TICK_MS = 1800;

/**
 * Illustrative simulation — not a real telemetry feed. This is a static
 * marketing page with no backend link to the private cluster, so "live"
 * status here means "animated and plausible", not "measured".
 *
 * Since go-live the GPU workstation runs continuously (the voice model stays
 * loaded for fast replies), so every node reports online and only the power
 * reading jitters. Wake-on-LAN power saving is prepared but not in use yet.
 */
export function useSimulatedTelemetry() {
  const gpuOnline = true;
  const [powerW, setPowerW] = useState(BASE_POWER_W);

  useEffect(() => {
    const tick = () => setPowerW(Math.round(BASE_POWER_W + (Math.random() - 0.5) * 12));
    tick();
    const interval = setInterval(tick, POWER_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const nodes: NodeState[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: `N${String(i + 1).padStart(2, "0")}`,
    status: "online",
  }));

  return { nodes, powerW, gpuOnline };
}
