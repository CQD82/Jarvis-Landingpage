import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコサシスセソタチツテト";
const FONT_SIZE = 14;

/** Falling-code backdrop, scoped to its container (not full-page). Skips entirely under reduced motion. */
export function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let frameId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.max(1, Math.floor(width / FONT_SIZE));
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 5, 0, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#22c55e";
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
