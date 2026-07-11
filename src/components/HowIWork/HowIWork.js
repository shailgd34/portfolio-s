'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HowIWork.module.css';

export default function HowIWork() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Understanding user personas, target demographics, and startup business guidelines. We sync on core objectives, constraints, and success definitions.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="35" stroke="var(--accent-secondary)" strokeWidth="1" strokeDasharray="4 4" className={styles.discoverRadar} />
          <circle cx="50" cy="50" r="20" stroke="var(--accent-primary)" strokeWidth="2" className={styles.discoverCore} />
          <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Research',
      desc: 'Executing comprehensive competitive analyses, conducting user interviews, and compiling research matrices to identify interface friction points.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="70" height="70" stroke="var(--border-color-active)" strokeWidth="1.5" />
          <g className={styles.researchGlass}>
            <circle cx="40" cy="45" r="12" stroke="var(--accent-secondary)" strokeWidth="2" fill="none" />
            <line x1="48" y1="53" x2="65" y2="70" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <path d="M 25 25 H 75 M 25 75 H 55" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" className={styles.researchLine} />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Wireframe',
      desc: 'Drafting low-fidelity wireframes and structural blueprints to align on details before diving into hi-fi aesthetics. Rapid layout validation.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" stroke="var(--accent-primary)" strokeWidth="1" className={styles.wireframeGrid} />
          <rect x="20" y="20" width="60" height="25" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" className={styles.wireframeDraw} />
          <rect x="20" y="55" width="25" height="25" stroke="var(--accent-secondary)" strokeWidth="1.5" className={styles.wireframeDraw} />
          <rect x="55" y="55" width="25" height="25" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" className={styles.wireframeDraw} />
          <line x1="20" y1="20" x2="80" y2="45" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="80" y1="20" x2="20" y2="45" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Design',
      desc: 'Engineering high-fidelity screen designs, UI systems, and visual layouts. Establishing linear grids, color ratios, and luxury typography.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="50" r="22" stroke="var(--accent-secondary)" strokeWidth="2" className={styles.designShape1} />
          <circle cx="65" cy="50" r="22" stroke="var(--accent-primary)" strokeWidth="2" className={styles.designShape2} />
          <path d="M 50 15 Q 50 50, 50 85" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="42" y="42" width="16" height="16" stroke="var(--text-primary)" strokeWidth="1.5" transform="rotate(45 50 50)" />
        </svg>
      )
    },
    {
      num: '05',
      title: 'Prototype',
      desc: 'Wiring clicking mockups inside Figma, configuring motion presets, and building high-fidelity interactive models to review user flows.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="8" stroke="var(--border-color-active)" strokeWidth="1.5" className={styles.prototypeNode} />
          <circle cx="75" cy="25" r="8" stroke="var(--accent-secondary)" strokeWidth="2" className={styles.prototypeNode} />
          <circle cx="50" cy="75" r="8" stroke="var(--accent-primary)" strokeWidth="2" className={styles.prototypeNode} />
          <line x1="33" y1="25" x2="67" y2="25" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" className={styles.prototypeLine} />
          <line x1="25" y1="33" x2="42" y2="67" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" className={styles.prototypeLine} />
          <line x1="72" y1="31" x2="57" y2="68" stroke="var(--accent-secondary)" strokeWidth="2" className={styles.prototypeLine} />
        </svg>
      )
    },
    {
      num: '06',
      title: 'Development',
      desc: 'Coding semantic markup and clean styles in framework environments. Deploying pixel-perfect responsive components using Next.js.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 25 35 L 10 50 L 25 65" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 75 35 L 90 50 L 75 65" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="55" y1="28" x2="45" y2="72" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="80" x2="60" y2="80" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" className={styles.devCode} />
          <circle cx="66" cy="80" r="2" fill="var(--accent-secondary)" className={styles.devCursor} />
        </svg>
      )
    },
    {
      num: '07',
      title: 'Launch',
      desc: 'Verifying responsive benchmarks, running cross-device audits, and publishing files to production servers. Ready to convert audiences.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className={styles.launchRocket}>
            <path d="M 50 15 C 40 25, 40 50, 42 65 C 45 62, 55 62, 58 65 C 60 50, 60 25, 50 15 Z" stroke="var(--accent-secondary)" strokeWidth="2" fill="rgba(0, 240, 255, 0.05)" />
            <path d="M 42 65 C 42 75, 45 80, 50 85 C 55 80, 58 75, 58 65" stroke="var(--accent-primary)" strokeWidth="2" className={styles.launchFlame} />
          </g>
          <line x1="25" y1="85" x2="75" y2="85" stroke="var(--border-color-active)" strokeWidth="1.5" />
          <line x1="50" y1="85" x2="50" y2="92" stroke="var(--accent-primary)" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const slides = container.querySelectorAll(`.${styles.slide}`);

    const ctx = gsap.context(() => {
      // Master timeline with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${(slides.length - 1) * 100}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            // Track dynamic progress to update active nav indicator
            const index = Math.round(self.progress * (slides.length - 1));
            setActiveIndex(index);
          }
        }
      });

      // Chain the vertical overlay slide transitions sequentially in a single timeline
      slides.forEach((slide, idx) => {
        if (idx === 0) return; // Keep slide 0 un-translated as base layer
        tl.fromTo(slide,
          { yPercent: 100 },
          { yPercent: 0, ease: 'none' }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Jump to specific slide on click of dot nav
  const handleDotClick = (idx) => {
    if (typeof window === 'undefined') return;
    const scrollDistance = containerRef.current.offsetTop + idx * window.innerHeight;
    window.scrollTo({
      top: scrollDistance,
      behavior: 'smooth'
    });
  };

  return (
    <section id="how-i-work" className={styles.howIWorkSection} ref={containerRef}>
      
      {/* Pinned Title Info */}
      <div className={styles.sectionTitleOverlay}>
        <span className={styles.overlaySubtitle}>Workflow</span>
        <h2 className={styles.overlayTitle}>How I Work</h2>
      </div>

      {/* Slide Stack */}
      <div className={styles.slidesContainer}>
        {steps.map((step, idx) => (
          <article 
            key={idx} 
            id={`process-step-${step.title.toLowerCase()}`}
            className={styles.slide} 
            style={{ zIndex: idx + 1 }}
          >
            <div className="container">
              <div className={styles.slideGrid}>
                
                {/* Left: Info Text */}
                <div className={styles.slideLeft}>
                  <span className={styles.slideNum}>{step.num}</span>
                  <h3 className={styles.slideTitle}>{step.title}</h3>
                  <p className={styles.slideDesc}>{step.desc}</p>
                </div>

                {/* Right: Custom Vector visualizer */}
                <div className={styles.slideRight}>
                  <div className={styles.visualFrame} data-cursor-text={step.title.toUpperCase()}>
                    {step.icon}
                  </div>
                </div>

              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pinned Dot Navigation (Right Side) */}
      <div className={styles.progressNav}>
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`${styles.progressItem} ${activeIndex === idx ? styles.progressItemActive : ''}`}
            aria-label={`Jump to step ${step.title}`}
          >
            <span className={styles.progressLabel}>{step.title}</span>
            <div className={styles.progressDot}></div>
          </button>
        ))}
      </div>

    </section>
  );
}
