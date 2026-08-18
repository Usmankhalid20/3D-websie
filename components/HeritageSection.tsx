'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './HeritageSection.module.css';

const milestones = [
  { year: '1853', label: 'Founded in Le Locle, Switzerland' },
  { year: '1971', label: 'PRX design first introduced' },
  { year: '2021', label: 'PRX reborn for the modern era' },
  { year: 'Now',  label: 'PRX Powermatic 80 — 80 hours of precision' },
];

export default function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className={styles.section}
      aria-label="Brand heritage"
    >
      <div className={styles.inner}>
        {/* Left — copy */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.overline}>
            <span className={styles.overlineLine} aria-hidden="true" />
            Heritage
          </div>
          <h2 className={styles.headline}>
            A design that evolved<br />
            <span className={styles.headlineDim}>without losing its identity.</span>
          </h2>
          <p className={styles.body}>
            Born in 1971, the Tissot PRX redefined what an integrated sports watch could look like. 
            Fifty years later, the PRX Powermatic 80 carries that original vision forward — 
            refined in every detail, unchanged in character.
          </p>
          <p className={styles.bodySmall}>
            The same case architecture. The same bracelet integration. The same commitment to 
            accessible Swiss precision — now powered by 80 hours of mechanical autonomy.
          </p>
        </motion.div>

        {/* Right — timeline */}
        <div className={styles.right}>
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              className={styles.milestone}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.milestoneYear}>{m.year}</div>
              <div className={styles.milestoneLine} aria-hidden="true" />
              <div className={styles.milestoneLabel}>{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} aria-hidden="true" />
    </section>
  );
}
