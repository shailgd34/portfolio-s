'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    // Support anchor links with smooth scroll
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const id = target.getAttribute('href');
        if (id && id !== '#') {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -40, duration: 1.2 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
