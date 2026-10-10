'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import styles from './Projects.module.css';

export default function Projects() {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        // When nextCard scrolls up, card i scales down and goes behind with subtle dimming
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];

          gsap.to(card, {
            scale: 0.91,
            filter: 'brightness(0.65)',
            transformOrigin: 'center top',
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top bottom',
              end: 'top 120px',
              scrub: true,
              invalidateOnRefresh: true,
            }
          });

          // When a third card arrives, card i scales down further in the deck
          if (i < cards.length - 2) {
            const thirdCard = cards[i + 2];
            gsap.to(card, {
              scale: 0.84,
              filter: 'brightness(0.42)',
              transformOrigin: 'center top',
              ease: 'none',
              scrollTrigger: {
                trigger: thirdCard,
                start: 'top bottom',
                end: 'top 120px',
                scrub: true,
                invalidateOnRefresh: true,
              }
            });
          }
        }
      });
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const featuredProjects = [
    {
      id: 'fresh-art-club',
      title: 'Fresh Art Club Creative Portal',
      category: 'Creative & Art',
      technologies: ['Figma', 'WordPress', 'CSS3'],
      image: '/portfolio/fresh art club/mainone.png',
      link: 'https://freshartclub.com/',
      hasTopDot: true,
    },
    {
      id: 'esotek-corporation',
      title: 'Esotek Corporation',
      category: 'Corporate & Enterprise',
      technologies: ['Figma', 'Adobe CC', 'Corporate UI'],
      image: '/portfolio/Esotek Corporation/mainone.png',
      link: 'https://darkorange-tarsier-721134.hostingersite.com/',
      hasTopDot: false,
    },
    {
      id: 'praize-productions',
      title: 'Praize Productions',
      category: 'Creative & Art',
      technologies: ['Figma', 'Adobe CC', 'Media Design'],
      image: '/portfolio/Praize Productions/mainone.png',
      link: '/projects',
      hasTopDot: true,
    },
    {
      id: 'hireute',
      title: 'HireUTE Vehicle Rental',
      category: 'Mobile Application',
      technologies: ['Figma', 'Mobile UI', 'Rental Platform'],
      image: '/portfolio/HireUTE/mainone.png',
      link: '/projects',
      hasTopDot: false,
    },
    {
      id: 'semrossi',
      title: 'Semrossi Luxury Apparel',
      category: 'E-Commerce & Luxury',
      technologies: ['Figma', 'E-Commerce', 'Brand Identity'],
      image: '/portfolio/Semrossi/mainone.png',
      link: '/projects',
      hasTopDot: true,
    },
    {
      id: 'runner',
      title: 'Runner On-Demand Dispatch',
      category: 'Mobile Application',
      technologies: ['Figma', 'Logistics UI', 'Mobile App'],
      image: '/portfolio/Runner/mainone.png',
      link: '/projects',
      hasTopDot: false,
    },
    {
      id: 'seductive-seeker',
      title: 'Seductive Seeker Luxury Discovery',
      category: 'Web Application',
      technologies: ['Figma', 'Discovery UI', 'Web App'],
      image: '/seductiveOne.png',
      link: 'https://www.figma.com/proto/NZc8NlQXXgQpO5VxYs73uN/Seductive-Seeker?node-id=59-1055',
      hasTopDot: true,
    },
    {
      id: '7sens',
      title: '7Sens Luxury Brand Experience',
      category: 'Creative Agency',
      technologies: ['Figma', 'Next.js', 'React'],
      image: '/portfolio/7Sens/mainone.png',
      link: 'https://7sens-frontend.vercel.app/',
      hasTopDot: false,
    },
    {
      id: 'carat-club',
      title: 'Carat Club Diamonds & Jewelry',
      category: 'E-Commerce & Luxury',
      technologies: ['Figma', '3D Config', 'React'],
      image: '/portfolio/Carat Club/mainone.png',
      link: 'https://carat-club.vercel.app/',
      hasTopDot: true,
    },
    {
      id: 'crconi-digital',
      title: 'Crconi Digital Agency',
      category: 'Digital Agency',
      technologies: ['Figma', 'GSAP', 'Next.js'],
      image: '/portfolio/Crconi Digital/mainone.png',
      link: 'https://crconidigital.com/',
      hasTopDot: false,
    },
    {
      id: 'neuro-kaizen',
      title: 'Neuro Kaizen AI SaaS Dashboard',
      category: 'AI SaaS',
      technologies: ['Figma', 'AI SaaS', 'React'],
      image: '/portfolio/Neuro Kaizen/mainone.png',
      link: 'https://portal.neurokaizen.com/',
      hasTopDot: true,
    },
    {
      id: 'nzl-app',
      title: 'NZL Reverse Bidding App',
      category: 'Mobile App',
      technologies: ['Figma', 'Mobile UI', 'iOS / Android'],
      image: '/portfolio/Nzl App/mainone.png',
      link: 'https://nzlapp.com/',
      hasTopDot: false,
    },
    {
      id: 'raptex',
      title: 'Raptex Crypto Exchange',
      category: 'FinTech',
      technologies: ['Figma', 'FinTech UI', 'Exchange'],
      image: '/portfolio/Raptex/mainone.png',
      link: 'https://www.figma.com/proto/HYpQJy7lcTH1zoAusVB4Cx/Raptex-crypto-Exchange?node-id=1-4',
      hasTopDot: true,
    },
  ];

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">
        
        {/* Section Header matching user reference */}
        <div className={styles.sectionHeader}>
          <div className={styles.limePulseDot} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>FEATURED PROJECTS</h2>
          <p className={styles.sectionSubtitle}>
            These selected projects reflect my passion for blending strategy with creativity — solving real problems through thoughtful design and impactful storytelling.
          </p>
        </div>

        {/* Sticky Stacking Stack: Each subsequent card scrolls up and stacks ABOVE the previous card */}
        <div className={styles.projectsStackList}>
          {featuredProjects.map((project, idx) => {
            const zIndex = 20 + idx;
            const topOffset = `calc(88px + ${idx * 6}px)`;
            const isExternal = project.link && project.link.startsWith('http');
            const targetHref = isExternal ? project.link : (project.link && project.link !== '#' ? project.link : '/projects');

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={styles.stackCard}
                style={{
                  top: topOffset,
                  zIndex: zIndex,
                }}
              >
                {/* Full-Bleed Background Image */}
                <Image
                  src={encodeURI(project.image)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1380px"
                  priority={idx < 2}
                  className={styles.cardBgImage}
                />

                {/* Gradient Overlay: Transparent on top for crystal clear mockup visibility, dark gradient on bottom for pill & button contrast */}
                <div className={styles.cardOverlay} />

                {/* Clickable Backdrop Cover for the card */}
                <a
                  href={targetHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={styles.cardClickCover}
                  aria-label={`View ${project.title}`}
                  title={`View ${project.title}`}
                />

                {/* Top Corner Dot (matching reference) */}
                {project.hasTopDot && (
                  <div className={styles.cardTopLeftDot} aria-hidden="true" />
                )}

                {/* Bottom Bar: Left = Category & Tech Pills | Right = Interactive Arrow Launch Button */}
                <div className={styles.cardBottomBar}>
                  <div className={styles.cardBottomLeft}>
                    <span className={styles.categoryPill}>
                      {project.category}
                    </span>
                    {project.technologies?.map((tech, tIdx) => (
                      <span key={tIdx} className={styles.techPill}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={targetHref}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={styles.cardCornerArrowBtn}
                    aria-label={`Open ${project.title}`}
                    title={`View ${project.title}`}
                  >
                    <ArrowUpRight size={22} className={styles.cornerArrowIcon} />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Browse All Projects Action matching user screenshot */}
        <div className={styles.viewAllFooter}>
          <Link href="/projects" className={styles.browseAllBtn}>
            BROWSE ALL PROJECTS
          </Link>
        </div>

      </div>
    </section>
  );
}
