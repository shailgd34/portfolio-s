'use client';

import { useState, useEffect, useRef } from 'react';

export default function Counter({ 
  end = 0, 
  duration = 1500, 
  prefix = '', 
  suffix = '', 
  padZero = false 
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const targetElement = countRef.current;
    if (!targetElement) return;

    const startCounting = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      let startTime = null;
      const endValue = typeof end === 'number' ? end : parseInt(end, 10) || 0;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Smooth easeOutCubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * endValue);
        setCount(current);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };

      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  const displayCount = padZero && count < 10 ? `0${count}` : count;

  return (
    <span ref={countRef}>
      {prefix}{displayCount}{suffix}
    </span>
  );
}
