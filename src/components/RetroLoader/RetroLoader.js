'use client';

import { useState, useEffect } from 'react';
import styles from './RetroLoader.module.css';

export default function RetroLoader() {
  const [isActive, setIsActive] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.location.pathname.startsWith('/retro')) {
      setIsActive(false);
      document.documentElement.classList.add('retro-loader-done');
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const forceReplay = searchParams.has('loader') || searchParams.has('intro');
    const hasSeen = sessionStorage.getItem('sheelash_retro_tape_v1');

    if (hasSeen && !forceReplay) {
      setIsActive(false);
      document.documentElement.classList.add('retro-loader-done');
      return;
    }

    // Expose global replay function for testing/demonstration
    window.__replayRetroLoader = () => {
      sessionStorage.removeItem('sheelash_retro_tape_v1');
      document.documentElement.classList.remove('retro-loader-done');
      window.location.reload();
    };

    // Lock scrolling for 2 seconds
    document.body.style.overflow = 'hidden';
    if (window.__lenis) {
      window.__lenis.stop();
    }

    // 2-Second smooth analog winding sequence
    const startTime = Date.now();
    const duration = 1850; // 1.85s winding + 0.35s fade = 2.2s total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setPercent(progress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsExiting(true);

        try {
          sessionStorage.setItem('sheelash_retro_tape_v1', 'true');
          document.documentElement.classList.add('retro-loader-done');
          document.body.style.overflow = '';
          if (window.__lenis) {
            window.__lenis.start();
          }
        } catch (e) {
          // Ignore storage restrictions
        }

        setTimeout(() => {
          setIsActive(false);
        }, 400);
      }
    }, 25);

    // ESC to skip immediately
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        clearInterval(interval);
        setIsExiting(true);
        try {
          sessionStorage.setItem('sheelash_retro_tape_v1', 'true');
          document.documentElement.classList.add('retro-loader-done');
          document.body.style.overflow = '';
          if (window.__lenis) {
            window.__lenis.start();
          }
        } catch (err) {}
        setTimeout(() => setIsActive(false), 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, []);

  if (!isActive) return null;

  // Mechanical 3-digit counter format: e.g. 000 -> 050 (or 100)
  const counterValue = String(Math.round((percent / 100) * 50)).padStart(3, '0');

  return (
    <div
      className={`${styles.vintageLoaderOverlay} ${isExiting ? styles.exiting : ''}`}
      role="progressbar"
      aria-label="Winding vintage portfolio cassette"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={percent}
    >
      {/* Subtle Warm Paper Texture */}
      <div className={styles.paperTexture} aria-hidden="true" />

      {/* ===================================================================
          TOP EDITORIAL DOCKET BAR
          =================================================================== */}
      <header className={styles.loaderTopBar}>
        <div className={styles.topBarBrand}>
          <span className={styles.tapeIconBadge}>C-60</span>
          <span>ANALOG PORTFOLIO CASSETTE // STEREO</span>
        </div>
        <div className={styles.playbackStatus}>
          <span className={styles.playLed} />
          <span>PLAY ▶ 4.75 CM/S</span>
        </div>
      </header>

      {/* ===================================================================
          CENTERSTAGE: 1970s CASSETTE TAPE WITH SPINNING SPOOLS
          =================================================================== */}
      <main className={styles.centerStage}>
        <div className={styles.cassetteBody}>
          {/* Corner Screws */}
          <span className={`${styles.cornerScrew} ${styles.screwTL}`} aria-hidden="true">⊕</span>
          <span className={`${styles.cornerScrew} ${styles.screwTR}`} aria-hidden="true">⊕</span>
          <span className={`${styles.cornerScrew} ${styles.screwBL}`} aria-hidden="true">⊕</span>
          <span className={`${styles.cornerScrew} ${styles.screwBR}`} aria-hidden="true">⊕</span>

          {/* Cassette Retro Label */}
          <div className={styles.cassetteLabel}>
            <div className={styles.labelTopRow}>
              <span className={styles.labelSideA}>SIDE A</span>
              <span>CHROME BIAS 70µs</span>
              <span>INDEX: 2026</span>
            </div>
            <h2 className={styles.labelTitle}>SHEELASH SINGH BHADORIYA</h2>
            <div className={styles.labelSub}>
              PRODUCT DESIGNER &amp; UI/UX SPECIALIST • 50+ WORKS
            </div>
          </div>

          {/* Transparent Tape Window */}
          <div className={styles.tapeWindowFrame}>
            {/* Magnetic Tape Ribbon spanning across */}
            <div className={styles.tapeRibbon} aria-hidden="true" />

            {/* Left Spinning Reel */}
            <div className={styles.spoolAssembly} aria-hidden="true">
              <svg className={styles.tapeReelSvg} viewBox="0 0 60 60" fill="none">
                {/* Spool white hub */}
                <circle cx="30" cy="30" r="28" fill="#F4ECE1" stroke="#181512" strokeWidth="2" />
                <circle cx="30" cy="30" r="16" fill="#181512" />
                <circle cx="30" cy="30" r="9" fill="#F4ECE1" />
                {/* 6 Drive teeth notches */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <rect
                    key={`l-${deg}`}
                    x="28.5"
                    y="13"
                    width="3"
                    height="6"
                    fill="#FF6B35"
                    transform={`rotate(${deg} 30 30)`}
                  />
                ))}
              </svg>
            </div>

            {/* Center Odometer & Tape Ruler */}
            <div className={styles.rulerMarkings} aria-hidden="true">
              <div className={styles.odometerBox}>
                <span>{counterValue}</span>
              </div>
              <div className={styles.rulerTicks}>
                <span className={`${styles.tick} ${styles.tickMajor}`} />
                <span className={styles.tick} />
                <span className={styles.tick} />
                <span className={`${styles.tick} ${styles.tickMajor}`} />
                <span className={styles.tick} />
                <span className={styles.tick} />
                <span className={`${styles.tick} ${styles.tickMajor}`} />
              </div>
            </div>

            {/* Right Spinning Reel */}
            <div className={styles.spoolAssembly} aria-hidden="true">
              <svg className={styles.tapeReelSvg} viewBox="0 0 60 60" fill="none">
                {/* Spool white hub */}
                <circle cx="30" cy="30" r="28" fill="#F4ECE1" stroke="#181512" strokeWidth="2" />
                <circle cx="30" cy="30" r="16" fill="#181512" />
                <circle cx="30" cy="30" r="9" fill="#F4ECE1" />
                {/* 6 Drive teeth notches */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <rect
                    key={`r-${deg}`}
                    x="28.5"
                    y="13"
                    width="3"
                    height="6"
                    fill="#FF6B35"
                    transform={`rotate(${deg} 30 30)`}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom Tape Recess with Guide Holes */}
          <div className={styles.tapeRecess} aria-hidden="true">
            <div className={styles.tapeHoles}>
              <div className={styles.pencilHole} />
              <span>HEAD AZIMUTH</span>
              <div className={styles.pencilHole} />
            </div>
            <span className={styles.formatTag}>HIGH OUTPUT • DOLBY B</span>
          </div>
        </div>

        {/* =================================================================
            TELEMETRY & PROGRESS TRACK
            ================================================================= */}
        <div className={styles.telemetryDocket}>
          <div className={styles.trackHeader}>
            <span>WINDING ARCHIVE REEL</span>
            <span>{percent}%</span>
          </div>
          <div className={styles.tapeMeterTrack}>
            <div
              className={styles.tapeMeterFill}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className={styles.trackSubText}>
            {percent === 100 ? 'AUDIO-VISUAL REEL ENGAGED' : 'CALIBRATING DESIGN ARCHIVE • 2020–2026'}
          </div>
        </div>
      </main>

      {/* ===================================================================
          BOTTOM FOOTER BAR
          =================================================================== */}
      <footer className={styles.loaderBottomBar}>
        <span className={styles.systemBadge}>
          [ MASTER TAPE CASSETTE № 01 // INDORE, INDIA ]
        </span>
        <button
          type="button"
          onClick={() => {
            setIsExiting(true);
            try {
              sessionStorage.setItem('sheelash_retro_tape_v1', 'true');
              document.documentElement.classList.add('retro-loader-done');
              document.body.style.overflow = '';
              if (window.__lenis) window.__lenis.start();
            } catch (e) {}
            setTimeout(() => setIsActive(false), 200);
          }}
          className={styles.skipBtn}
          aria-label="Skip intro"
        >
          <span>FAST FORWARD</span>
          <span>⏩</span>
        </button>
      </footer>
    </div>
  );
}
