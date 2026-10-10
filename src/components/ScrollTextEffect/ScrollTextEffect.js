'use client';

import { useEffect } from 'react';

export default function ScrollTextEffect() {
  useEffect(() => {
    const textSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p',
      '.sectionTitle',
      '.sectionSubtitle',
      '.nameSubheading',
      '.giantTitle',
      '.itemTitle',
      '.projectTitle',
      '.projectDesc',
      '.faqQuestion',
      '.faqAnswer',
      '.bioText',
      '.statBox',
      '.categoryPill',
      '.subHeaderTag',
      '.columnTitle',
      '.timelineRole',
      '.timelineDate',
      '.timelineCompany',
      '.timelineList li',
      '.timelineImpact',
      '.eduDegree',
      '.eduSchool',
      '.eduDate',
      '.langName',
      '.langProficiency',
      '.skillName',
      '.formTitle',
      '.formSubtitle',
      '.fieldLabel',
      '.brandName',
      '.brandDesc',
      '.colTitle',
      '.linkList li',
      '.copyrightText',
      '.heroBioText'
    ].join(', ');

    let observer;

    const initScrollEffect = () => {
      // Create IntersectionObserver for 0 -> 100 opacity top-to-bottom reveals
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            } else {
              // When scrolling back up and element goes below viewport, reset it
              const rect = entry.boundingClientRect;
              if (rect.top > window.innerHeight) {
                entry.target.classList.remove('in-view');
              }
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -25px 0px',
          threshold: 0.1,
        }
      );

      // Group by sections and apply sequential top-to-bottom stagger delays
      const containers = document.querySelectorAll('section, footer, main');
      
      containers.forEach((container) => {
        const textElements = container.querySelectorAll(textSelectors);
        
        textElements.forEach((el, index) => {
          // Exclude nav items, theme toggle, or elements inside interactive controls
          if (
            el.closest('header') ||
            el.closest('nav') ||
            el.closest('.themeToggle') ||
            el.closest('select') ||
            el.closest('option')
          ) {
            return;
          }

          if (!el.classList.contains('scroll-fade-text')) {
            el.classList.add('scroll-fade-text');
            // Subtle top-to-bottom cascade delay
            const delay = Math.min((index % 6) * 0.07, 0.35);
            el.style.transitionDelay = `${delay}s`;
            observer.observe(el);
          }
        });
      });
    };

    // Initialize after DOM hydration
    const timer = setTimeout(initScrollEffect, 80);

    // Re-check on dynamic changes
    window.addEventListener('resize', initScrollEffect);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initScrollEffect);
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}
