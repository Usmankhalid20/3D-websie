'use client';

import { useEffect, useRef, useCallback } from 'react';
import React from 'react';

interface Props {
  /** Multiplier for cursor influence (default 0.008 = very subtle) */
  strength?: number;
  children:  React.ReactNode;
  className?: string;
  style?:    React.CSSProperties;
}

/**
 * CursorParallax — wraps children in a div that applies a subtle LERP-based
 * translate driven by cursor position. Creates depth without layout impact.
 * Runs entirely on requestAnimationFrame + CSS transform (no reflow).
 */
export default function CursorParallax({ strength = 0.008, children, className, style }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const curNorm = useRef({ x: 0, y: 0 }); // normalized -1 → +1
  const live   = useRef({ x: 0, y: 0 });  // lerped position
  const rafId  = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (!ref.current) { rafId.current = requestAnimationFrame(tick); return; }
    // LERP toward cursor
    live.current.x += (curNorm.current.x - live.current.x) * 0.055;
    live.current.y += (curNorm.current.y - live.current.y) * 0.055;
    const tx = live.current.x * strength * window.innerWidth  * 0.5;
    const ty = live.current.y * strength * window.innerHeight * 0.5;
    ref.current.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`;
    rafId.current = requestAnimationFrame(tick);
  }, [strength]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      curNorm.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      curNorm.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [tick]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}
