'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { STORY_BEATS, StoryBeat } from './ScrollSequence';
import styles from './BeatNav.module.css';

export default function BeatNav() {
  const [activeBeat, setActiveBeat] = useState<StoryBeat | null>(null);
  const [scrollPct,  setScrollPct]  = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = Math.max(0, Math.min(1, window.scrollY / docH));
      setScrollPct(pct);

      let found: StoryBeat | null = null;
      for (const b of STORY_BEATS) {
        if (pct >= b.startPct && pct <= b.endPct) { found = b; break; }
      }
      setActiveBeat(found);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.container} aria-label="Section progress">
      {STORY_BEATS.map((beat) => {
        const isActive = activeBeat?.id === beat.id;
        const isPast   = scrollPct > beat.endPct;
        return (
          <button
            key={beat.id}
            id={`beat-nav-${beat.id}`}
            className={`${styles.dot} ${isActive ? styles.dotActive : ''} ${isPast ? styles.dotPast : ''}`}
            aria-label={`Jump to ${beat.overline || beat.id}`}
            onClick={() => {
              const target = beat.startPct + (beat.endPct - beat.startPct) * 0.1;
              const docH = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: target * docH, behavior: 'smooth' });
            }}
          >
            {isActive && (
              <motion.span
                className={styles.dotRing}
                layoutId="beatRing"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
