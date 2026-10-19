'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check permanent localStorage token - only NEW visitors get notified
    const permanentTokenKey = 'sheelash_portfolio_visitor_token';
    const hasVisitedBefore = localStorage.getItem(permanentTokenKey);

    // If visitor has already visited before, do NOT notify
    // (Allows manual testing via ?test_notify=true or ?reset_visitor=true)
    const searchParams = new URLSearchParams(window.location.search);
    const forceTestNotify = searchParams.get('test_notify') === 'true';
    const shouldReset = searchParams.get('reset_visitor') === 'true';

    if (shouldReset) {
      localStorage.removeItem(permanentTokenKey);
      sessionStorage.clear();
      console.log('Visitor token reset.');
    }

    if (hasVisitedBefore && !forceTestNotify) {
      // Returning visitor or site owner - skip notification
      return;
    }

    // Also check session storage so even during the first visit we don't notify multiple times per page navigation
    const sessionKey = 'sheelash_visitor_session_tracked';
    if (sessionStorage.getItem(sessionKey) && !forceTestNotify) {
      return;
    }

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

        const res = await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname || window.location.pathname,
            city,
            country,
            ip,
            referrer: document.referrer || 'Direct Visit',
            device: deviceType,
            isNewVisitor: true,
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            }),
          }),
        });

        // Permanently record that this visitor has been notified so future visits NEVER re-notify
        localStorage.setItem(permanentTokenKey, `first_visit_${Date.now()}`);
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        // Silently catch network errors
      }
    };

    // Delay 2.5s so initial render is completely uninterrupted
    const timer = setTimeout(trackVisit, 2500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
