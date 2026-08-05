import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number;
}

const LINK_DISTANCE = 150;
const GOLD_RGB = "242, 181, 69";
const REACTOR_RGB = "189, 238, 255";

function particleCountFor(width: number) {
  return Math.round(Math.min(85, Math.max(26, width / 18)));
}

/**
 * Full-viewport neural-network ambience: drifting nodes, distance-based
 * connecting lines, and the occasional "synapse fire" pulse traveling
 * along a link — the AI motif behind the whole page. Fixed + pointer-events
 * none, sits behind all real content. Renders one static frame instead of
 * looping under prefers-reduced-motion.
 */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionEnabled = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];
    let frameId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: particleCountFor(width) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
      pulses = [];
    };
    resize();
    window.addEventListener("resize", resize);

    const drawLinks = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${GOLD_RGB}, ${(1 - dist / LINK_DISTANCE) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawNodes = () => {
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_RGB}, 0.45)`;
        ctx.fill();
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      if (motionEnabled) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      }

      drawLinks();
      drawNodes();

      if (motionEnabled) {
        if (Math.random() < 0.02 && particles.length > 1) {
          const from = Math.floor(Math.random() * particles.length);
          let to = Math.floor(Math.random() * particles.length);
          if (to === from) to = (to + 1) % particles.length;
          pulses.push({ from, to, t: 0 });
        }

        pulses = pulses.filter((pulse) => pulse.t <= 1);
        for (const pulse of pulses) {
          const a = particles[pulse.from];
          const b = particles[pulse.to];
          if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * pulse.t;
          const y = a.y + (b.y - a.y) * pulse.t;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${REACTOR_RGB}, 0.85)`;
          ctx.shadowColor = `rgba(${REACTOR_RGB}, 0.9)`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
          pulse.t += 0.018;
        }
      }
    };

    if (motionEnabled) {
      const loop = () => {
        step();
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    } else {
      step();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-20"
      aria-hidden="true"
    />
  );
}
