'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = ['Overview', 'Design', 'Dial', 'Movement', 'Specs'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Overview');
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (section: string) => {
    const map: Record<string, string> = {
      'Overview': 'hero',
      'Design':   'design',
      'Dial':     'dial',
      'Movement': 'movement',
      'Specs':    'specs',
    };
    const el = document.getElementById(map[section]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navInner}>
        {/* Left — Brand */}
        <div className={styles.navLeft}>
          <button
            id="nav-brand"
            className={styles.brand}
            onClick={() => scrollTo('Overview')}
            aria-label="Go to top"
          >
            <span className={styles.brandTop}>Tissot</span>
            <span className={styles.brandBottom}>PRX Powermatic 80</span>
          </button>
        </div>

        {/* Center — Navigation links */}
        <div className={styles.navCenter}>
          <ul className={styles.navList} role="list">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  id={`nav-${item.toLowerCase()}`}
                  className={`${styles.navLink} ${activeSection === item ? styles.navLinkActive : ''}`}
                  onClick={() => scrollTo(item)}
                >
                  {item}
                  <AnimatePresence>
                    {activeSection === item && (
                      <motion.span
                        className={styles.navLinkDot}
                        layoutId="navDot"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — CTA */}
        <div className={styles.navRight}>
          <button
            id="nav-cta"
            className={styles.navCta}
            onClick={() => scrollTo('Specs')}
          >
            Discover PRX
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
