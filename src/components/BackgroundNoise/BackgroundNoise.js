'use client';

import styles from './BackgroundNoise.module.css';

export default function BackgroundNoise() {
  return (
    <div
      className={styles.noiseOverlay}
      aria-hidden="true"
    />
  );
}
