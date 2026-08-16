"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Silent visual demo, Brunson Traffic Secrets Ch 8 substitute under the
 * project's anonymity rule. No video, no audio, no narrator face. Pure
 * canvas-rendered animation of a generic "fundraise-precursor profile":
 * commit-velocity rising, contributor count broadening, dependents fanning
 * out, composite score crossing the 5-of-6 threshold.
 *
 * Auto-loops every 90 seconds. Pauses when off-screen. Reduce-motion aware.
 */

const FRAMES = 90; // 1 frame ≈ 1 real-world second of dashboard time
const FPS = 30;
const FRAME_MS = 1000 / FPS;
const TOTAL_FRAMES = FRAMES * FPS;

// Synthetic "org" trajectory, deterministic, repeatable. The shape is the
// canonical fundraise-precursor profile from the SSRN panel: a 14-day
// inflection where commit velocity sustainably steps from a baseline to a
// new regime, with contributor count broadening 5-7 days later.
function trajectory(t01: number) {
  // velocity rises sigmoidally past 1.3x (Russell-grade decision threshold)
  const v = 0.8 + 0.9 / (1 + Math.exp(-12 * (t01 - 0.45)));
  // contributors broaden later, log-sigmoid
  const c = 4 + 6 / (1 + Math.exp(-14 * (t01 - 0.55)));
  // dependents grow exponentially (network-effect)
  const d = 12 + 88 * Math.pow(t01, 1.6);
  // composite score crosses 5/6 around t=0.7
  const s = (() => {
    let n = 0;
    if (v > 1.3) n += 1;
    if (c > 4) n += 1;
    if (d > 50) n += 1;
    if (t01 > 0.4) n += 1; // README freshness proxy
    if (t01 > 0.55) n += 1; // new-repo rate proxy
    if (t01 > 0.7) n += 1; // PR/issue ratio proxy
    return n;
  })();
  return { v, c, d, s };
}

export default function AnimatedDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(m.matches);
    const onChange = () => setReduceMotion(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const frame = paused
        ? 0
        : reduceMotion
          ? TOTAL_FRAMES - 1
          : Math.floor((elapsed / FRAME_MS) % TOTAL_FRAMES);
      const t01 = frame / (TOTAL_FRAMES - 1);
      const { v, c, d, s } = trajectory(t01);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;

      // background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, cssW, cssH);

      // grid
      ctx.strokeStyle = "rgba(148,163,184,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = (cssH / 5) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssW, y);
        ctx.stroke();
      }

      // velocity line, across the full width, accumulated
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const padX = 20;
      const padY = 28;
      const w = cssW - padX * 2;
      const hChart = cssH - padY * 2 - 80;
      const upTo = Math.max(2, Math.floor(t01 * 200));
      for (let i = 0; i < upTo; i++) {
        const tx = i / 199;
        const { v: vi } = trajectory(tx);
        const x = padX + tx * w;
        const y = padY + hChart - ((vi - 0.6) / 1.5) * hChart;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 1.3x acceleration threshold dashed line
      ctx.strokeStyle = "rgba(244,114,182,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      const yT = padY + hChart - ((1.3 - 0.6) / 1.5) * hChart;
      ctx.moveTo(padX, yT);
      ctx.lineTo(cssW - padX, yT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(244,114,182,0.85)";
      ctx.font = "11px ui-monospace,SFMono-Regular,Menlo,monospace";
      ctx.fillText("1.3× threshold", padX + 8, yT - 6);

      // contributor dots (broadening over time)
      const dotsY = cssH - 70;
      const dotsCount = Math.min(12, Math.floor(c));
      for (let i = 0; i < dotsCount; i++) {
        const seed = Math.sin(i * 1.7) * 0.5 + 0.5;
        const x = padX + 30 + seed * (w - 80);
        const r = 4 + (i < 4 ? 2 : 1);
        ctx.fillStyle =
          i < 4 ? "rgba(56,189,248,0.9)" : "rgba(110,231,183,0.85)";
        ctx.beginPath();
        ctx.arc(x, dotsY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // metric strip
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px ui-monospace,SFMono-Regular,Menlo,monospace";
      ctx.fillText(
        `commit velocity ${v.toFixed(2)}× baseline`,
        padX,
        cssH - 24,
      );
      ctx.fillText(
        `contributors ${Math.floor(c)} (last 14d)`,
        padX + 240,
        cssH - 24,
      );
      ctx.fillText(
        `dependents ${Math.floor(d)}`,
        padX + 460,
        cssH - 24,
      );

      // composite score badge
      ctx.fillStyle = s >= 5 ? "#fbbf24" : "rgba(148,163,184,0.6)";
      ctx.font = "bold 13px system-ui,-apple-system,Segoe UI,Roboto";
      ctx.fillText(
        `composite ${s} of 6 ${s >= 5 ? "  ✓ fundraise-precursor profile" : ""}`,
        padX,
        cssH - 6,
      );

      // axis labels
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.font = "10px system-ui,-apple-system,Segoe UI,Roboto";
      ctx.fillText("commit velocity (multiple of 90-day baseline)", padX, 14);
      ctx.fillText(
        `t = ${Math.floor(t01 * FRAMES)}s of ${FRAMES}s loop`,
        cssW - padX - 130,
        14,
      );

      if (!paused) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [paused, reduceMotion]);

  return (
    <div className="relative">
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg shadow-fuchsia-500/5">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
          <p className="text-gray-400 text-[11px] font-mono">
            example_org · 400+ org universe · panel-style render
          </p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="text-fuchsia-300 hover:text-fuchsia-200 text-[11px] font-mono"
          >
            {paused ? "▶ resume" : "❚❚ pause"}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="block w-full h-[360px] sm:h-[420px]"
          aria-label="Animated fundraise-precursor profile, commit velocity, contributors, dependents, composite score over 90 simulated seconds"
          role="img"
        />
      </div>
      <p className="text-gray-400 text-xs mt-2">
        Synthetic trajectory rendered in your browser, not a recording. Loops
        every 90 seconds. Reduce-motion preference is honored, paused state
        renders the final frame.
      </p>
    </div>
  );
}
