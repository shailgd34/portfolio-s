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
              href="/Sheelash Singh Bhadoriya - Resume.pdf"
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
              title="Sheelash on LinkedIn"
              aria-label="Sheelash on LinkedIn"
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </span>
              <span>LINKEDIN ↗</span>
            </a>
            <a
              href="https://github.com/shailgd34"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.minimalLink}
              title="Sheelash on GitHub"
              aria-label="Sheelash on GitHub"
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </span>
              <span>GITHUB ↗</span>
            </a>
            <a
              href="https://wa.me/919516372235"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.minimalLink}
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 2c-5.502 0-9.972 4.47-9.972 9.974 0 1.757.457 3.473 1.328 4.984l-1.411 5.161 5.29-1.388c1.46.797 3.109 1.217 4.765 1.217 5.503 0 9.973-4.47 9.973-9.974 0-5.504-4.47-9.974-9.973-9.974zm0 18.254c-1.488 0-2.946-.4-4.218-1.156l-.302-.179-3.136.822.838-3.056-.197-.313c-.829-1.319-1.267-2.846-1.267-4.402 0-4.551 3.702-8.254 8.282-8.254 4.57 0 8.272 3.703 8.272 8.254 0 4.552-3.702 8.284-8.272 8.284zm4.536-6.196c-.249-.125-1.472-.727-1.7-.81-.229-.083-.395-.125-.561.125-.166.249-.644.81-.789.977-.145.166-.291.187-.54.062s-1.05-.387-2.001-1.234c-.74-.66-1.239-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.291.374-.437.125-.145.166-.249.249-.415.083-.166.042-.312-.021-.437s-.561-1.35-.769-1.849c-.202-.487-.407-.421-.561-.429l-.478-.008c-.166 0-.436.062-.664.312s-.872.852-.872 2.078 1.892 2.411 2.162 2.764c.27.353 3.693 5.64 8.948 7.91 1.25.54 2.226.863 2.986 1.104 1.256.399 2.398.343 3.301.208 1.008-.15 3.093-1.264 3.53-2.485.437-1.222.437-2.271.312-2.486-.125-.214-.457-.339-.706-.464z" />
                </svg>
              </span>
              <span>WHATSAPP ↗</span>
            </a>
            <Link href="/projects" className={styles.minimalLink}>
              <span>ALL PROJECTS (50+) ↗</span>
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
