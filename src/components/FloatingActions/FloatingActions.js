'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare, ArrowUpRight } from 'lucide-react';
import styles from './FloatingActions.module.css';

export default function FloatingActions() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show back-to-top after scrolling down 320px
      setShowTopBtn(scrollY > 320);

      // Calculate scroll progress percentage (0 to 100)
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  // Circular progress SVG values
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Sticky LinkedIn Tab at Right Center Side */}
      <a
        href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.stickyLinkedinBtn}
        aria-label="Connect with Shailash on LinkedIn"
        title="Connect on LinkedIn"
      >
        <span className={styles.linkedinIconWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.linkedinSvg} aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
          </svg>
        </span>
        <span className={styles.linkedinLabelWrapper}>
          <span className={styles.linkedinText}>LinkedIn</span>
          <ArrowUpRight size={13} className={styles.linkedinArrow} />
        </span>
      </a>

      {/* Sticky Contact Button at Left Bottom Side */}
      <a
        href="#contact"
        onClick={scrollToContact}
        className={styles.stickyContactBtn}
        aria-label="Contact Shailash - Available for work"
        title="Get in touch"
      >
        <span className={styles.pulseGreenDot} aria-hidden="true" />
        <span className={styles.contactIcon}>
          <MessageSquare size={15} />
        </span>
        <span className={styles.contactLabel}>LET'S TALK</span>
      </a>

      {/* Animated Back To Top Button at Right Bottom Side */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`${styles.backToTopBtn} ${showTopBtn ? styles.visible : styles.hidden}`}
        aria-label="Back to top of page"
        title="Back to top"
      >
        {/* Circular Scroll Progress Ring */}
        <svg className={styles.progressRing} width="48" height="48" viewBox="0 0 48 48">
          <circle
            className={styles.progressRingBg}
            cx="24"
            cy="24"
            r={radius}
          />
          <circle
            className={styles.progressRingFill}
            cx="24"
            cy="24"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Animated Arrow Icon */}
        <ArrowUp size={18} className={styles.arrowIcon} />
      </button>
    </>
  );
}
