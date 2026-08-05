import { useEffect, useState } from "react";

export interface NodeState {
  id: string;
  status: "online" | "suspended";
}

const NODE_COUNT = 18;
// The last node slot stands in for the GPU tier (the Z840) — the one that
// actually cycles suspended/online, illustrating the Wake-on-LAN story from
// the power-consumption section.
const GPU_NODE_INDEX = NODE_COUNT - 1;

const BASE_POWER_W = 165;
const GPU_AWAKE_POWER_W = 250;
const GPU_AWAKE_MS = 6000;
const GPU_CYCLE_MS = 22000;
const POWER_TICK_MS = 1800;

function buildNodes(gpuOnline: boolean): NodeState[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: `N${String(i + 1).padStart(2, "0")}`,
    status: i === GPU_NODE_INDEX && !gpuOnline ? "suspended" : "online",
  }));
}

/**
 * Illustrative simulation — not a real telemetry feed. This is a static
 * marketing page with no backend link to the private cluster, so "live"
 * status here means "animated and plausible", not "measured". The GPU node
 * periodically wakes (matching the Wake-on-LAN behavior described in the
 * power section) so the three HUD skins have something to visibly react to.
 */
export function useSimulatedTelemetry() {
  const [gpuOnline, setGpuOnline] = useState(false);
  const [powerW, setPowerW] = useState(BASE_POWER_W);

  useEffect(() => {
    let awakeTimer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setGpuOnline(true);
      awakeTimer = setTimeout(() => setGpuOnline(false), GPU_AWAKE_MS);
    };
    const firstRun = setTimeout(wake, 4000);
    const interval = setInterval(wake, GPU_CYCLE_MS);
    return () => {
      clearTimeout(firstRun);
      clearTimeout(awakeTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const jitter = (Math.random() - 0.5) * 12;
      const base = BASE_POWER_W + (gpuOnline ? GPU_AWAKE_POWER_W : 0);
      setPowerW(Math.round(base + jitter));
    };
    tick();
    const interval = setInterval(tick, POWER_TICK_MS);
    return () => clearInterval(interval);
  }, [gpuOnline]);

  return { nodes: buildNodes(gpuOnline), powerW, gpuOnline };
}
