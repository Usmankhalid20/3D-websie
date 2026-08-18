'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import styles from './ScrollSequence.module.css';

// ─── Config ──────────────────────────────────────────────────────────────────
const TOTAL_FRAMES  = 240;
const FRAMES_PATH   = '/frames/';
const FRAME_PREFIX  = 'ezgif-frame-';
const FRAME_EXT     = '.jpg';
const PRELOAD_FIRST = 24;

// ─── Non-linear frame mapping ─────────────────────────────────────────────────
// Forward  0% → 84%  scroll : frames   0 → 220
// Reverse 84% → 100% scroll : frames 220 →   0  (reassembly)
function mapProgressToFrame(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.84) {
    return Math.round((p / 0.84) * 220);
  }
  const r = (p - 0.84) / 0.16;
  return Math.round(220 - r * 220);
}

// ─── Section / beat definitions (13 sections) ────────────────────────────────
export interface StoryBeat {
  startPct:    number;
  endPct:      number;
  id:          string;
  index:       number;          // 1-based section number
  label:       string;          // short label for navigator
  overline?:   string;
  headline:    string;
  body?:       string;
  highlights?: string[];
  stat?:       { value: string; unit: string; label: string };
  align:       'left' | 'right' | 'center' | 'center-large';
}

export const STORY_BEATS: StoryBeat[] = [
  {
    index: 1, id: 'icon',
    startPct: 0,    endPct: 0.08,
    label: 'The Icon',
    overline: 'Tissot 1853',
    headline: 'PRX\nPowermatic 80',
    body: 'Swiss craftsmanship. Modern design. Mechanical precision.',
    align: 'left',
  },
  {
    index: 2, id: 'silhouette',
    startPct: 0.08,  endPct: 0.16,
    label: 'The Silhouette',
    overline: 'Design',
    headline: 'Designed\nas one.',
    body: 'A distinctive integrated silhouette where the case and bracelet become a single visual language.',
    highlights: ['Integrated bracelet', 'Angular case geometry', 'Slim 11.19 mm profile'],
    align: 'right',
  },
  {
    index: 3, id: 'case',
    startPct: 0.16,  endPct: 0.25,
    label: 'The Case',
    overline: 'The Case',
    headline: 'Precision in\nevery surface.',
    body: 'Brushed planes meet polished edges to create depth, contrast, and character.',
    highlights: ['Brushed surfaces', 'Polished bevels', 'Crown at 3 o\'clock', 'Sapphire crystal edge'],
    align: 'left',
  },
  {
    index: 4, id: 'crystal',
    startPct: 0.25,  endPct: 0.32,
    label: 'The Crystal',
    overline: 'Sapphire Crystal',
    headline: 'Clarity,\nengineered.',
    body: 'Anti-reflective sapphire glass — harder than steel, transparent to the mechanics within.',
    align: 'right',
  },
  {
    index: 5, id: 'dial',
    startPct: 0.32,  endPct: 0.42,
    label: 'The Dial',
    overline: 'The Dial',
    headline: 'Detail\nyou can see.',
    body: 'A geometric dial texture creates depth beneath polished applied markers and hands.',
    highlights: ['Waffle-pattern surface', 'Applied polished indices', 'Date aperture at 3'],
    align: 'left',
  },
  {
    index: 6, id: 'hands',
    startPct: 0.42,  endPct: 0.48,
    label: 'The Hands',
    overline: 'The Hands',
    headline: 'Every second,\nprecisely measured.',
    body: 'Three polished hands. One central pinion. An infinite conversation with time.',
    align: 'right',
  },
  {
    index: 7, id: 'date',
    startPct: 0.48,  endPct: 0.53,
    label: 'The Date',
    overline: 'Date Mechanism',
    headline: 'Precision,\ndown to the date.',
    body: 'A date aperture precisely positioned, driven by a mechanical disc beneath the dial.',
    align: 'left',
  },
  {
    index: 8, id: 'movement',
    startPct: 0.53,  endPct: 0.68,
    label: 'The Movement',
    overline: 'Inside the Precision',
    headline: 'Powermatic 80\nautomatically yours.',
    body: 'The Powermatic 80 automatic movement brings 170 years of watchmaking knowledge to the heart of the PRX.',
    highlights: ['Automatic self-winding', 'LIGA silicon components', 'Glucydur alloy balance wheel', '25 jewels'],
    align: 'right',
  },
  {
    index: 9, id: 'mechanics',
    startPct: 0.68,  endPct: 0.78,
    label: 'The Mechanics',
    overline: 'Mechanical Engineering',
    headline: 'Mechanical,\nby nature.',
    body: 'Every component works as part of a precisely coordinated mechanical system — engineered to endure.',
    highlights: ['Gear train', 'Balance spring', 'Escapement mechanism', 'Automatic rotor'],
    align: 'left',
  },
  {
    index: 10, id: 'power',
    startPct: 0.78,  endPct: 0.84,
    label: '80 Hours',
    overline: 'Power Reserve',
    headline: '80',
    body: 'Hours of mechanical autonomy. Engineered to keep moving long after the day ends.',
    stat: { value: '80', unit: 'hrs', label: 'Power Reserve' },
    align: 'center-large',
  },
  {
    index: 11, id: 'bracelet',
    startPct: 0.84,  endPct: 0.90,
    label: 'The Bracelet',
    overline: 'The Bracelet',
    headline: 'Integrated\nby design.',
    body: 'A continuous connection between the case and the wrist — where engineering meets elegance.',
    highlights: ['Individual brushed links', 'Polished link edges', 'Folding safety clasp'],
    align: 'right',
  },
  {
    index: 12, id: 'assembly',
    startPct: 0.90,  endPct: 0.96,
    label: 'The Assembly',
    overline: 'Coming Together',
    headline: 'Assembled\nwith intention.',
    body: 'Every component returns to its precise position. 168 parts becoming one.',
    align: 'left',
  },
  {
    index: 13, id: 'finish',
    startPct: 0.96,  endPct: 1.0,
    label: 'The Finish',
    overline: 'Tissot PRX Powermatic 80',
    headline: 'Built to become\ntimeless.',
    body: 'Swiss craftsmanship, engineered for modern life.',
    align: 'center',
  },
];

interface Props {
  onBeatChange?:    (beat: StoryBeat | null) => void;
  onLoadProgress?:  (pct: number) => void;
  onScrollPct?:     (pct: number) => void;
}

export default function ScrollSequence({ onBeatChange, onLoadProgress, onScrollPct }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const imagesRef       = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const loadedRef       = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const loadedCountRef  = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);
  const activeBeatRef   = useRef<string | null>(null);

  // Frame URL
  const frameUrl = useCallback((i: number) => {
    const n = String(i + 1).padStart(3, '0');
    return `${FRAMES_PATH}${FRAME_PREFIX}${n}${FRAME_EXT}`;
  }, []);

  // Cover-fit draw (CSS-pixel space, canvas already scaled via ctx.scale)
  const drawImageCover = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cssW: number, cssH: number) => {
      const iw = img.naturalWidth  || 1440;
      const ih = img.naturalHeight || 810;
      const s  = Math.max(cssW / iw, cssH / ih);
      ctx.drawImage(img, (cssW - iw * s) / 2, (cssH - ih * s) / 2, iw * s, ih * s);
    }, []
  );

  // Draw frame — bidirectional nearest-loaded fallback
  const drawFrame = useCallback((targetIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;

    let idx = targetIdx;
    if (!loadedRef.current[idx]) {
      let lo = idx - 1, hi = idx + 1, found = false;
      while (lo >= 0 || hi < TOTAL_FRAMES) {
        if (lo >= 0 && loadedRef.current[lo])         { idx = lo; found = true; break; }
        if (hi < TOTAL_FRAMES && loadedRef.current[hi]) { idx = hi; found = true; break; }
        lo--; hi++;
      }
      if (!found) return;
    }
    const img = imagesRef.current[idx];
    if (!img) return;
    ctx.clearRect(0, 0, cssW, cssH);
    drawImageCover(ctx, img, cssW, cssH);
  }, [drawImageCover]);

  // Resize — reset transform to avoid DPR accumulation
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = window.innerWidth;
    const h   = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width        = Math.round(w * dpr);
    canvas.height       = Math.round(h * dpr);
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    if (ctx) ctx.scale(dpr, dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Progressive image loading
  const preloadFrames = useCallback(() => {
    const loadOne = (i: number) => {
      if (i < 0 || i >= TOTAL_FRAMES || loadedRef.current[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(i);
      img.onload = () => {
        imagesRef.current[i] = img;
        loadedRef.current[i] = true;
        loadedCountRef.current++;
        if (i === 0) drawFrame(0);
        onLoadProgress?.(loadedCountRef.current / TOTAL_FRAMES);
      };
    };
    // First batch — critical for LCP
    for (let i = 0; i < PRELOAD_FIRST; i++) loadOne(i);
    // Stream the rest
    setTimeout(() => {
      let i = PRELOAD_FIRST;
      const tick = () => { if (i < TOTAL_FRAMES) { loadOne(i++); setTimeout(tick, 2); } };
      tick();
    }, 200);
  }, [frameUrl, drawFrame, onLoadProgress]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect      = container.getBoundingClientRect();
    const maxScroll = container.offsetHeight - window.innerHeight;
    const progress  = Math.max(0, Math.min(1, -rect.top / maxScroll));

    onScrollPct?.(progress);

    const frameIdx = mapProgressToFrame(progress);
    if (frameIdx !== currentFrameRef.current) {
      currentFrameRef.current = frameIdx;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameIdx));
    }

    if (onBeatChange) {
      let found: StoryBeat | null = null;
      for (const b of STORY_BEATS) {
        if (progress >= b.startPct && progress <= b.endPct) { found = b; break; }
      }
      const newId = found?.id ?? null;
      if (newId !== activeBeatRef.current) {
        activeBeatRef.current = newId;
        onBeatChange(found);
      }
    }
  }, [drawFrame, onBeatChange, onScrollPct]);

  useEffect(() => {
    preloadFrames();
    resizeCanvas();
    onBeatChange?.(STORY_BEATS[0]);
    activeBeatRef.current = STORY_BEATS[0].id;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas,  { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [preloadFrames, resizeCanvas, handleScroll, onBeatChange]);

  return (
    <div
      ref={containerRef}
      className={styles.sequenceContainer}
      aria-label="Interactive Tissot PRX Powermatic 80 cinematic disassembly experience"
    >
      <div className={styles.stickyLayer}>
        <div className={styles.radialGlow}   aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.vignette}     aria-hidden="true" />
        <div className={styles.bottomFade}   aria-hidden="true" />
      </div>
    </div>
  );
}
