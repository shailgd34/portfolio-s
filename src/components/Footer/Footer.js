'use client';

import { useState } from 'react';
import Link from 'next/link';
import RetroMarquee from '@/components/RetroMarquee/RetroMarquee';
import { LINKEDIN_URL, openLinkedIn } from '@/utils/linkedin';
import styles from './Footer.module.css';

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('shailashs79@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const handleBackToTop = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.indigoFooter}>
      {/* Sleek Top Marquee Ribbon */}
      <div className={styles.footerMarqueeWrap}>
        <RetroMarquee
          text="AVAILABLE FOR NEW VENTURES & FULL-TIME ROLES • SENIOR PRODUCT DESIGN & ARCHITECTURE • INDORE, INDIA (UTC+5:30) • SHAILASHS79@GMAIL.COM"
          variant="dark"
          speed={30}
        />
      </div>

      <div className="container">
        {/* Main Minimal Editorial Hero */}
        <div className={styles.footerMainBlock}>
          
          <div className={styles.kickerTag}>
            <span className={styles.kickerBadge}>[ 08 // EPILOGUE ]</span>
            <span className={styles.kickerLabel}>• GET IN TOUCH</span>
          </div>

          <h2 className={styles.giantTitle}>
            LET&apos;S BUILD SOMETHING<br />
            <span className={styles.titleAccent}>EXTRAORDINARY.</span>
          </h2>

          <p className={styles.minimalSubtext}>
            Have an ambitious startup, SaaS platform, or enterprise dashboard that needs world-class UX/UI design and high-performance engineering? My desk is open.
          </p>

          {/* Primary Action Row: Direct Email + Resume */}
          <div className={styles.actionRow}>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={styles.emailPillBtn}
              title="Click to copy email address"
              aria-label="Copy direct email address"
            >
              <span className={styles.emailPillDot} aria-hidden="true" />
              <span className={styles.emailAddress}>
                {copiedEmail ? '✓ COPIED TO CLIPBOARD!' : 'SHAILASHS79@GMAIL.COM'}
              </span>
              <span className={styles.emailCopyPrompt}>
                [ {copiedEmail ? 'COPIED' : 'CLICK TO COPY'} ]
              </span>
            </button>

            <a
              href="/shailash 2026.pdf"
              download="Shailash_Singh_Resume.pdf"
              className={styles.resumeBtn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume PDF"
            >
              <span>DOWNLOAD CV</span>
              <span className={styles.btnArrow}>↓</span>
            </a>
          </div>

        </div>

        {/* Minimal Social & Navigation Links Strip */}
        <div className={styles.linksRow}>
          
          <div className={styles.statusIndicator}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span className={styles.statusText}>STATUS: OPEN FOR NEW OPPORTUNITIES</span>
          </div>

          <div className={styles.socialNavLinks}>
            <a
              href={LINKEDIN_URL}
              onClick={openLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.minimalLink}
            >
              LINKEDIN ↗
            </a>
            <a
              href="https://www.behance.net/prithvibhadour"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.minimalLink}
            >
              BEHANCE ↗
            </a>
            <a
              href="https://wa.me/919516372235"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.minimalLink}
            >
              WHATSAPP ↗
            </a>
            <Link href="/projects" className={styles.minimalLink}>
              ALL PROJECTS (50+) ↗
            </Link>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className={styles.bottomBar}>
          <span className={styles.copyrightText}>
            © {new Date().getFullYear()} SHEELASH SINGH BHADORIYA • INDORE, INDIA
          </span>

          <button
            type="button"
            onClick={handleBackToTop}
            className={styles.footerBackToTop}
            aria-label="Back to top"
            title="Return to top of page"
          >
            <span>RETURN TO TOP</span>
            <span className={styles.backToTopArrow}>↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
