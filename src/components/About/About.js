'use client';

import Image from 'next/image';
import { LINKEDIN_URL, openLinkedIn } from '@/utils/linkedin';
import styles from './About.module.css';

export default function About() {
  const stats = [
    { number: '6', label: 'Years of Experience' },
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
            <div className={styles.categorySubheading}>
              <span className={styles.subheadingDash}>[ 03 / PROFILE ]</span>
              <span>• BEHIND THE SCREENS</span>
            </div>
            <h2 className={styles.sectionTitle}>ABOUT ME</h2>

            <p className={styles.bioText} style={{ marginBottom: '1.25rem' }}>
              I am a Senior Product Designer with 6 years of experience turning complex challenges into intuitive, high-impact digital products. My core focus is on B2B SaaS platforms, enterprise workflows, and fintech ecosystems where usability directly drives adoption and business outcomes.
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
                  href={LINKEDIN_URL}
                  onClick={openLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialLink} ${styles.socialLinkedin}`}
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/shailgd34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialLink} ${styles.socialGithub || ''}`}
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="mailto:shailashs79@gmail.com"
                  className={`${styles.socialLink} ${styles.socialEmail}`}
                  aria-label="Email"
                  title="Send Email"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </div>

              <a
                href="/Sheelash Singh Bhadoriya - Resume.pdf"
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
