'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleHomeClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.indigoFooter}>
      <div className="container">
        
        {/* Giant Antonio Display Header */}
        <div className={styles.giantTitleWrapper}>
          <h2 className={styles.giantTitle}>
            LET'S CREATE SOMETHING EXTRAORDINARY TOGETHER
          </h2>
        </div>

        {/* Content Row */}
        <div className={styles.footerContentGrid}>
          
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandGroup}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/Professional Indian Corporate Headshot.png"
                  alt="Sheelash Singh Bhadoriya"
                  width={44}
                  height={44}
                  className={styles.avatarImg}
                />
              </div>
              <span className={styles.brandName}>SHEELASH BHADORIYA</span>
            </div>
            <p className={styles.brandDesc}>
              Product Designer & UI/UX Specialist crafting human-centered digital interfaces and Next.js applications.
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
            <span className={styles.colTitle}>NAVIGATION</span>
            <ul className={styles.linkList}>
              <li><Link href="/" onClick={handleHomeClick}>Home</Link></li>
              <li><Link href={isHome ? "#what-i-can-do" : "/#what-i-can-do"}>What I Do</Link></li>
              <li><Link href={isHome ? "#about" : "/#about"}>About</Link></li>
              <li><Link href={isHome ? "#projects" : "/#projects"}>Projects</Link></li>
              <li><Link href={isHome ? "#experience" : "/#experience"}>Experience</Link></li>
              <li><Link href={isHome ? "#technology" : "/#technology"}>Technology</Link></li>
              <li><Link href={isHome ? "#contact" : "/#contact"}>Contact</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className={styles.socialCol}>
            <span className={styles.colTitle}>CONNECT</span>
            <ul className={styles.linkList}>
              <li>
                <a href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/" target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href="https://www.behance.net/prithvibhadour" target="_blank" rel="noopener noreferrer">
                  Behance ↗
                </a>
              </li>
              <li>
                <a href="mailto:shailashs79@gmail.com">
                  Email Me (shailashs79@gmail.com) ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} SHEELASH SINGH BHADORIYA. ALL RIGHTS RESERVED.
          </p>
          <button type="button" onClick={handleBackToTop} className={styles.backToTop}>
            Back to top ↑
          </button>
        </div>

      </div>
    </footer>
  );
}
