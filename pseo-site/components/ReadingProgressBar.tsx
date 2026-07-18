"use client";

import { useEffect, useState } from "react";

/**
 * ReadingProgressBar — Fixed top bar showing scroll progress.
 * Signals dark theme variant (slate-900 background).
 */
export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 z-[100] h-[3px]"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
      }}
    />
  );
}
