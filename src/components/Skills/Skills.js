'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';

export default function Skills() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const wrappers = gridRef.current.children;
      gsap.fromTo(wrappers,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const technologies = [
    // Row 1 (Coding Tools)
    {
      id: 'html',
      name: 'HTML',
      color: 'rgba(227, 79, 38, 0.18)', // HTML Orange
      logo: (
        <svg viewBox="0 0 100 100">
          <path d="M15 15 L22 80 L50 88 L78 80 L85 15 Z" fill="#E34F26"/>
          <path d="M50 22 V81 L72 75 L77 22 Z" fill="#EF652A"/>
          <path d="M50 35 H33 L34 45 H50 V55 H33 L35 70 L50 74 V22 Z" fill="#FFFFFF"/>
          <path d="M50 35 H67 L66 45 H50 V55 H65 L63 70 L50 74 V22 Z" fill="#EAEAEA" opacity="0.9"/>
        </svg>
      )
    },
    {
      id: 'css',
      name: 'CSS',
      color: 'rgba(21, 114, 182, 0.18)', // CSS Blue
      logo: (
        <svg viewBox="0 0 100 100">
          <path d="M15 15 L22 80 L50 88 L78 80 L85 15 Z" fill="#1572B6"/>
          <path d="M50 22 V81 L72 75 L77 22 Z" fill="#33A9DC"/>
          <path d="M50 35 H33 L34 45 H50 V55 H33 L35 70 L50 74 V22 Z" fill="#FFFFFF"/>
          <path d="M50 35 H67 L66 45 H50 V55 H65 L63 70 L50 74 V22 Z" fill="#EAEAEA" opacity="0.9"/>
        </svg>
      )
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      color: 'rgba(247, 223, 30, 0.18)', // JS Yellow
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#F7DF1E" rx="10"/>
          <text x="75" y="80" fill="#000000" fontSize="38" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">JS</text>
        </svg>
      )
    },
    {
      id: 'react',
      name: 'React.js',
      color: 'rgba(97, 218, 251, 0.2)', // React Cyan
      logo: (
        <svg viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="8" ry="22" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="22" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(90 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="22" fill="none" stroke="#61dafb" strokeWidth="5" transform="rotate(150 50 50)" />
          <circle cx="50" cy="50" r="6" fill="#61dafb" />
        </svg>
      )
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      color: 'rgba(255, 255, 255, 0.18)', // Next White
      logo: (
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="black" stroke="#ffffff" strokeWidth="2"/>
          <path d="M28 70 V 30 H 38 L 65 67 V 30 H 73 V 70 H 63 L 36 33 V 70 Z" fill="url(#nextGlnsb3)"/>
          <defs>
            <linearGradient id="nextGlnsb3" x1="50" y1="30" x2="68" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      color: 'rgba(56, 189, 248, 0.18)', // Tailwind Cyan
      logo: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38bdf8"/>
        </svg>
      )
    },
    {
      id: 'bootstrap',
      name: 'Bootstrap',
      color: 'rgba(121, 82, 179, 0.18)', // Bootstrap Purple
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#563d7c" rx="20"/>
          <text x="50" y="72" fill="#ffffff" fontSize="65" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B</text>
        </svg>
      )
    },
    {
      id: 'figma',
      name: 'Figma',
      color: 'rgba(242, 78, 30, 0.18)', // Figma Red-Orange
      logo: (
        <svg viewBox="0 0 100 150">
          <path d="M25 37.5a25 25 0 0 1 25-25h25v50H50a25 25 0 0 1-25-25z" fill="#F24E1E"/>
          <path d="M25 87.5a25 25 0 0 1 25-25h25v50H50a25 25 0 0 1-25-25z" fill="#A259FF"/>
          <path d="M50 87.5a25 25 0 1 1 50 0 25 25 0 0 1-50 0z" fill="#1ABCFE"/>
          <path d="M75 12.5a25 25 0 1 1 0 50h-25v-50z" fill="#0ACF83"/>
          <path d="M25 137.5a25 25 0 0 1 25-25h25v25a25 25 0 0 1-25 25 25 25 0 0 1-25-25z" fill="#FF7262"/>
        </svg>
      )
    },
    {
      id: 'adobe-xd',
      name: 'Adobe XD',
      color: 'rgba(255, 97, 246, 0.18)', // XD Magenta
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#2E001F" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF61F6" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#FF61F6" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Xd</text>
        </svg>
      )
    },
    {
      id: 'illustrator',
      name: 'Illustrator',
      color: 'rgba(255, 154, 0, 0.18)', // Illustrator Orange
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#330000" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF9A00" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#FF9A00" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ai</text>
        </svg>
      )
    },
    {
      id: 'photoshop',
      name: 'Photoshop',
      color: 'rgba(49, 168, 255, 0.18)', // PS Blue
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#001829" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#31A8FF" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#31A8FF" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ps</text>
        </svg>
      )
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      color: 'rgba(33, 117, 155, 0.18)', // WP Blue
      logo: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="#21759B"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="3"/>
          <path d="M 28 35 L 42 75 L 50 50 L 58 75 L 72 35 M 34 35 H 24 M 76 35 H 66" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Mouse move handler for 3D card tilt tracking
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Angle calculations relative to cursor coordinate distances
    const rotateX = -(e.clientY - centerY) * 0.08;
    const rotateY = (e.clientX - centerX) * 0.08;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // Reset card tilt coordinates on mouse leave
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
    <section id="skills" className={styles.skillsSection} ref={containerRef}>
      {/* Moving Mesh Background */}
      <div className={styles.meshBg}></div>

      <div className="container">
        
        {/* Simplified Header for SEO */}
        <div className="section-title-wrapper">
          <span className="section-subtitle">Expertise</span>
          <h1 className="section-title">My Skills</h1>
        </div>

        <div className={styles.skillsGrid} ref={gridRef}>
          {technologies.map((tech, idx) => (
            <div key={tech.id} className={styles.cardFloatWrapper}>
              <article
                id={`skill-card-${tech.id}`}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={styles.skillCard}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={{ '--tech-color': tech.color }}
                data-cursor-text={tech.name.toUpperCase()}
              >
                {/* Hover backlight glow spotlight */}
                <div className={styles.techGlow}></div>

                {/* Brand SVG vector logo */}
                <div className={styles.logoWrapper}>
                  {tech.logo}
                </div>

                {/* Technology Name label */}
                <h3 className={styles.skillName}>{tech.name}</h3>

              </article>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
