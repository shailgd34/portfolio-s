'use client';

import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  const stats = [
    { number: '6+', label: 'Years of Experience' },
    { number: '200+', label: 'Completed Projects' },
    { number: '50+', label: 'Clients Worldwide' },
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        
        {/* Main Grid: Left Column Text/Stats + Right Column Card Target Space */}
        <div className={styles.aboutGrid}>
          
          {/* Left Column: Bio, Title, Stats, Contacts & Socials */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>ABOUT ME</h2>
            
            <p className={styles.bioText}>
              Hi, I'm Shailash — a Senior Product Designer & Frontend Developer with 6+ years of experience designing and building SaaS platforms, enterprise dashboards, fintech products, and high-performance web applications.
            </p>

            {/* 3 Green Stats */}
            <div className={styles.statsGrid}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.statBox}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Contact Details Row */}
            <div className={styles.contactRow}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Call Today :</span>
                <span className={styles.contactValue}>+91 9516372235</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email :</span>
                <a href="mailto:shailashs79@gmail.com" className={styles.contactValue}>
                  shailashs79@gmail.com
                </a>
              </div>
            </div>

            {/* Social Icons & Action Button */}
            <div className={styles.actionRow}>
              <div className={styles.socialIcons}>
                <a
                  href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
                  </svg>
                </a>
                <a
                  href="https://www.behance.net/prithvibhadour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Behance"
                  title="Behance Portfolio"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.111 0-5-2.25-5-5.5s1.944-5.5 4.889-5.5c3.084 0 4.757 2.083 4.757 5.139 0 .417-.056.861-.083 1.111h-7.389c.083 1.361 1.056 2.361 2.5 2.361 1.25 0 1.944-.611 2.222-1.111h2.83zm-4.778-5.361c-1.167 0-1.889.722-2.028 1.861h4.111c-.028-1.028-.75-1.861-2.083-1.861zm-10.948 8.361h-8v-16h7.722c2.722 0 4.778 1.278 4.778 3.75 0 1.556-.833 2.722-2.111 3.361 1.639.583 2.611 1.944 2.611 3.861 0 3.028-2.306 5.028-5 5.028zm-4.5-9.611h3.75c1.083 0 1.944-.556 1.944-1.5 0-.944-.861-1.444-1.944-1.444h-3.75v2.944zm0 6.667h3.944c1.278 0 2.222-.611 2.222-1.722 0-1.139-.944-1.722-2.222-1.722h-3.944v3.444z"/>
                  </svg>
                </a>
                <a
                  href="mailto:shailashs79@gmail.com"
                  className={styles.socialLink}
                  aria-label="Email"
                  title="Send Email"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>

              <a
                href="/shailash 2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.myStoryBtn}
              >
                MY RESUME
              </a>
            </div>

          </div>

          {/* Right Column: Dynamic Destination Landing Box for Hero Card */}
          <div className={styles.rightColTargetArea}>
            <div id="about-card-target" className={styles.cardPlaceholderSpace} />
          </div>

        </div>

      </div>
    </section>
  );
}
