'use client';

import { useState, useCallback, useRef } from 'react';
import Navbar             from '@/components/Navbar';
import ScrollSequence, { StoryBeat } from '@/components/ScrollSequence';
import StoryOverlay       from '@/components/StoryOverlay';
import ScrollIndicator    from '@/components/ScrollIndicator';
import SectionNavigator   from '@/components/SectionNavigator';
import SpecsSection       from '@/components/SpecsSection';
import HeritageSection    from '@/components/HeritageSection';
import LoadingScreen      from '@/components/LoadingScreen';
import CursorParallax     from '@/components/CursorParallax';
import styles             from './page.module.css';

export default function Home() {
  const [activeBeat,   setActiveBeat]   = useState<StoryBeat | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollPct,    setScrollPct]    = useState(0);

  const handleBeat     = useCallback((b: StoryBeat | null) => setActiveBeat(b), []);
  const handleProgress = useCallback((p: number)           => setLoadProgress(p), []);
  const handleScroll   = useCallback((p: number)           => setScrollPct(p), []);

  return (
    <>
      {/* ── Cinematic loading screen ── */}
      <LoadingScreen progress={loadProgress} />

      <main className={styles.main} id="hero">
        {/* ── Fixed UI layer ── */}
        <Navbar />
        <SectionNavigator />
        <ScrollIndicator />

        {/* ── Story text overlay (cursor-parallax shifted) ── */}
        <CursorParallax strength={0.008} className={styles.overlayParallax}>
          <StoryOverlay beat={activeBeat} scrollPct={scrollPct} />
        </CursorParallax>

        {/* ── Scroll-driven canvas image sequence (core mechanic) ── */}
        <ScrollSequence
          onBeatChange={handleBeat}
          onLoadProgress={handleProgress}
          onScrollPct={handleScroll}
        />

        {/* ── Below-fold editorial content ── */}
        <HeritageSection />
        <SpecsSection />
      </main>
    </>
  );
}
