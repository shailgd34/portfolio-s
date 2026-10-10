'use client';

import styles from './ThemeToggle.module.css';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div className={styles.fixedToggleWrapper}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggleSwitch} ${isDark ? styles.switchDark : styles.switchLight}`}
        aria-label="Toggle Light and Dark Mode"
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <span className={styles.toggleDot}></span>
      </button>
    </div>
  );
}
