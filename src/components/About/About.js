'use client';

import { useEffect, useRef } from 'react';
import { Target, Compass, Eye, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

export default function About() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Line-by-line scroll reveal animation
      const lines = textRef.current.querySelectorAll(`.${styles.revealText}`);
      gsap.fromTo(lines,
        { y: '100%' },
        {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, containerRef);

    // Dynamic mouse parallax tracker for left portrait card
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate angular and translational offset vectors
      const rotateX = -(e.clientY - centerY) * 0.04;
      const rotateY = (e.clientX - centerX) * 0.04;
      const shiftX = (e.clientX - centerX) * 0.03;
      const shiftY = (e.clientY - centerY) * 0.03;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        x: shiftX,
        y: shiftY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    const section = containerRef.current;
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ctx.revert();
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="about" className={styles.aboutSection} ref={containerRef}>
      <div className="container">
        
        <div className="section-title-wrapper">
          <span className="section-subtitle">Biography</span>
          <h2 className="section-title">The Design Mind</h2>
        </div>

        <div className={styles.aboutGrid}>
          {/* Left Column: Portrait */}
          <div className={styles.leftCol}>
            <div ref={cardRef} className={styles.portraitFrame} data-cursor-text="HELLO">
              <div className={styles.portraitImgWrapper}>
                <img 
                  src="/protfoilobanner01.png" 
                  alt="Sheelash Singh Bhadoriya Portrait" 
                  className={styles.portraitImg}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Bio */}
          <div className={styles.rightCol}>
            <div className={styles.bioParagraph} ref={textRef}>
              <span className={styles.revealLine}>
                <span className={styles.revealText}>I am Sheelash Singh Bhadoriya, a Product Designer</span>
              </span>
              <span className={styles.revealLine}>
                <span className={styles.revealText}>(UX/UI Lead) and Frontend Developer based in Indore.</span>
              </span>
              <span className={styles.revealLine}>
                <span className={styles.revealText}>I specialize in converting convoluted SaaS mechanics and</span>
              </span>
              <span className={styles.revealLine}>
                <span className={styles.revealText}>fintech dashboards into elegant, high-converting layouts.</span>
              </span>
            </div>

            {/* Counters Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>5+ Yrs</span>
                <span className={styles.statLabel}>Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>50+ Jobs</span>
                <span className={styles.statLabel}>Delivered</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>3+ Global</span>
                <span className={styles.statLabel}>Countries</span>
              </div>
            </div>

            {/* Mission Vision Cards */}
            <div className={styles.cardsGrid}>
              <div className={styles.valueCard} data-cursor-text="VALUES">
                <div className={styles.cardIcon}>
                  <Target size={20} />
                </div>
                <h4 className={styles.cardTitle}>Mission</h4>
                <p className={styles.cardDesc}>To architect high-growth interfaces that bridge developer efficiency with absolute user ease.</p>
              </div>

              <div className={styles.valueCard} data-cursor-text="VALUES">
                <div className={styles.cardIcon}>
                  <Compass size={20} />
                </div>
                <h4 className={styles.cardTitle}>Vision</h4>
                <p className={styles.cardDesc}>To lead fintech startup design schemes and deploy robust design frameworks globally.</p>
              </div>

              <div className={styles.valueCard} data-cursor-text="VALUES">
                <div className={styles.cardIcon}>
                  <Eye size={20} />
                </div>
                <h4 className={styles.cardTitle}>Philosophy</h4>
                <p className={styles.cardDesc}>Visual designs must look stunning, but key metrics must prove conversion efficacy.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
