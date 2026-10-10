'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const heroRef = useRef(null);
  const cardRef = useRef(null);

  // Auto cycle badge icon between 'hi' and 'handshake'
  const [badgeState, setBadgeState] = useState('hi');
  const [showBadge, setShowBadge] = useState(true);

  // Dynamic Image for Card (Headshot -> Workspace setup on scroll flip)
  const [cardImg, setCardImg] = useState('/Professional Indian Corporate Headshot.png');

  // Screen width state for responsive checks
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBadgeState((prev) => (prev === 'hi' ? 'handshake' : 'hi'));
    }, 2800);

    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Framer Motion scroll hooks
  const { scrollY } = useScroll();

  // Desktop transforms (Hero -> Section 2 What I Can Do -> Section 3 About Me)
  const desktopY = useTransform(scrollY, [0, 650, 1500], [0, 560, 1460]);
  const desktopX = useTransform(scrollY, [0, 650, 1500], [0, 345, 345]);

  // Mobile fallback transforms
  const mobileY = useTransform(scrollY, [0, 500, 1200], [0, 480, 1100]);

  // 3D rotations & scale
  const rotateY = useTransform(
    scrollY,
    [0, 320, 650, 1050, 1500],
    [0, 90, 180, 270, 360]
  );
  const rotateZ = useTransform(scrollY, [0, 650, 1500], [0, -2, 2]);
  const scale = useTransform(scrollY, [0, 650, 1500], [1, 0.95, 0.98]);

  // Mid-flip image swap and badge visibility tracking
  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Flip to workspace mockup in Section 2, flip back to hero headshot in Section 3
    if (latest >= 320 && latest <= 1050) {
      setCardImg('/workspace_mockup.jpg');
    } else {
      setCardImg('/Professional Indian Corporate Headshot.png');
    }

    // Hide badge icon when leaving hero section
    if (latest > 100) {
      setShowBadge(false);
    } else {
      setShowBadge(true);
    }
  });

  // Scroll-driven text dimming (100% at top, smoothly dims to 20% on scroll)
  const heroTextOpacity = useTransform(scrollY, [0, 350], [1, 0.2]);

  return (
    <section id="hero" className={styles.heroSection} ref={heroRef}>
      
      {/* Small Floating Ambient Dot at Top-Left */}
      <div className={`${styles.floatingDot} ${isDark ? styles.limeDot : styles.purpleDot}`}></div>

      <div className="container">
        
        {/* Main 3-Column Hero Grid */}
        <div className={styles.heroGrid}>
          
          {/* Left Column: Name Sub-heading + PRODUCT Title */}
          <motion.div
            className={styles.leftCol}
            style={{ opacity: heroTextOpacity }}
          >
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className={styles.nameSubheading}
            >
              SHAILASH SINGH BHADORIYA
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              className={styles.giantTitle}
            >
              PRODUCT
            </motion.h1>
          </motion.div>

          {/* Center Column: Portrait Card + Dynamic Badge */}
          <div className={styles.centerCol}>
            <motion.div
              className={styles.portraitEntranceWrapper}
              initial={{ opacity: 0, scale: 0.75, rotate: -360 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.portraitCardContainer}>
                <motion.div
                  ref={cardRef}
                  className={styles.portraitCard}
                  style={{
                    x: isMobile ? 0 : desktopX,
                    y: isMobile ? mobileY : desktopY,
                    rotateY: rotateY,
                    rotateZ: isMobile ? 0 : rotateZ,
                    scale: scale,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Image
                    src={cardImg}
                    alt="Sheelash Singh Bhadoriya"
                    width={380}
                    height={500}
                    priority
                    className={styles.portraitImg}
                  />
                  
                  {/* Dynamic Auto-Animating Badge: Cycles between Hi and Vector Shaking Hand Icon */}
                  <div className={`${styles.badgeCircle} ${isDark ? styles.badgeLime : styles.badgePurple} ${!showBadge ? styles.badgeHidden : ''}`}>
                    <div className={`${styles.badgeContent} ${badgeState === 'hi' ? styles.activeState : styles.inactiveState}`}>
                      <span className={styles.hiText}>Hi</span>
                    </div>
                    <div className={`${styles.badgeContent} ${badgeState === 'handshake' ? styles.activeState : styles.inactiveState}`}>
                      <svg
                        width="42"
                        height="42"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={styles.shakingHandIcon}
                        aria-label="Waving hand"
                      >
                        <path d="M12.5 2C11.67 2 11 2.67 11 3.5V9.5H10V2.5C10 1.67 9.33 1 8.5 1C7.67 1 7 1.67 7 2.5V9.5H6V4.5C6 3.67 5.33 3 4.5 3C3.67 3 3 3.67 3 4.5V13C3 17.42 6.58 21 11 21C15.42 21 19 17.42 19 13V7.5C19 6.67 18.33 6 17.5 6C16.67 6 16 6.67 16 7.5V9.5H15V3.5C15 2.67 14.33 2 13.5 2H12.5Z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: DESIGNER Title + Subtext */}
          <motion.div
            className={styles.rightCol}
            style={{ opacity: heroTextOpacity }}
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
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={styles.heroBioText}
            >
              I'm a Product Designer & Frontend Developer crafting intuitive digital experiences.
            </motion.p>
          </motion.div>

        </div>

       

      </div>
    </section>
  );
}
