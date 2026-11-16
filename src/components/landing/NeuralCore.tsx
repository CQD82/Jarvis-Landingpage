import { useEffect, useRef } from "react";

/**
 * Simulated "neuron network" core of the kiosk HUD ("Nachtblau" design):
 * a breathing sphere of light threads with a white centre, nerve fibres
 * (cubic curves) running out to six labelled regions, a few free fibres,
 * and signal pulses travelling outwards. Own drawing, illustrative only.
 *
 * Canvas for the graphics, DOM for the labels (crisp text, translatable,
 * readable by screen readers). Pauses when off-screen; with reduced motion
 * a single still frame is drawn.
 */

export interface CoreRegion {
  label: string;
  /** Anchor in the unit square (0..1), where the fibres end and the label sits. */
  x: number;
  y: number;
  color: string;
}

interface Props {
  regions: CoreRegion[];
  activeLabel: string;
  reduceMotion: boolean;
}

type P = [number, number];

interface Fiber {
  p0: P;
  p1: P;
  p2: P;
  p3: P;
  color: string;
  alpha: number;
}

interface Pulse {
  fiber: number;
  t: number;
  speed: number;
}

const CORE_R = 0.16;
const FIBERS_PER_REGION = 9;
const FREE_FIBERS = 20;
const SPHERE_POINTS = 320;
const PULSES = 26;

/** Small deterministic PRNG so the layout is stable between renders. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function bezier(f: Fiber, t: number): P {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * f.p0[0] + b * f.p1[0] + c * f.p2[0] + d * f.p3[0], a * f.p0[1] + b * f.p1[1] + c * f.p2[1] + d * f.p3[1]];
}

function buildFibers(regions: CoreRegion[]): Fiber[] {
  const rand = rng(46);
  const fibers: Fiber[] = [];
  const make = (angle: number, end: P, color: string, alpha: number) => {
    const dir: P = [Math.cos(angle), Math.sin(angle)];
    const perp: P = [-dir[1], dir[0]];
    const p0: P = [0.5 + dir[0] * CORE_R * 0.9, 0.5 + dir[1] * CORE_R * 0.9];
    const bend = (rand() - 0.5) * 0.35;
    const p1: P = [p0[0] + dir[0] * 0.14 + perp[0] * bend, p0[1] + dir[1] * 0.14 + perp[1] * bend];
    const p2: P = [end[0] - dir[0] * 0.1 - perp[0] * bend * 0.6, end[1] - dir[1] * 0.1 - perp[1] * bend * 0.6];
    fibers.push({ p0, p1, p2, p3: end, color, alpha });
  };
  for (const r of regions) {
    const base = Math.atan2(r.y - 0.5, r.x - 0.5);
    for (let i = 0; i < FIBERS_PER_REGION; i++) {
      const angle = base + (rand() - 0.5) * 0.9;
      const end: P = [r.x + (rand() - 0.5) * 0.12, r.y + (rand() - 0.5) * 0.1];
      make(angle, end, r.color, 0.35 + rand() * 0.35);
    }
  }
  for (let i = 0; i < FREE_FIBERS; i++) {
    const angle = rand() * Math.PI * 2;
    const len = 0.22 + rand() * 0.22;
    const end: P = [0.5 + Math.cos(angle) * len, 0.5 + Math.sin(angle) * len * 0.85];
    make(angle, end, i % 2 ? "#3d8bff" : "#9b7bff", 0.18 + rand() * 0.2);
  }
  return fibers;
}

function buildSphere(): [number, number, number][] {
  // Fibonacci sphere: evenly spread points.
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < SPHERE_POINTS; i++) {
    const y = 1 - (i / (SPHERE_POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

export function NeuralCore({ regions, activeLabel, reduceMotion }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fibers = buildFibers(regions);
    const sphere = buildSphere();
    const rand = rng(7);
    const pulses: Pulse[] = Array.from({ length: PULSES }, () => ({
      fiber: Math.floor(rand() * fibers.length),
      t: rand(),
      speed: 0.0025 + rand() * 0.004,
    }));

    let size = 0;
    let frame = 0;
    let visible = true;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = wrap.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const s = size;
      ctx.clearRect(0, 0, s, s);
      ctx.globalCompositeOperation = "lighter";

      // Fibres
      ctx.lineWidth = Math.max(0.6, s / 520);
      for (const f of fibers) {
        ctx.strokeStyle = f.color;
        ctx.globalAlpha = f.alpha * 0.8;
        ctx.beginPath();
        ctx.moveTo(f.p0[0] * s, f.p0[1] * s);
        ctx.bezierCurveTo(f.p1[0] * s, f.p1[1] * s, f.p2[0] * s, f.p2[1] * s, f.p3[0] * s, f.p3[1] * s);
        ctx.stroke();
        // node at the fibre end ("constellation" point)
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.p3[0] * s, f.p3[1] * s, Math.max(0.8, s / 380), 0, Math.PI * 2);
        ctx.fill();
      }

      // Signal pulses travelling outwards
      for (const p of pulses) {
        const f = fibers[p.fiber];
        const [x, y] = bezier(f, p.t);
        const g = ctx.createRadialGradient(x * s, y * s, 0, x * s, y * s, s / 70);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.4, f.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.9 * Math.sin(Math.PI * p.t);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x * s, y * s, s / 70, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glow behind the core
      const cx = s / 2;
      const cy = s / 2;
      const breathe = 1 + Math.sin(time * 0.0016) * 0.04;
      const R = CORE_R * s * breathe;
      ctx.globalAlpha = 1;
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.4);
      halo.addColorStop(0, "rgba(92,225,255,0.35)");
      halo.addColorStop(0.5, "rgba(61,139,255,0.12)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Rotating sphere of light threads
      const rot = time * 0.00035;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      for (let i = 0; i < sphere.length; i++) {
        const [x0, y0, z0] = sphere[i];
        const wobble = 1 + 0.07 * Math.sin(time * 0.002 + i * 0.7);
        const x = (x0 * cos - z0 * sin) * wobble;
        const z = (x0 * sin + z0 * cos) * wobble;
        const y = y0 * wobble;
        const depth = (z + 1) / 2; // 0 back .. 1 front
        ctx.globalAlpha = 0.25 + depth * 0.7;
        ctx.strokeStyle = depth > 0.6 ? "#c9f4ff" : "#5ce1ff";
        ctx.lineWidth = Math.max(0.6, s / 600);
        const px = cx + x * R;
        const py = cy + y * R;
        // short tangential streak = "light thread"
        const tx = -y0 * 0.06 * R;
        const ty = x * 0.06 * R;
        ctx.beginPath();
        ctx.moveTo(px - tx, py - ty);
        ctx.lineTo(px + tx, py + ty);
        ctx.stroke();
      }

      // White core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.7);
      core.addColorStop(0, "rgba(255,255,255,0.95)");
      core.addColorStop(0.35, "rgba(201,244,255,0.6)");
      core.addColorStop(1, "rgba(92,225,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    };

    const step = (now: number) => {
      time = now;
      for (const p of pulses) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.fiber = Math.floor(rand() * fibers.length);
        }
      }
      draw();
      if (visible) frame = requestAnimationFrame(step);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    ro.observe(wrap);

    if (reduceMotion) {
      draw();
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) frame = requestAnimationFrame(step);
    });
    io.observe(wrap);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [regions, reduceMotion]);

  return (
    <div ref={wrapRef} className="relative aspect-square w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />
      <ul className="absolute inset-0">
        {regions.map((r) => (
          <li
            key={r.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-mono leading-tight whitespace-nowrap"
            style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }}
          >
            <span className="block text-[0.55rem] tracking-[0.3em] sm:text-[0.62rem]" style={{ color: "#e6f1ff", textShadow: `0 0 8px ${r.color}` }}>
              {r.label}
            </span>
            <span className="mt-0.5 flex items-center justify-center gap-1 text-[0.48rem] tracking-[0.2em] text-[#7fd49b] uppercase sm:text-[0.52rem]">
              <span className="size-1 rounded-full bg-[#7fd49b]" aria-hidden="true" />
              {activeLabel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
