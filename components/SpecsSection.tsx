'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import styles from './SpecsSection.module.css';

const EASE_LUXE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const specs = [
  { label: 'Reference',        value: 'T137.407.11.051.00' },
  { label: 'Movement',         value: 'Powermatic 80 (ETA C07.111)' },
  { label: 'Power Reserve',    value: '80 hours' },
  { label: 'Case Material',    value: 'Stainless Steel 316L' },
  { label: 'Case Diameter',    value: '40 mm' },
  { label: 'Case Thickness',   value: '11.19 mm' },
  { label: 'Lug Width',        value: '12 mm (integrated)' },
  { label: 'Crystal',          value: 'Sapphire, double AR coating' },
  { label: 'Water Resistance', value: '100 m / 10 ATM' },
  { label: 'Dial',             value: 'Blue waffle-pattern' },
  { label: 'Indices',          value: 'Applied, polished steel' },
  { label: 'Bracelet',         value: 'Integrated stainless steel' },
  { label: 'Clasp',            value: 'Folding safety clasp' },
  { label: 'Frequency',        value: '21,600 A/h (3 Hz)' },
  { label: 'Jewels',           value: '25' },
  { label: 'Functions',        value: 'Hours · Minutes · Seconds · Date' },
];

const keyFacts = [
  { value: '40',  unit: 'mm',  label: 'Case diameter' },
  { value: '80',  unit: 'hrs', label: 'Power reserve' },
  { value: '25',  unit: '',    label: 'Jewels'         },
  { value: '100', unit: 'm',   label: 'Water resistance' },
];

const containerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const rowVariants: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_LUXE } },
};

export default function SpecsSection() {
  const headerRef  = useRef<HTMLDivElement>(null);
  const factsRef   = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDListElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const headerView = useInView(headerRef, { once: true, margin: '-12%' });
  const factsView  = useInView(factsRef,  { once: true, margin: '-12%' });
  const gridView   = useInView(gridRef,   { once: true, margin: '-10%' });
  const ctaView    = useInView(ctaRef,    { once: true, margin: '-8%'  });

  return (
    <section id="specs" className={styles.section} aria-label="Technical specifications">
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Final headline ── */}
        <div ref={headerRef} className={styles.header}>
          <motion.div
            className={styles.overline}
            initial={{ opacity: 0, x: -16 }}
            animate={headerView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_LUXE }}
          >
            <span className={styles.overlineLine} aria-hidden="true" />
            Tissot PRX Powermatic 80
          </motion.div>
          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 28 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXE }}
          >
            Built to become<br />
            <span className={styles.headlineDim}>timeless.</span>
          </motion.h2>
          <motion.p
            className={styles.subheadline}
            initial={{ opacity: 0, y: 16 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.22, ease: EASE_LUXE }}
          >
            Swiss craftsmanship, engineered for modern life.
          </motion.p>
        </div>

        {/* ── Key facts bar ── */}
        <div ref={factsRef} className={styles.factsBar}>
          {keyFacts.map((f, i) => (
            <motion.div
              key={f.label}
              className={styles.fact}
              initial={{ opacity: 0, y: 20 }}
              animate={factsView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE_LUXE }}
            >
              <div className={styles.factValue}>
                {f.value}
                {f.unit && <span className={styles.factUnit}>{f.unit}</span>}
              </div>
              <div className={styles.factLabel}>{f.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Full spec grid ── */}
        <motion.dl
          ref={gridRef}
          className={styles.specGrid}
          variants={containerVariants}
          initial="hidden"
          animate={gridView ? 'visible' : 'hidden'}
        >
          {specs.map(({ label, value }) => (
            <motion.div key={label} className={styles.specRow} variants={rowVariants}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* ── CTAs ── */}
        <div ref={ctaRef} className={styles.ctas}>
          <motion.a
            id="cta-discover-prx"
            href="https://www.tissot.ch/en_EN/watches/PRX/T137.407.11.051.00.html"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
            initial={{ opacity: 0, y: 18 }}
            animate={ctaView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE_LUXE }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
          >
            Discover PRX
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </motion.a>
          <motion.a
            id="cta-tissot-site"
            href="https://www.tissot.ch"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
            initial={{ opacity: 0, y: 18 }}
            animate={ctaView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE_LUXE }}
          >
            Tissot.ch
          </motion.a>
        </div>

        {/* ── Footer ── */}
        <motion.footer
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={ctaView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <div className={styles.footerBrand}>Tissot SA — Le Locle, Switzerland, since 1853</div>
          <p className={styles.footerText}>
            Specifications subject to change without notice. All product images are copyright Tissot SA / Swatch Group.
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
