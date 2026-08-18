'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { StoryBeat } from './ScrollSequence';
import styles from './StoryOverlay.module.css';

interface Props {
  beat:       StoryBeat | null;
  scrollPct?: number;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const wrapVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  exit:    { opacity: 0, transition: { duration: 0.28, ease: EASE } },
};

const itemUp: Variants = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

const itemLeft: Variants = {
  hidden:  { opacity: 0, x: -16, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0,   filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
};

const statVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.88, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: { duration: 1.0, ease: EASE } },
};

// Inner-beat progress bar
function BeatProgress({ beat, scrollPct }: { beat: StoryBeat; scrollPct: number }) {
  const range  = beat.endPct - beat.startPct;
  const local  = Math.max(0, Math.min(1, (scrollPct - beat.startPct) / range));
  return (
    <div className={styles.progressTrack} aria-hidden="true">
      <motion.div
        className={styles.progressFill}
        animate={{ scaleX: local }}
        transition={{ duration: 0.08, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
}

export default function StoryOverlay({ beat, scrollPct = 0 }: Props) {
  if (!beat) return null;

  const isCenterLarge = beat.align === 'center-large';
  const isCenter      = beat.align === 'center' || isCenterLarge;
  const isRight       = beat.align === 'right';

  const alignClass = isRight       ? styles.alignRight
                   : isCenterLarge ? styles.alignCenterLarge
                   : isCenter      ? styles.alignCenter
                   :                 styles.alignLeft;

  return (
    <div className={`${styles.overlay} ${alignClass}`} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={beat.id}
          className={styles.beatWrap}
          variants={wrapVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── SPECIAL: stat display for 80-hours ── */}
          {isCenterLarge && beat.stat ? (
            <div className={styles.statBlock}>
              <motion.div variants={statVariants} className={styles.statOverline}>
                {beat.overline}
              </motion.div>
              <motion.div variants={statVariants} className={styles.statNumber}>
                {beat.stat.value}
                <span className={styles.statUnit}>{beat.stat.unit}</span>
              </motion.div>
              <motion.p variants={itemUp} className={styles.statBody}>
                {beat.body}
              </motion.p>
              <motion.div variants={itemUp}>
                <BeatProgress beat={beat} scrollPct={scrollPct} />
              </motion.div>
            </div>
          ) : (
            /* ── Standard layout ── */
            <>
              {/* Section number + overline */}
              <motion.div variants={itemLeft} className={styles.topLine}>
                <span className={styles.sectionIndex}>
                  {String(beat.index).padStart(2, '0')}
                </span>
                {beat.overline && (
                  <>
                    <span className={styles.topLineSep} aria-hidden="true" />
                    <span className={styles.overline}>{beat.overline}</span>
                  </>
                )}
              </motion.div>

              {/* Headline */}
              <motion.h2 variants={itemUp} className={styles.headline}>
                {beat.headline.split('\n').map((line, i) => (
                  <span key={i} className={styles.headlineLine}>{line}</span>
                ))}
              </motion.h2>

              {/* Body */}
              {beat.body && (
                <motion.p variants={itemUp} className={styles.body}>
                  {beat.body}
                </motion.p>
              )}

              {/* Highlights */}
              {beat.highlights && beat.highlights.length > 0 && (
                <motion.ul variants={itemUp} className={styles.highlights} role="list">
                  {beat.highlights.map((h, i) => (
                    <li key={i} className={styles.highlightItem}>
                      <span className={styles.dot} aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </motion.ul>
              )}

              {/* Beat progress */}
              <motion.div variants={itemUp}>
                <BeatProgress beat={beat} scrollPct={scrollPct} />
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
