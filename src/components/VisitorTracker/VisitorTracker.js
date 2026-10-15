'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if we already notified for this browser session on this visit
    const sessionKey = `visited_tracked_${new Date().toISOString().slice(0, 10)}`;
    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (alreadyTracked) return;

    const trackVisit = async () => {
      try {
        let city = 'Unknown City';
        let country = 'Unknown Country';
        let ip = '';

        // Free, privacy-preserving IP/Geo lookup
        try {
          const geoRes = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.city || city;
            country = geoData.country_name || country;
            ip = geoData.ip || '';
          }
        } catch (e) {
          // Fallback if adblocker blocks ipapi
        }

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const deviceType = isMobile ? 'Mobile 📱' : 'Desktop 💻';

        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname || window.location.pathname,
            city,
            country,
            ip,
            referrer: document.referrer || 'Direct Visit',
            device: deviceType,
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            }),
          }),
        });

        // Mark session as tracked
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        // Silently catch network errors
      }
    };

    // Small delay so it doesn't impact initial page load metrics
    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
