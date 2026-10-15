'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const heroRef = useRef(null);
  const cardRef = useRef(null);

  // Dynamic Image for Card (Headshot -> Workspace setup on scroll flip)
  const [cardImg, setCardImg] = useState('/profile.png');

  // Screen width state for responsive checks
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Framer Motion scroll hooks
  const { scrollY } = useScroll();

  // Desktop transforms (Hero -> Section 2 What I Can Do -> Section 3 About Me)
  // Calibrated so the animated portrait sits comfortably higher alongside
  // Section 2 ("WHAT I CAN DO FOR YOU") and Section 3 ("ABOUT ME") without sliding too far down
  const desktopY = useTransform(
    scrollY,
    [0, 600, 1100, 1750],
    [0, 620, 800, 1760]
  );
  const desktopX = useTransform(
    scrollY,
    [0, 600, 1100, 1750],
    [0, 350, 350, 350]
  );

  // Mobile fallback transforms (positioned higher as well)
  const mobileY = useTransform(scrollY, [0, 500, 1400], [0, 480, 1180]);

  // 3D rotations & scale
  const rotateY = useTransform(
    scrollY,
    [0, 320, 650, 1150, 1850],
    [0, 90, 180, 270, 360]
  );
  const rotateZ = useTransform(
    scrollY,
    [0, 650, 1150, 1850],
    [0, -2, -2, 2]
  );
  const scale = useTransform(
    scrollY,
    [0, 650, 1150, 1850],
    [1, 0.95, 0.95, 0.98]
  );

  // Mid-flip image swap tracking
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest >= 320 && latest <= 1150) {
      setCardImg('/profile.png');
    } else {
      setCardImg('/profile.png');
    }
  });

  // Desktop-only gentle fade when exiting hero into section 2
  const heroTextOpacity = useTransform(scrollY, [450, 950], [1, 0.1]);

  return (
    <section id="hero" className={styles.heroSection} ref={heroRef}>
      <div className="container">
        {/* Main 3-Column Hero Grid */}
        <div className={styles.heroGrid}>

          {/* Left Column: Kicker Tag + PRODUCT Title */}
          <motion.div
            className={styles.leftCol}
            style={{ opacity: isMobile ? 1 : heroTextOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className={styles.kickerTag}
            >
              <span className={styles.kickerDot} />
              <span>EST. 2020 • SENIOR PRODUCT DESIGNER</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              className={styles.giantTitle}
            >
              PRODUCT
            </motion.h1>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className={styles.leftSubKicker}
            >
              SHEELASH SINGH BHADORIYA
            </motion.span>
          </motion.div>

          {/* Center Column: Identity Card Hanging Style Mockup */}
          <div className={styles.centerCol}>
            <motion.div
              className={styles.portraitEntranceWrapper}
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.idCardHangerAssembly}>
                {/* Woven Lanyard Ribbon Hanging from Top */}
                <div className={styles.lanyardStrap} aria-hidden="true">
                  <div className={styles.lanyardStitching} />
                  <span className={styles.lanyardBrandText}>SSB • 2026 • PASS</span>
                </div>

                {/* Metallic Hardware: Swivel Ring & Clasp Clip */}
                <div className={styles.lanyardHardware} aria-hidden="true">
                  <div className={styles.lanyardRing} />
                  <div className={styles.lanyardClasp} />
                  <div className={styles.lanyardClipHook} />
                </div>

                <div className={styles.portraitCardContainer}>
                  <motion.div
                    ref={cardRef}
                    className={`${styles.portraitCard} ${styles.idCardMockup}`}
                    style={{
                      x: isMobile ? 0 : desktopX,
                      y: isMobile ? 0 : desktopY,
                      rotateY: rotateY,
                      rotateZ: isMobile ? 0 : rotateZ,
                      scale: scale,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Top Lanyard Punch Slot */}
                    <div className={styles.idPunchSlot}>
                      <span className={styles.idSlotHole} />
                    </div>

                    {/* ID Pass Header Bar */}
                    <div className={styles.idCardHeaderBar}>
                      <div className={styles.idChipGroup}>
                        <div className={styles.idGoldenChip} />
                        <span className={styles.idPassCode}>PASS // 04-SSB</span>
                      </div>
                      <div className={styles.idStatusDotGroup}>
                        <span className={styles.idStatusDot} />
                        <span className={styles.idStatusLabel}>LEVEL-5</span>
                      </div>
                    </div>

                    {/* Portrait Photo Frame with Registration Corners */}
                    <div className={styles.idPhotoContainer}>
                      <Image
                        src={cardImg}
                        alt="Sheelash Singh Bhadoriya"
                        width={380}
                        height={500}
                        priority
                        className={styles.portraitImg}
                      />
                      <span className={`${styles.photoBracket} ${styles.bracketTL}`} />
                      <span className={`${styles.photoBracket} ${styles.bracketTR}`} />
                      <span className={`${styles.photoBracket} ${styles.bracketBL}`} />
                      <span className={`${styles.photoBracket} ${styles.bracketBR}`} />
                      <div className={styles.photoFilmOverlay} />
                    </div>

                    {/* ID Card Bottom Metadata & Barcode Docket */}
                    <div className={styles.idCardFooterDocket}>
                      <div className={styles.idNameTitleGroup}>
                        <h3 className={styles.idHolderName}>SHEELASH S. BHADORIYA</h3>
                        <span className={styles.idHolderRole}>SR. PRODUCT DESIGNER & UI ARCHITECT</span>
                      </div>

                      {/* Barcode & Security Watermark */}
                      <div className={styles.idBarcodeRow}>
                        <div className={styles.idBarcodeBars} aria-hidden="true">
                          <span style={{ width: 2 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 3 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 4 }} />
                          <span style={{ width: 2 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 3 }} />
                          <span style={{ width: 2 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 4 }} />
                          <span style={{ width: 2 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 3 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 2 }} />
                          <span style={{ width: 4 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 2 }} />
                          <span style={{ width: 3 }} />
                          <span style={{ width: 1 }} />
                          <span style={{ width: 4 }} />
                          <span style={{ width: 2 }} />
                        </div>
                        <span className={styles.idSerialText}>*SSB-99201-PASS*</span>
                      </div>
                    </div>


                    {/* Clear Acrylic Laminate Sheen Layer */}
                    <div className={styles.idAcrylicSheen} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: DESIGNER Title + Subtext + Uncle Joe Brutalist Buttons */}
          <motion.div
            className={styles.rightCol}
            style={{ opacity: isMobile ? 1 : heroTextOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, x: 60, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              className={styles.giantTitle}
            >
              DESIGNER
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={styles.heroBioText}
            >
              Crafting intuitive SaaS platforms, enterprise design systems & high-performance web applications with precision.
            </motion.p>

            {/* Uncle Joe Solid Brutalist Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={styles.heroActionGroup}
            >
              <Link
                href="/projects"
                className={styles.primaryRetroBtn}
                data-magnetic="true"
                onClick={(e) => {
                  if (typeof window !== 'undefined') {
                    const el = document.getElementById('projects');
                    if (el && window.__lenis) {
                      e.preventDefault();
                      window.__lenis.scrollTo(el, { offset: -30, duration: 1.3 });
                      if (window.history.pushState) window.history.pushState(null, '', '#projects');
                    }
                  }
                }}
              >
                <span>VIEW WORK (50+)</span>
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href="#contact"
                className={styles.secondaryRetroBtn}
                data-magnetic="true"
                onClick={(e) => {
                  if (typeof window !== 'undefined') {
                    const el = document.getElementById('contact');
                    if (el && window.__lenis) {
                      e.preventDefault();
                      window.__lenis.scrollTo(el, { offset: -30, duration: 1.3 });
                      if (window.history.pushState) window.history.pushState(null, '', '#contact');
                    }
                  }
                }}
              >
                <span>GET IN TOUCH</span>
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
