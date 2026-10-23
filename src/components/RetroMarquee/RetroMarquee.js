'use client';

import styles from './RetroMarquee.module.css';

export default function RetroMarquee({
  items = [
    'PRODUCT DESIGNER',
    'UI/UX ARCHITECTURE',
    'NEXT.JS 15 ENGINEER',
    'FINTECH & SAAS SPECIALIST',
    'DESIGN SYSTEMS',
    'MOBILE APPS',
    '6 YEARS EXPERIENCE',
    'WORLDWIDE CLIENTS'
  ],
  variant = 'orange', // 'orange' | 'dark' | 'parchment'
  className = ''
}) {
  const variantClass =
    variant === 'dark'
      ? styles.variantDark
      : variant === 'parchment'
      ? styles.variantParchment
      : styles.variantOrange;

  return (
    <div className={`${styles.marqueeWrapper} ${variantClass} ${className}`}>
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeGroup}>
          {items.map((item, idx) => (
            <span key={`group-1-${idx}`} className={styles.marqueeItem}>
              <span>{item}</span>
              <span className={styles.starIcon}>★</span>
            </span>
          ))}
        </div>
        <div className={styles.marqueeGroup}>
          {items.map((item, idx) => (
            <span key={`group-2-${idx}`} className={styles.marqueeItem}>
              <span>{item}</span>
              <span className={styles.starIcon}>★</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
