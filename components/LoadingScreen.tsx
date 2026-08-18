'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LoadingScreen.module.css';

interface Props {
  progress: number; // 0–1
}

export default function LoadingScreen({ progress }: Props) {
  const [visible, setVisible] = useState(true);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    // Show "ready" state when we have enough frames to start
    if (progress >= 0.08 && !ready) setReady(true);
    // Hide loader once sufficiently loaded
    if (progress >= 0.12) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [progress, ready]);

  const displayPct = Math.round(Math.min(progress * 100, 100));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
          aria-label="Loading Tissot PRX experience"
        >
          {/* Top rule */}
          <div className={styles.topRule} aria-hidden="true" />

          <div className={styles.content}>
            {/* Brand mark */}
            <motion.div
              className={styles.brand}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.brandLabel}>Tissot</div>
              <div className={styles.brandModel}>PRX Powermatic 80</div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className={styles.progressWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={styles.progressTrack} role="progressbar" aria-valuenow={displayPct} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className={styles.progressFill}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.2, ease: 'linear' }}
                  style={{ transformOrigin: 'left center' }}
                />
              </div>
              <div className={styles.progressPct}>{displayPct}</div>
            </motion.div>

            {/* Loading label */}
            <motion.div
              className={styles.loadingLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              Loading experience
            </motion.div>
          </div>

          {/* Bottom origin text */}
          <motion.div
            className={styles.origin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Le Locle, Switzerland — Since 1853
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
