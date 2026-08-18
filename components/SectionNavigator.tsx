'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_BEATS, StoryBeat } from './ScrollSequence';
import styles from './SectionNavigator.module.css';

export default function SectionNavigator() {
  const [activeBeat,  setActiveBeat]  = useState<StoryBeat | null>(STORY_BEATS[0]);
  const [scrollPct,   setScrollPct]   = useState(0);
  const [expanded,    setExpanded]    = useState(false);
  const [visible,     setVisible]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = Math.max(0, Math.min(1, window.scrollY / docH));
      setScrollPct(pct);
      setVisible(pct > 0.02);

      let found: StoryBeat | null = null;
      for (const b of STORY_BEATS) {
        if (pct >= b.startPct && pct <= b.endPct) { found = b; break; }
      }
      setActiveBeat(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jumpTo = (beat: StoryBeat) => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const target = beat.startPct + (beat.endPct - beat.startPct) * 0.05;
    window.scrollTo({ top: target * docH, behavior: 'smooth' });
    setExpanded(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className={styles.container}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Section navigation"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          {/* Vertical progress track */}
          <div className={styles.track} aria-hidden="true">
            <div className={styles.trackFill} style={{ height: `${scrollPct * 100}%` }} />
          </div>

          {/* Section list */}
          <ul className={styles.list} role="list">
            {STORY_BEATS.map((beat) => {
              const isActive = activeBeat?.id === beat.id;
              const isPast   = scrollPct > beat.endPct;
              return (
                <li key={beat.id}>
                  <button
                    id={`nav-section-${beat.id}`}
                    className={`${styles.item} ${isActive ? styles.itemActive : ''} ${isPast ? styles.itemPast : ''}`}
                    onClick={() => jumpTo(beat)}
                    aria-label={`Go to section ${beat.index}: ${beat.label}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {/* Dot */}
                    <span className={styles.itemDot} aria-hidden="true">
                      {isActive && (
                        <motion.span
                          className={styles.itemDotRing}
                          layoutId="navActiveRing"
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                    </span>

                    {/* Label — shown on hover/expanded */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          className={styles.itemLabel}
                          initial={{ opacity: 0, x: 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 4 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className={styles.itemNum}>
                            {String(beat.index).padStart(2, '0')}
                          </span>
                          {beat.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
