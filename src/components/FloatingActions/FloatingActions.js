'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
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
