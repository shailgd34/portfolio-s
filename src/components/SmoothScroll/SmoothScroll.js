'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for luxurious, momentum-based smooth scrolling
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    window.__ltLenis = lenis;

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    // Scroll to hash target on initial load or route transition
    const handleHashScroll = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash;
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          setTimeout(() => {
            lenis.scrollTo(targetEl, { offset: -30, duration: 1.3 });
          }, 150);
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    // Universal smooth scroll interceptor for in-page anchors
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle anchor links like '#about', '#projects', '#experience', etc.
      // or '/#about' when currently on the homepage
      const isHomepage = window.location.pathname === '/' || window.location.pathname === '';
      const isAnchor = href.startsWith('#') || (href.startsWith('/#') && isHomepage);

      if (isAnchor) {
        const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
        if (hash && hash !== '#') {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -30, duration: 1.3 });
            if (window.history.pushState) {
              window.history.pushState(null, '', hash);
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(animId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
