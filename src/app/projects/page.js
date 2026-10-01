'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Widgets from '@/components/Widgets/Widgets';
import Cursor from '@/components/Cursor/Cursor';
import styles from './projects.module.css';
import { projectsData } from '@/data/projectsData';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  // Set document title on page mount and activate magnetic buttons
  useEffect(() => {
    document.title = 'Projects Archive | Sheelash Singh Bhadoriya';

    const ctx = gsap.context(() => {
      const magneticElements = document.querySelectorAll('.btn, [data-magnetic]');
      magneticElements.forEach((el) => {
        const handleMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.35,
            ease: 'power2.out'
          });
        };
        const handleLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
          });
        };
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        el._magnetMove = handleMove;
        el._magnetLeave = handleLeave;
      });
    });

    return () => {
      ctx.revert();
      const magneticElements = document.querySelectorAll('.btn, [data-magnetic]');
      magneticElements.forEach((el) => {
        if (el._magnetMove) {
          el.removeEventListener('mousemove', el._magnetMove);
          el.removeEventListener('mouseleave', el._magnetLeave);
        }
      });
    };
  }, []);

  // Filter projects based on selection
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  // GSAP layout animations on grid filter updates
  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.95, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filter]);

  // Card mouse tilt 3D tracker
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = -(e.clientY - centerY) * 0.06;
    const rotateY = (e.clientX - centerX) * 0.06;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.01,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  return (
    <>
      <Cursor />
      <Navbar theme="dark" toggleTheme={() => {}} activeSection="" />
      
      <main className={styles.archiveWrapper} ref={containerRef}>
        <div className={styles.meshBg}></div>
        
        <div className="container">
          {/* Return Home link */}
          <Link href="/" className={styles.backBtn} data-cursor-text="BACK">
            <ArrowLeft size={16} /> Return to Home
          </Link>

          {/* Header */}
          <header className={styles.headerBlock}>
            <span className={styles.archiveSubtitle}>Portfolio Directory</span>
            <h1 className={styles.archiveTitle}>Selected Works</h1>
            <p className={styles.archiveDesc}>
              A comprehensive archive of {projectsData.length} design interfaces, fintech platforms, Web3 landing grids, and corporate websites built for high-impact startups.
            </p>
          </header>

          {/* Filters pills navigation bar */}
          <nav className={styles.filterBar} aria-label="Project Category Filters">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'fintech', label: 'FinTech' },
              { id: 'web3', label: 'Web3 & AI' },
              { id: 'creative', label: 'Creative & WordPress' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`${styles.filterBtn} ${filter === tab.id ? styles.filterBtnActive : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 3-Column Portfolio grid */}
          <div className={styles.portfolioGrid} ref={gridRef}>
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className={styles.gridItem}>
                <article
                  id={`archive-project-${project.id}`}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={styles.projectCard}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  style={{ '--tech-color': project.color }}
                  data-cursor-text="VIEW"
                >
                  {/* Cover Image background */}
                  {project.image && (
                    <div className={styles.cardBg}>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className={styles.projectImage} 
                      />
                    </div>
                  )}

                  {/* Hover spotlight backdrop */}
                  <div className={styles.cardGlow}></div>

                  <div className={styles.cardTop}>
                    <span className={styles.categoryTag}>{project.category}</span>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDesc}>{project.desc}</p>
                  </div>

                  <div className={styles.cardBottom}>
                    {/* Specifications metadata */}
                    <div className={styles.cardSpecs}>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Role</span>
                        <span className={styles.cardSpecVal}>{project.role}</span>
                      </div>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Tools</span>
                        <span className={styles.cardSpecVal}>{project.tools.split(',')[0]}</span>
                      </div>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Year</span>
                        <span className={styles.cardSpecVal}>{project.timeline}</span>
                      </div>
                    </div>

                    {/* Launch Link */}
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.cardLinkBtn}
                      data-cursor-text="LAUNCH"
                    >
                      Explore Project <ExternalLink size={12} />
                    </a>
                  </div>

                </article>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <Widgets />
    </>
  );
}
