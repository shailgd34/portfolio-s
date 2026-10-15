'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LINKEDIN_URL, LINKEDIN_APP_INTENT, isMobileDevice } from '@/utils/linkedin';
import styles from './linkedin.module.css';

export default function LinkedInRedirectPage() {
  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    const isMobile = isMobileDevice();
    const ua = navigator.userAgent || '';
    const isAndroid = /android/i.test(ua);

    if (isAndroid) {
      setDevice('android');
      window.location.href = LINKEDIN_APP_INTENT;
    } else if (isMobile) {
      setDevice('ios');
      window.location.href = LINKEDIN_URL;
    } else {
      setDevice('desktop');
      window.location.href = LINKEDIN_URL;
    }
  }, []);

  return (
    <main className={styles.redirectContainer}>
      <div className={styles.card}>
        <div className={styles.avatarHolder}>
          <Image
            src="/retro_close_portrait.jpg"
            alt="Sheelash Singh Bhadoriya"
            width={64}
            height={64}
            className={styles.avatar}
          />
        </div>

        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <span>REDIRECTING TO LINKEDIN...</span>
        </div>

        <h1 className={styles.title}>SHEELASH SINGH BHADORIYA</h1>
        <p className={styles.subtitle}>
          Opening profile in {device === 'android' ? 'LinkedIn App' : device === 'ios' ? 'LinkedIn App' : 'Browser'}...
        </p>

        <div className={styles.actions}>
          <a
            href={device === 'android' ? LINKEDIN_APP_INTENT : LINKEDIN_URL}
            className={styles.primaryBtn}
          >
            OPEN IN LINKEDIN APP
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            OPEN IN WEB BROWSER ↗
          </a>

          <Link href="/" className={styles.backLink}>
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
