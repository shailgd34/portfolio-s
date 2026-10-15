'use client';

import { useState, useEffect } from 'react';

export default function ScrollTextEffect() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Live scroll progress tracker for top laser line
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Cinematic Intersection Observer setup
    let observer;

    const initCinematicObservers = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              // Once revealed, keep it permanently visible to avoid flicker or disappearance
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px 60px 0px',
          threshold: 0.02,
        }
      );

      // Section titles are permanently static and 100% visible across all pages - NEVER hide titles!

      // B. Observe Cards (Project Cards, Editorial Cards, Service Cards, Timeline, Stats)
      const cardSelectors = [
        '.editorialCard',
        '.projectCard',
        'article',
        '.serviceItem',
        '.statBox',
        '.statCard',
        '.timelineCard',
        '.timelineItem',
        '.skillCard',
        '.categoryCard',
        '.sliderCard',
        '.faqItem'
      ].join(', ');

      const containers = document.querySelectorAll('section, footer, main, .editorialGrid, .projectsGrid');

      containers.forEach((container) => {
        const cards = container.querySelectorAll(cardSelectors);
        cards.forEach((card, index) => {
          if (!card.classList.contains('cinematic-card-reveal')) {
            card.classList.add('cinematic-card-reveal');
            // Staggered cascade delay within grid/group
            const delay = Math.min((index % 4) * 0.08, 0.32);
            card.style.transitionDelay = `${delay}s`;
            observer.observe(card);
          }
        });
      });

      // C. Observe General Text, Kickers, Badges, and Paragraphs
      const textSelectors = [
        'p',
        '.sectionSubtitle',
        '.kickerTag',
        '.badgeTag',
        '.categorySubheading',
        '.archiveDesc',
        '.bioText',
        '.timelineRole',
        '.timelineCompany',
        '.formTitle',
        '.formSubtitle',
        '.copyrightText'
      ].join(', ');

      document.querySelectorAll(textSelectors).forEach((el, index) => {
        if (
          el.closest('header') ||
          el.closest('nav') ||
          el.closest('#hero') ||
          el.closest('[class*="headerBlock"]') ||
          el.closest('.themeToggle') ||
          el.closest('select') ||
          el.closest('option') ||
          el.classList.contains('cinematic-title-reveal') ||
          el.classList.contains('cinematic-card-reveal')
        ) {
          return;
        }

        if (!el.classList.contains('scroll-fade-text')) {
          el.classList.add('scroll-fade-text');
          const delay = Math.min((index % 5) * 0.06, 0.28);
          el.style.transitionDelay = `${delay}s`;
          observer.observe(el);
        }
      });

      // D. Interactive 3D Tilt Micro-Interaction on Editorial & Slider Cards (Project gallery cards remain steady without tilt)
      const interactiveCards = document.querySelectorAll('.editorialCard, .sliderCard');

      interactiveCards.forEach((card) => {
        if (card.dataset.tiltInitialized) return;
        card.dataset.tiltInitialized = 'true';

        const handleMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Subtle, tasteful tilt (-3.5 deg to +3.5 deg)
          const rotateX = ((y - centerY) / centerY) * -3;
          const rotateY = ((x - centerX) / centerX) * 3;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
        };

        const handleMouseLeave = () => {
          card.style.transform = '';
        };

        card.addEventListener('mousemove', handleMouseMove, { passive: true });
        card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      });
    };

    const timer = setTimeout(initCinematicObservers, 100);
    window.addEventListener('resize', initCinematicObservers);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', initCinematicObservers);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Cinematic Top Laser Scroll Progress Bar */}
      <div
        className="cinematic-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
    </>
  );
}
