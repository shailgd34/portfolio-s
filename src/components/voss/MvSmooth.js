'use client';

import { useEffect } from 'react';
import { useLive, onTick } from './scaffold';

/**
 * MvSmooth — Inertia smooth scrolling with Lenis.
 * Automatically hooks into the shared onTick rAF loop,
 * enables smooth anchor jumps, and disables gracefully on touch/reduced-motion.
 */
export default function MvSmooth({
  smoothness = 0.1,
  wheelSpeed = 1,
  anchorOffset = 72,
  style,
} = {}) {
  const live = useLive();

  useEffect(() => {
    if (!live || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const w = window;
    if (w.__ltLenis || w.__lenis) return;

    let lenis = null;
    let off = () => {};
    let dead = false;

    const onHash = (e) => {
      const a = e.target?.closest?.("a[href*='#']");
      if (!a || !lenis) return;
      const href = a.getAttribute('href') || '';
      const i = href.indexOf('#');
      const path = href.slice(0, i);
      if (path && path !== window.location.pathname && path !== '') return;
      const id = href.slice(i + 1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -anchorOffset });
      try {
        history.pushState(null, '', '#' + id);
      } catch (err) {}
    };

    // Load Lenis from local dependency or dynamic import
    import('lenis')
      .then((mod) => {
        if (dead) return;
        const LenisClass = mod.default || mod.Lenis || mod;
        lenis = new LenisClass({
          lerp: smoothness,
          wheelMultiplier: wheelSpeed,
          smoothWheel: true,
        });

        w.__ltLenis = lenis;
        w.__lenis = lenis;

        off = onTick(
          () => {},
          undefined,
          (t) => lenis.raf(t)
        );

        document.addEventListener('click', onHash);
        document.documentElement.classList.add('lenis');
      })
      .catch((err) => {
        console.warn('Could not load Lenis:', err);
      });

    return () => {
      dead = true;
      off();
      document.removeEventListener('click', onHash);
      if (lenis) {
        lenis.destroy();
      }
      w.__ltLenis = null;
      w.__lenis = null;
    };
  }, [live, smoothness, wheelSpeed, anchorOffset]);

  return (
    <span
      aria-hidden
      style={{
        ...style,
        display: 'block',
        width: '100%',
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
