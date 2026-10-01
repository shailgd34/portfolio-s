'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';

export default function Projects() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Stagger entry reveal of square project tiles
      const items = gridRef.current?.children;
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const featuredProjects = [
    {
      id: 'tugatrades',
      title: 'TugaTrades',
      category: 'FinTech Dashboard',
      tags: ['Figma', 'FigJam', 'Prototyping'],
      link: 'https://www.figma.com/proto/hCYQiIZGAEmp46m7nRlyzc/tugatrades-foundation?node-id=5085-2009&starting-point-node-id=5085%3A2009&t=C61Tu6bpa8qkVllI-1',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(189,0,255,0.2) 100%)',
      color: 'rgba(189, 0, 255, 0.18)',
      image: '/tugatrades.png'
    },
    {
      id: 'equuschain',
      title: 'Equus Chain',
      category: 'Web3 Platform',
      tags: ['React', 'Next.js', 'Tailwind'],
      link: 'https://equuschain.io/',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(0,240,255,0.2) 100%)',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/equuschain.png'
    },
    {
      id: 'nzl-app',
      title: 'NZL Mobile',
      category: 'Mobile Application',
      tags: ['Figma', 'React Native', 'UX/UI'],
      link: 'https://nzlapp.com/',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(245,197,66,0.2) 100%)',
      color: 'rgba(245, 197, 66, 0.18)',
      image: '/nzlmobile.png'
    },
    {
      id: 'crconi-digital',
      title: 'Crconi Digital',
      category: 'Creative Web',
      tags: ['Next.js', 'GSAP', 'CSS Modules'],
      link: 'https://crconidigital.com/',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(5,80,255,0.2) 100%)',
      color: 'rgba(5, 80, 255, 0.18)',
      image: '/crconidigital.png'
    },
    {
      id: 'neurokaizen',
      title: 'NeuroKaizen',
      category: 'SaaS Portal',
      tags: ['React', 'Next.js', 'Tailwind'],
      link: 'https://portal.neurokaizen.com/',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(0,255,102,0.2) 100%)',
      color: 'rgba(0, 255, 102, 0.18)',
      image: '/neurokaizen.png'
    },
    {
      id: 'freshartclub',
      title: 'Fresh Art Club',
      category: 'Creative Portal',
      tags: ['WordPress', 'WooCommerce', 'CSS3'],
      link: 'https://freshartclub.com/',
      bgGradient: 'linear-gradient(135deg, rgba(16,16,24,0) 0%, rgba(255,0,85,0.2) 100%)',
      color: 'rgba(255, 0, 85, 0.18)',
      image: '/freshartclub.png'
    }
  ];

  // Mouse tilt tracking
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = -(e.clientY - centerY) * 0.05;
    const rotateY = (e.clientX - centerX) * 0.05;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
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
    <section id="projects" className={styles.projectsSection} ref={containerRef}>
      {/* Moving Mesh Background */}
      <div className={styles.meshBg}></div>

      <div className="container">

        {/* Simple descriptive header for SEO */}
        <div className="section ">
          <span className="section-subtitle">Work</span>
          <h2 className="section-title">My Projects</h2>
          <p>Explore a diverse range of projects across FinTech, Web3, and creative industries, showcasing modern design and robust development practices.</p>

        </div>

        {/* 3-Column Square Tiles Grid */}
        <div className={styles.projectsGrid} ref={gridRef}>
          {featuredProjects.map((project, idx) => (
            <div key={project.id} className={styles.cardFloatWrapper}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                id={`featured-project-${project.id}`}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={styles.projectCard}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={{ '--tech-color': project.color }}
                data-cursor-text="LAUNCH"
              >
                {/* Hover spotlight glow */}
                <div className={styles.cardGlow}></div>

                {/* Backlight visual gradient overlay */}
                <div
                  className={styles.cardBg}
                  style={{ background: project.bgGradient }}
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.projectImage}
                    />
                  )}
                </div>

                {/* Top Section: Category and launch icon */}
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{project.category}</span>
                  <ExternalLink size={14} className={styles.launchIcon} />
                </div>

                {/* Centered Body Section: Giant title */}
                <div className={styles.cardBody}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                </div>

                {/* Bottom Section: Technologies Row */}
                <div className={styles.cardFooter}>
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.techTag}>
                      {tag}
                    </span>
                  ))}
                </div>

              </a>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className={styles.viewAllContainer}>
          <Link href="/projects" className="btn btn-primary" data-cursor-text="ALL WORK">
            View All 18 Projects <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
