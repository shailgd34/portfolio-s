'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const lensRef = useRef(null);
  const [lensState, setLensState] = useState({
    visible: false,
    text: '[ 👁️ VIEW PROJECT ↗ ]',
    isHoveringProject: false,
  });

  const mousePos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth Lerp loop for silky 60fps tracking
    const updatePosition = () => {
      const ease = 0.18;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(updatePosition);
    };

    animFrameId.current = requestAnimationFrame(updatePosition);

    // Magnetic pull effect on buttons with [data-magnetic] or brutalist buttons
    const handleMagneticMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Gentle spring pull
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    };

    const handleMagneticLeave = (e) => {
      const btn = e.currentTarget;
      btn.style.transform = '';
    };

    // Target tracking for Preview Lens
    const handleTargetOver = (e) => {
      const target = e.target.closest(
        'article, [class*="projectCard"], [class*="imageWrapper"], [class*="deployCard"], [class*="modalImageContainer"]'
      );

      if (target) {
        let label = '[ 👁️ VIEW PROJECT ↗ ]';
        if (target.textContent.includes('FIGMA') || target.querySelector('[class*="figma"]')) {
          label = '[ FIGMA PROTOTYPE ↗ ]';
        } else if (target.textContent.includes('LIVE') || target.querySelector('[class*="liveTag"]')) {
          label = '[ ↗ LIVE PRODUCT ]';
        }

        setLensState({
          visible: true,
          text: label,
          isHoveringProject: true,
        });
        return;
      }

      // Check for standalone links with explicit data-cursor
      const cursorTarget = e.target.closest('[data-cursor-text]');
      if (cursorTarget) {
        setLensState({
          visible: true,
          text: cursorTarget.getAttribute('data-cursor-text'),
          isHoveringProject: true,
        });
        return;
      }

      setLensState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    document.addEventListener('mouseover', handleTargetOver, { passive: true });

    // Bind magnetic buttons
    const bindMagneticElements = () => {
      const magneticTargets = document.querySelectorAll(
        'a[class*="Btn"], button[class*="Btn"], [class*="viewProjectBtn"], [class*="deployLaunchBtn"], [class*="primaryRetroBtn"], [class*="secondaryRetroBtn"], [data-magnetic]'
      );

      magneticTargets.forEach((el) => {
        el.removeEventListener('mousemove', handleMagneticMove);
        el.removeEventListener('mouseleave', handleMagneticLeave);
        el.addEventListener('mousemove', handleMagneticMove);
        el.addEventListener('mouseleave', handleMagneticLeave);
      });
    };

    bindMagneticElements();
    const observer = new MutationObserver(bindMagneticElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleTargetOver);
      observer.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      ref={lensRef}
      className={`${styles.previewLens} ${lensState.visible ? styles.lensVisible : styles.lensHidden}`}
      aria-hidden="true"
    >
      <div className={styles.reticleCornerTL} />
      <div className={styles.reticleCornerTR} />
      <div className={styles.reticleCornerBL} />
      <div className={styles.reticleCornerBR} />
      <span className={styles.lensText}>{lensState.text}</span>
    </div>
  );
}
