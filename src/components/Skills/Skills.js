'use client';

import { useState, useRef } from 'react';
import { Layers, Sparkles, Code2, Palette, Cpu } from 'lucide-react';
import styles from './Skills.module.css';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const categories = [
    { id: 'all', label: 'All Technologies', count: 12, icon: <Layers size={14} /> },
    { id: 'design', label: 'UI/UX & Design', count: 4, icon: <Palette size={14} /> },
    { id: 'frontend', label: 'Frontend Architecture', count: 6, icon: <Code2 size={14} /> },
    { id: 'platforms', label: 'Platforms & CMS', count: 2, icon: <Cpu size={14} /> },
  ];

  const technologies = [
    // Design
    {
      id: 'figma',
      name: 'Figma',
      category: 'design',
      level: 'Mastery',
      tenure: '6+ Years Exp',
      percent: 98,
      color: '#F24E1E',
      glow: 'rgba(242, 78, 30, 0.25)',
      description: 'Design systems, auto-layout, component variants & rapid prototyping.',
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
      id: 'nextjs',
      name: 'Next.js 14',
      category: 'frontend',
      level: 'Advanced',
      tenure: '4+ Years Exp',
      percent: 94,
      color: '#FFFFFF',
      glow: 'rgba(255, 255, 255, 0.22)',
      description: 'App Router, SSR, SSG, dynamic routing, Vercel deployments & SEO.',
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
      id: 'react',
      name: 'React.js',
      category: 'frontend',
      level: 'Advanced',
      tenure: '4+ Years Exp',
      percent: 95,
      color: '#61DAFB',
      glow: 'rgba(97, 218, 251, 0.25)',
      description: 'Component architecture, custom hooks, state management & Framer Motion.',
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
      id: 'javascript',
      name: 'JavaScript',
      category: 'frontend',
      level: 'Advanced',
      tenure: '5+ Years Exp',
      percent: 92,
      color: '#F7DF1E',
      glow: 'rgba(247, 223, 30, 0.25)',
      description: 'Modern ES6+, async workflows, DOM APIs, event engines & animations.',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#F7DF1E" rx="10"/>
          <text x="75" y="80" fill="#000000" fontSize="38" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">JS</text>
        </svg>
      )
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'frontend',
      level: 'Expert',
      tenure: '4+ Years Exp',
      percent: 96,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.25)',
      description: 'Utility-first styling, design system tokens, responsive utilities & JIT.',
      logo: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38bdf8"/>
        </svg>
      )
    },
    {
      id: 'html-css',
      name: 'HTML5 & CSS3',
      category: 'frontend',
      level: 'Mastery',
      tenure: '6+ Years Exp',
      percent: 99,
      color: '#EF652A',
      glow: 'rgba(239, 101, 42, 0.25)',
      description: 'Semantic HTML, CSS Modules, Flexbox/Grid layouts, keyframe animations.',
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
      id: 'photoshop',
      name: 'Photoshop',
      category: 'design',
      level: 'Expert',
      tenure: '6+ Years Exp',
      percent: 94,
      color: '#31A8FF',
      glow: 'rgba(49, 168, 255, 0.25)',
      description: 'Creative mockups, raster editing, brand key visuals & asset mastering.',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#001829" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#31A8FF" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#31A8FF" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ps</text>
        </svg>
      )
    },
    {
      id: 'illustrator',
      name: 'Illustrator',
      category: 'design',
      level: 'Expert',
      tenure: '5+ Years Exp',
      percent: 90,
      color: '#FF9A00',
      glow: 'rgba(255, 154, 0, 0.25)',
      description: 'Vector illustration, custom icon sets, typography & SVG export workflows.',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#330000" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF9A00" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#FF9A00" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ai</text>
        </svg>
      )
    },
    {
      id: 'adobe-xd',
      name: 'Adobe XD',
      category: 'design',
      level: 'Proficient',
      tenure: '5+ Years Exp',
      percent: 88,
      color: '#FF61F6',
      glow: 'rgba(255, 97, 246, 0.25)',
      description: 'Interactive wireframing, transitions, voice prototyping & design handoffs.',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#2E001F" rx="10"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF61F6" strokeWidth="4" rx="8"/>
          <text x="50" y="64" fill="#FF61F6" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Xd</text>
        </svg>
      )
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      category: 'platforms',
      level: 'Proficient',
      tenure: '4+ Years Exp',
      percent: 86,
      color: '#21759B',
      glow: 'rgba(33, 117, 155, 0.25)',
      description: 'Custom theme design, Gutenberg block styling, WooCommerce & Elementor.',
      logo: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="#21759B"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="3"/>
          <path d="M 28 35 L 42 75 L 50 50 L 58 75 L 72 35 M 34 35 H 24 M 76 35 H 66" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'bootstrap',
      name: 'Bootstrap',
      category: 'platforms',
      level: 'Proficient',
      tenure: '5+ Years Exp',
      percent: 90,
      color: '#7952CC',
      glow: 'rgba(121, 82, 204, 0.25)',
      description: 'Grid systems, modal dialogs, enterprise layout utilities & rapid scaffolding.',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#563d7c" rx="20"/>
          <text x="50" y="72" fill="#ffffff" fontSize="65" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B</text>
        </svg>
      )
    },
    {
      id: 'css3',
      name: 'CSS Modules',
      category: 'frontend',
      level: 'Mastery',
      tenure: '5+ Years Exp',
      percent: 97,
      color: '#1572B6',
      glow: 'rgba(21, 114, 182, 0.25)',
      description: 'Scoped CSS architecture, zero specificity conflicts & responsive design.',
      logo: (
        <svg viewBox="0 0 100 100">
          <path d="M15 15 L22 80 L50 88 L78 80 L85 15 Z" fill="#1572B6"/>
          <path d="M50 22 V81 L72 75 L77 22 Z" fill="#33A9DC"/>
          <path d="M50 35 H33 L34 45 H50 V55 H33 L35 70 L50 74 V22 Z" fill="#FFFFFF"/>
          <path d="M50 35 H67 L66 45 H50 V55 H65 L63 70 L50 74 V22 Z" fill="#EAEAEA" opacity="0.9"/>
        </svg>
      )
    }
  ];

  // Filtered list
  const filteredTechs = activeCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  // Dynamic Mouse Spotlight Handler
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="technology" className={styles.techSection} ref={containerRef}>
      
      {/* Dynamic Animated Mesh & Particles */}
      <div className={styles.meshGlow} />

      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.badgeTag}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>CORE TECHNICAL ARSENAL</span>
            </div>
            <h2 className={styles.sectionTitle}>
              TECHNOLOGY STACK
            </h2>
          </div>
          <p className={styles.sectionSubtitle}>
            A curated synthesis of modern design platforms and frontend frameworks utilized to engineer world-class, responsive digital products.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className={styles.filterCount}>({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Advanced Interactive Bento Grid */}
        <div className={styles.bentoGrid}>
          {filteredTechs.map((tech, idx) => (
            <div
              key={tech.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={styles.bentoCard}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              style={{
                '--glow-color': tech.glow,
                '--accent-color': tech.color,
              }}
            >
              {/* Radial Flashlight Spotlight Beam */}
              <div className={styles.spotlightOverlay} />

              {/* Card Top Row: Logo & Tenure Badge */}
              <div className={styles.cardHeaderRow}>
                <div className={styles.logoBox}>
                  {tech.logo}
                </div>
                <div className={styles.tenureBadge}>
                  {tech.tenure}
                </div>
              </div>

              {/* Card Content */}
              <div className={styles.cardInfo}>
                <div className={styles.nameRow}>
                  <h3 className={styles.techName}>{tech.name}</h3>
                  <span className={styles.levelTag}>{tech.level}</span>
                </div>
                
                <p className={styles.techDesc}>{tech.description}</p>
              </div>

            </div>
          ))}
        </div>

        {/* Infinite Competencies Marquee Banner */}
        <div className={styles.marqueeBanner}>
          <div className={styles.marqueeTrack}>
            <span>✦ DESIGN SYSTEMS ARCHITECTURE</span>
            <span>✦ RAPID FIGMA PROTOTYPING</span>
            <span>✦ NEXT.JS 14 APP ROUTER</span>
            <span>✦ GSAP MICRO-INTERACTIONS</span>
            <span>✦ PIXEL-PERFECT UI/UX</span>
            <span>✦ RESPONSIVE CSS MODULES</span>
            <span>✦ USER RESEARCH & HEURISTICS</span>
            <span>✦ ACCESSIBLE WCAG DESIGN</span>
            {/* Repeat for seamless infinite loop */}
            <span>✦ DESIGN SYSTEMS ARCHITECTURE</span>
            <span>✦ RAPID FIGMA PROTOTYPING</span>
            <span>✦ NEXT.JS 14 APP ROUTER</span>
            <span>✦ GSAP MICRO-INTERACTIONS</span>
            <span>✦ PIXEL-PERFECT UI/UX</span>
            <span>✦ RESPONSIVE CSS MODULES</span>
            <span>✦ USER RESEARCH & HEURISTICS</span>
            <span>✦ ACCESSIBLE WCAG DESIGN</span>
          </div>
        </div>

      </div>
    </section>
  );
}
