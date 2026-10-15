'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RetroMarquee from '@/components/RetroMarquee/RetroMarquee';
import { LINKEDIN_URL, openLinkedIn } from '@/utils/linkedin';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Dynamic Scroll Opacity Scrub for Big Text (Line 1 & Line 2)
  const [line1Style, setLine1Style] = useState({ opacity: 0.15, transform: 'translateY(32px)' });
  const [line2Style, setLine2Style] = useState({ opacity: 0.15, transform: 'translateY(32px)' });
  const titleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current) return;
      const rect = titleRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when rect.top enters bottom of window
      // Reach 100% opacity when rect.top reaches ~50% of the screen height
      const start = windowHeight;
      const end = windowHeight * 0.48;

      let progress = 0;
      if (start > end) {
        progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      }

      // Line 1: reveals between progress 0.0 and 0.75
      const p1 = Math.min(1, Math.max(0, progress / 0.75));
      const opacity1 = (0.12 + p1 * 0.88).toFixed(3);
      const y1 = ((1 - p1) * 32).toFixed(1);

      // Line 2: reveals with stagger between progress 0.25 and 1.0
      const p2 = Math.min(1, Math.max(0, (progress - 0.25) / 0.75));
      const opacity2 = (0.12 + p2 * 0.88).toFixed(3);
      const y2 = ((1 - p2) * 32).toFixed(1);

      setLine1Style({
        opacity: opacity1,
        transform: `translateY(${y1}px)`,
      });

      setLine2Style({
        opacity: opacity2,
        transform: `translateY(${y2}px)`,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  return (
    <footer className={styles.indigoFooter}>
      {/* Uncle Joe Signature Top Ticker Marquee */}
      <div className={styles.footerMarqueeWrap}>
        <RetroMarquee
          text="AVAILABLE FOR PROJECTS • PRODUCT DESIGN • FRONTEND ARCHITECTURE • INDORE, INDIA • AVAILABLE WORLDWIDE • DROP A LINE: SHAILASHS79@GMAIL.COM"
          variant="dark"
          speed={32}
        />
      </div>

      <div className="container">

        {/* Giant Antonio Display Header with Interactive Scroll Opacity Animation */}
        <div className={styles.giantTitleWrapper} ref={titleRef}>
          <div className={styles.kickerTag}>
            <span>[ 08 / EPILOGUE ]</span>
            <span>• WORK INQUIRIES & COLLABORATION</span>
          </div>
          <h2 className={styles.giantTitle}>
            <span
              className={styles.titleLine}
              style={{
                opacity: line1Style.opacity,
                transform: line1Style.transform,
              }}
            >
              LET'S CREATE SOMETHING
            </span>
            <span
              className={styles.titleLine}
              style={{
                opacity: line2Style.opacity,
                transform: line2Style.transform,
              }}
            >
              EXTRAORDINARY TOGETHER
            </span>
          </h2>
        </div>

        {/* Content Row */}
        <div className={styles.footerContentGrid}>

          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandGroup}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/retro_close_portrait.jpg"
                  alt="Sheelash Singh Bhadoriya"
                  width={44}
                  height={44}
                  className={styles.avatarImg}
                />
              </div>
              <span className={styles.brandName}>SHEELASH BHADORIYA</span>
            </div>
            <p className={styles.brandDesc}>
              Product Designer & UI/UX Specialist crafting human-centered digital interfaces, enterprise SaaS dashboards, and Next.js platforms.
            </p>
            <div className={styles.resumeActionWrapper}>
              <a
                href="/shailash 2026.pdf"
                download="Shailash_Singh_Resume.pdf"
                className={styles.downloadResumeBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>DOWNLOAD RESUME</span>
                <span className={styles.downloadIcon}>↓</span>
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className={styles.navCol}>
            <span className={styles.colTitle}>[ NAVIGATION ]</span>
            <ul className={styles.linkList}>
              <li><Link href="/" onClick={handleHomeClick}>01 HOME</Link></li>
              <li><Link href={isHome ? "#what-i-can-do" : "/#what-i-can-do"}>02 WHAT I DO</Link></li>
              <li><Link href={isHome ? "#about" : "/#about"}>03 PROFILE</Link></li>
              <li><Link href={isHome ? "#projects" : "/#projects"}>04 WORK (50+)</Link></li>
              <li><Link href={isHome ? "#technology" : "/#technology"}>05 ARSENAL</Link></li>
              <li><Link href={isHome ? "#experience" : "/#experience"}>06 MILESTONES</Link></li>
              <li><Link href={isHome ? "#contact" : "/#contact"}>07 CONTACT</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className={styles.socialCol}>
            <span className={styles.colTitle}>[ CONNECT ]</span>
            <ul className={styles.linkList}>
              <li>
                <a
                  href={LINKEDIN_URL}
                  onClick={openLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                >
                  LINKEDIN ↗
                </a>
              </li>
              <li>
                <a href="https://www.behance.net/prithvibhadour" target="_blank" rel="noopener noreferrer">
                  BEHANCE ↗
                </a>
              </li>
              <li>
                <a href="https://wa.me/919516372235" target="_blank" rel="noopener noreferrer">
                  WHATSAPP (+91 95163 72235) ↗
                </a>
              </li>
              <li>
                <a href="mailto:shailashs79@gmail.com">
                  DIRECT EMAIL ↗
                </a>
              </li>
              <li>
                <span className={styles.statusCallout}>
                  <span className={styles.statusDot} />
                  STATUS: OPEN FOR NEW OPPORTUNITIES
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Mobile & Desktop Back to Top */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} SHEELASH SINGH BHADORIYA • EST. 2020 • INDORE, INDIA (UTC+5:30)
          </p>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.__lenis) {
                window.__lenis.scrollTo(0, { duration: 1.2 });
              } else if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={styles.footerBackToTop}
            aria-label="Back to top of page"
            title="Scroll back to top"
          >
            <span>BACK TO TOP</span>
            <span className={styles.footerBackToTopArrow}>↑</span>
          </button>

          <span className={styles.systemTag}>
            [ PROPRIETARY PORTFOLIO // ALL RIGHTS RESERVED ]
          </span>
        </div>

      </div>
    </footer>
  );
}
