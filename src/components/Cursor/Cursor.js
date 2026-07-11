'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
  const followerRef = useRef(null);
  const dotRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Avoid running on servers or mobile devices
    if (typeof window === 'undefined' || window.innerWidth <= 1024) return;

    const follower = followerRef.current;
    const dot = dotRef.current;

    if (!follower || !dot) return;

    // Set initial off-screen coordinate to avoid zero jump on mount
    gsap.set([follower, dot], { x: -100, y: -100 });

    // GSAP quickTo creates performance-optimized property animators
    const xToFollower = gsap.quickTo(follower, 'x', { duration: 0.4, ease: 'power3.out' });
    const yToFollower = gsap.quickTo(follower, 'y', { duration: 0.4, ease: 'power3.out' });

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    const onMouseMove = (e) => {
      xToFollower(e.clientX);
      yToFollower(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Event handlers for interactive scaling
    const onMouseEnter = (e) => {
      const text = e.target.getAttribute('data-cursor-text') || '';
      if (text) {
        setCursorText(text);
        setIsHovered(true);
      } else if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.getAttribute('role') === 'button') {
        setCursorText('LINK');
        setIsHovered(true);
      }
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      setCursorText('');
    };

    // Use observer to capture DOM mutations and bind events dynamically
    const bindEvents = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], [data-cursor-text]');
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', onMouseEnter);
        target.removeEventListener('mouseleave', onMouseLeave);
        target.addEventListener('mouseenter', onMouseEnter);
        target.addEventListener('mouseleave', onMouseLeave);
      });
    };

    bindEvents();
    const observer = new MutationObserver(bindEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      const targets = document.querySelectorAll('a, button, [role="button"], [data-cursor-text]');
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', onMouseEnter);
        target.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={followerRef} 
        className={`${styles.cursorFollower} ${isHovered ? styles.hovering : ''}`}
      >
        <span className={styles.labelText}>{cursorText}</span>
      </div>
      <div 
        ref={dotRef} 
        className={styles.cursorDot}
      />
    </>
  );
}
