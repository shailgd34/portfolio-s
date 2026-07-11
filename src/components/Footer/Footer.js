'use client';

import { Mail, Phone, Linkedin, Globe } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        
        {/* Top metadata row: Availability, Navigation and Social blocks */}
        <div className={styles.footerMetaRow}>
          {/* Status Block */}
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Status</span>
            <div className={styles.availabilityBadge}>
              <div className={styles.activeDot}></div>
              <span>Available for projects</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
              Have an exciting product idea or fintech startup challenge? Let's build something extraordinary.
            </p>
          </div>

          {/* Contact Info Block */}
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Get in touch</span>
            <a href="mailto:shailashs79@gmail.com" className={styles.metaVal} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Mail size={15} /> shailashs79@gmail.com
            </a>
            <a href="tel:+919516372235" className={styles.metaVal} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} /> +91 9516372235
            </a>
          </div>

          {/* Social Links Block */}
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Social Connection</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.2rem' }}>
              <a 
                href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.metaVal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <a 
                href="https://www.behance.net/prithvibhadour" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.metaVal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Globe size={15} /> Behance
              </a>
              <a 
                href="https://wa.me/919516372235" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.metaVal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.25.003 9.522-4.265 9.525-9.518.002-2.546-.988-4.941-2.79-6.746a9.479 9.479 0 0 0-6.734-2.737C6.015 1.548 1.748 5.812 1.745 11.066c-.001 1.562.433 3.09 1.257 4.437l-.95 3.473 3.548-.93c1.332.726 2.68 1.118 4.048 1.118zM18.22 14c-.3-.15-1.782-.88-2.062-.982-.28-.102-.485-.153-.69.153-.205.305-.795 1.002-.974 1.205-.18.204-.359.229-.66.079a8.307 8.307 0 0 1-2.457-1.517 9.176 9.176 0 0 1-1.7-2.115c-.18-.305-.019-.47.131-.619.135-.135.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.526-.075-.15-.69-1.666-.945-2.278-.249-.611-.523-.529-.718-.539-.185-.01-.397-.012-.61-.012s-.56.08-.853.399c-.293.32-1.119 1.096-1.119 2.673s1.147 3.1 1.302 3.3c.156.2 2.257 3.447 5.467 4.836.763.33 1.359.527 1.823.674.767.243 1.465.209 2.016.127.615-.093 1.782-.728 2.032-1.432.25-.704.25-1.307.175-1.432-.076-.125-.281-.225-.581-.375z" />
                </svg> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Animated Divider */}
        <div className={styles.dividerWrapper}>
          <div className={styles.animatedLine}></div>
        </div>

        {/* Huge display typography */}
        <div className={styles.hugeDisplay}>
          <h2 className={styles.hugeText}>SHAILASH</h2>
        </div>

        {/* Bottom copyright info */}
        <div className={styles.footerBottom}>
          <a href="#hero" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Shailash Portfolio Home">
            <svg viewBox="0 0 100 100" width="20" height="20" style={{ marginRight: '0.5rem' }}>
              <defs>
                <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-secondary)" />
                  <stop offset="100%" stopColor="var(--accent-primary)" />
                </linearGradient>
              </defs>
              <path 
                d="M 75 32 C 75 18, 25 18, 25 42 C 25 65, 75 58, 75 80 C 75 92, 25 92, 25 78" 
                fill="none"
                stroke="url(#footerLogoGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.logoText}>Sheelash</span>
          </a>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Sheelash Singh Bhadoriya. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
