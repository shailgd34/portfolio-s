'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ theme, toggleTheme, activeSection }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <a href="/#hero" className={styles.navLogo} aria-label="Sheelash Portfolio Home">
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 100 100" width="20" height="20">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="var(--accent-primary)" />
              </linearGradient>
            </defs>
            <path 
              d="M 75 32 C 75 18, 25 18, 25 42 C 25 65, 75 58, 75 80 C 75 92, 25 92, 25 78" 
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>

      <ul className={styles.navLinks}>
        <li>
          <a href="/#hero" className={`${styles.navLink} ${activeSection === 'hero' ? styles.active : ''}`}>
            Home
          </a>
        </li>
        <li>
          <a href="/#about" className={`${styles.navLink} ${activeSection === 'about' ? styles.active : ''}`}>
            About
          </a>
        </li>
        <li>
          <a href="/#how-i-work" className={`${styles.navLink} ${activeSection === 'how-i-work' ? styles.active : ''}`}>
            Process
          </a>
        </li>
        <li>
          <a href="/#skills" className={`${styles.navLink} ${activeSection === 'skills' ? styles.active : ''}`}>
            Tech
          </a>
        </li>
        <li>
          <a href="/#projects" className={`${styles.navLink} ${activeSection === 'projects' ? styles.active : ''}`}>
            Projects
          </a>
        </li>
      </ul>

      <div className={styles.navActions}>
        <button className={styles.themeToggleBtn} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a href="/#contact" className={`${styles.contactBtn} btn`}>
          Contact
        </a>
      </div>
    </nav>
  );
}
