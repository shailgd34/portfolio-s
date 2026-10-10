'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProjectCarousel.module.css';
import { projectsData } from '@/data/projectsData';

export default function ProjectCarousel() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0].getBoundingClientRect().width;
      containerRef.current.scrollBy({ left: -cardWidth - 32, behavior: 'smooth' }); // 32 is gap (2rem)
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0].getBoundingClientRect().width;
      const currentScroll = containerRef.current.scrollLeft;
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      
      if (currentScroll >= maxScroll - 10) {
        // Reset to start if at the end
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: cardWidth + 32, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    // Auto-slider every 7 seconds
    const interval = setInterval(() => {
      scrollRight();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const cards = containerRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.carouselSection} ref={sectionRef}>
      <div className={styles.header}>
        <div className="section-title-wrapper">
          <span className="section-subtitle">Latest Additions</span>
          <h2 className="section-title">Featured Projects</h2>
        </div>
        
        <div className={styles.controls}>
          <button className={styles.arrowBtn} onClick={scrollLeft} aria-label="Previous Project">
            <ChevronLeft size={24} />
          </button>
          <button className={styles.arrowBtn} onClick={scrollRight} aria-label="Next Project">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className={styles.carouselContainer} ref={containerRef}>
        {projectsData.map((proj) => (
          <Link href={proj.link} key={proj.id} className={styles.carouselCard} data-cursor-text="VIEW">
            {proj.image && (
              <Image
                src={encodeURI(proj.image)}
                alt={proj.title || 'Project Preview'}
                fill
                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 65vw, 55vw"
                className={styles.cardImage}
              />
            )}
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardTitle}>{proj.title}</h3>
              <span className={styles.cardTech}>{proj.tools}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <Link href="/projects" className="btn btn-primary" data-cursor-text="ALL WORK">
          View All Projects <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
