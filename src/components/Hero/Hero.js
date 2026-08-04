'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, Download, Mail, Linkedin, Globe } from 'lucide-react';
import gsap from 'gsap';
import styles from './Hero.module.css';

export default function Hero() {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const cardRef = useRef(null);
  const primaryBtnRef = useRef(null);
  const secondaryBtnRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Stagger word slide-reveal
    tl.to(`.${styles.wordSpan}`, {
      y: '0%',
      duration: 1.2,
      stagger: 0.15,
    });

    tl.fromTo(`.${styles.heroDescription}`, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.8'
    );

    tl.fromTo(`.${styles.heroCta} > *`, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
      '-=0.6'
    );

    tl.fromTo(`.${styles.heroMeta} > *`,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
      '-=0.6'
    );

    tl.fromTo(`.${styles.floatingSocials} > *`,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 },
      '-=0.8'
    );

    tl.fromTo(`.${styles.scrollIndicator}`,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    );

    // Initial spotlight centered off-screen
    gsap.set(spotlightRef.current, { left: '50%', top: '50%' });

    // GSAP quickTo for ultra-smooth performance spotlight tracking
    const xToSpotlight = gsap.quickTo(spotlightRef.current, 'left', { duration: 0.6, ease: 'power2.out' });
    const yToSpotlight = gsap.quickTo(spotlightRef.current, 'top', { duration: 0.6, ease: 'power2.out' });

    // Global mouse tracking coordinates inside Hero section
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      xToSpotlight(x);
      yToSpotlight(y);

      // Interactive 3D tilt calculation for profile image card
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Angle offset based on cursor distance from card center
        const rotateX = -(e.clientY - cardCenterY) * 0.06;
        const rotateY = (e.clientX - cardCenterX) * 0.06;

        gsap.to(cardRef.current, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    // Reset card tilt when cursor exits Hero boundaries
    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Magnetic attraction handler for buttons
  const handleMagneticMove = (e, buttonRef) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;

    // Shift button 35% of vector offset distance toward cursor
    gsap.to(btn, {
      x: dx * 0.35,
      y: dy * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Liquid elasticity snap-back release
  const handleMagneticLeave = (buttonRef) => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)' // Elastic liquid-like bounce
    });
  };

  return (
    <section id="hero" className={styles.heroWrapper} ref={containerRef}>
      {/* Moving Ambient Grids */}
      <div className={styles.meshBackground}></div>

      {/* Massive decorative background logo S */}
      <svg viewBox="0 0 100 100" className={styles.bgLogoVector} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M 75 32 C 75 18, 25 18, 25 42 C 25 65, 75 58, 75 80 C 75 92, 25 92, 25 78" 
          fill="none"
          stroke="url(#bgLogoGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="bgLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mouse Follower Glow Spotlight */}
      <div ref={spotlightRef} className={styles.spotlight}></div>

      {/* Floating abstract geometry */}
      <div className={`${styles.particle} ${styles.particleCircle}`}></div>
      <div className={`${styles.particle} ${styles.particleTriangle}`}></div>

      <div className="container">
        <div className={styles.heroGrid}>
          
          <div className={styles.heroLeft}>
            {/* Availability Pulser */}
            <div className={styles.availabilityBadge}>
              <div className={styles.pulseDot}></div>
              <span>Available for projects</span>
            </div>

            {/* Typography Heading split into exactly 2 lines */}
            <h1 className={styles.heroTitle}>
              <span className={styles.titleRow}>
                <span className={styles.wordSpan}>Sheelash</span>
                <span className={`${styles.wordSpan} ${styles.singhWord}`} style={{ marginLeft: '0.25em' }}>Singh</span>
              </span>
              <span className={styles.titleRow}>
                <span className={styles.wordSpan}>Bhadoriya</span>
              </span>
            </h1>

            <p className={styles.heroDescription}>
              I am Sheelash Singh Bhadoriya, a Product Designer (UX/UI) and Frontend Developer specializing in converting complex financial and SaaS interfaces into elegant digital experiences.
            </p>

            {/* Magnetic CTA Buttons */}
            <div className={styles.heroCta}>
              <a 
                ref={primaryBtnRef}
                href="#projects" 
                className="btn btn-primary"
                data-cursor-text="VIEW"
                onMouseMove={(e) => handleMagneticMove(e, primaryBtnRef)}
                onMouseLeave={() => handleMagneticLeave(primaryBtnRef)}
              >
                Explore Work <ArrowRight size={16} />
              </a>
              <a 
                ref={secondaryBtnRef}
                href="/shailash 2026.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                data-cursor-text="GET CV"
                onMouseMove={(e) => handleMagneticMove(e, secondaryBtnRef)}
                onMouseLeave={() => handleMagneticLeave(secondaryBtnRef)}
              >
                Get CV <Download size={16} />
              </a>
            </div>

            {/* Custom Metadata Labels */}
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>Indore, IN</span>
                <span className={styles.metaLabel}>Current Location</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>5+ Years</span>
                <span className={styles.metaLabel}>Design Experience</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div ref={cardRef} className={styles.imageFrame} data-cursor-text="ME">
              <div className={styles.profileImgContainer}>
                <img 
                  src="/protfoilobanner01.png" 
                  alt="Sheelash Singh Bhadoriya" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Social Icons (Left Side) */}
      <div className={styles.floatingSocials}>
        <a href="https://www.behance.net/prithvibhadour" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Behance" data-cursor-text="BEHANCE">
          <Globe size={18} />
        </a>
        <a href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="LinkedIn" data-cursor-text="LINKEDIN">
          <Linkedin size={18} />
        </a>
        <a href="mailto:shailashs79@gmail.com" className={styles.socialIconLink} aria-label="Email" data-cursor-text="EMAIL">
          <Mail size={18} />
        </a>
      </div>

      {/* Scroll Down mouse wheel indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll Down</span>
        <div className={styles.mouseOutline}>
          <div className={styles.mouseWheel}></div>
        </div>
      </div>
    </section>
  );
}
