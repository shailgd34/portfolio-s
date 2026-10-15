'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare, ArrowUpRight } from 'lucide-react';
import styles from './FloatingActions.module.css';

export default function FloatingActions() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Robust multi-source scroll calculation for mobile touch, desktop, and Lenis virtual scroll
      const lenisScroll = typeof window !== 'undefined' && window.__lenis?.scroll;
      const nativeScroll = typeof window !== 'undefined'
        ? (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0)
        : 0;
      const scrollY = typeof lenisScroll === 'number' ? lenisScroll : nativeScroll;

      const totalHeight = typeof document !== 'undefined'
        ? (document.documentElement.scrollHeight - window.innerHeight)
        : 0;

      // Show back-to-top after scrolling down 120px (accessible on all mobile screens)
      setShowTopBtn(scrollY > 120);

      // Calculate scroll progress percentage (0 to 100)
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    // 1. Native scroll, touchmove and resize listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // 2. Lenis smooth scroll listener (vital for mobile touch & momentum scroll)
    let unsubLenis = null;
    if (window.__lenis) {
      unsubLenis = window.__lenis.on('scroll', handleScroll);
    } else {
      const checkInterval = setInterval(() => {
        if (window.__lenis) {
          unsubLenis = window.__lenis.on('scroll', handleScroll);
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 2500);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (typeof unsubLenis === 'function') {
        unsubLenis();
      } else if (window.__lenis?.off) {
        window.__lenis.off('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(contactEl, { offset: -30, duration: 1.3 });
      } else {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = '#contact';
    }
  };

  return (
    <>


      {/* Sticky Contact Button at Left Bottom Side */}
      <a
        href="#contact"
        onClick={scrollToContact}
        className={styles.stickyContactBtn}
        aria-label="Contact Shailash - Available for work"
        title="Get in touch"
      >
        <span className={styles.pulseGreenDot} aria-hidden="true" />

        <span className={styles.contactLabel}>LET'S TALK</span>
      </a>

      {/* Interactive Retro Brutalist Back To Top Stamp (Non-Circular) */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`${styles.backToTopBtn} ${showTopBtn ? styles.visible : styles.hidden}`}
        aria-label="Back to top of page"
        title="Scroll back to top"
      >
        <div className={styles.topBtnHeader}>
          <ArrowUp size={14} className={styles.arrowIcon} strokeWidth={2.8} />
          <span className={styles.topBtnLabel}>TOP</span>
        </div>

        <span className={styles.topBtnPercent}>
          [{Math.round(scrollProgress)}%]
        </span>

        {/* Retro Analog Gauge Track */}
        <div className={styles.gaugeTrack}>
          <div
            className={styles.gaugeFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </button>
    </>
  );
}
