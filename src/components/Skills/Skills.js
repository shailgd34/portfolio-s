'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Palette, Code2, Cpu, Sparkles, Compass } from 'lucide-react';
import styles from './Skills.module.css';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const categories = [
    { id: 'all', label: 'ALL TOOLS', icon: <Layers size={14} /> },
    { id: 'research', label: 'UX RESEARCH & USABILITY', icon: <Compass size={14} /> },
    { id: 'design', label: 'UI/UX DESIGN', icon: <Palette size={14} /> },
    { id: 'frontend', label: 'FRONTEND CODE', icon: <Code2 size={14} /> },
    { id: 'platforms', label: 'PLATFORMS & CMS', icon: <Cpu size={14} /> },
  ];

  const technologies = [
    {
      id: 'figjam',
      name: 'FigJam',
      category: 'research',
      tag: 'JOURNEYS & FLOWS',
      tenure: '4+ YRS',
      status: 'CORE TOOL',
      description: 'End-to-end user journey mapping, design sprint alignment, affinity diagram clustering, and service blueprints.',
      highlights: ['Journey Maps', 'Affinity Diagrams', 'Sprints'],
      brandGlow: 'rgba(162, 89, 255, 0.4)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" rx="14" fill="#A259FF"/>
          <circle cx="36" cy="50" r="14" fill="#0ACF83"/>
          <circle cx="64" cy="50" r="14" fill="#1ABCFE"/>
        </svg>
      )
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      category: 'research',
      tag: 'BEHAVIORAL ANALYTICS',
      tenure: '3+ YRS',
      status: 'USER TESTING',
      description: 'Click attention heatmaps, scroll-depth drop-off tracking, rage-click diagnostics, and live session recording audits.',
      highlights: ['Click Heatmaps', 'Session Recordings', 'Drop-off Funnels'],
      brandGlow: 'rgba(255, 60, 56, 0.4)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" rx="14" fill="#1C1814"/>
          <path d="M50 20 C65 35 75 55 70 70 C65 85 45 85 35 75 C25 65 35 45 50 20 Z" fill="#FF3C38"/>
          <circle cx="50" cy="62" r="10" fill="#FFAA00"/>
        </svg>
      )
    },
    {
      id: 'miro',
      name: 'Miro',
      category: 'research',
      tag: 'INFO ARCHITECTURE',
      tenure: '4+ YRS',
      status: 'STRATEGY',
      description: 'Open & closed card sorting, multi-tier sitemaps, stakeholder alignment workshops, and empathy mapping.',
      highlights: ['Card Sorting', 'Sitemaps', 'Empathy Maps'],
      brandGlow: 'rgba(255, 212, 0, 0.4)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" rx="14" fill="#050038"/>
          <polygon points="35,30 50,70 30,70" fill="#FFD02F"/>
          <polygon points="50,30 65,70 45,70" fill="#FFD02F"/>
          <polygon points="65,30 80,70 60,70" fill="#FFD02F"/>
        </svg>
      )
    },
    {
      id: 'typeform-maze',
      name: 'Typeform & Maze',
      category: 'research',
      tag: 'USABILITY TESTING',
      tenure: '3+ YRS',
      status: 'EVALUATION',
      description: 'Unmoderated remote prototype testing, 5-second brand tests, quantitative surveys, and System Usability Scale (SUS) tracking.',
      highlights: ['SUS Benchmarks', '5-Sec Tests', 'User Surveys'],
      brandGlow: 'rgba(0, 207, 131, 0.4)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" rx="14" fill="#262627"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="#0ACF83" strokeWidth="8"/>
          <circle cx="50" cy="50" r="12" fill="#0ACF83"/>
        </svg>
      )
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'design',
      tag: 'UI/UX DESIGN',
      tenure: '4+ YRS',
      status: 'PRIMARY',
      description: 'Design systems, component architectures, responsive auto-layouts, and clickable high-fidelity prototypes.',
      highlights: ['Design Systems', 'Auto Layout', 'Dev Handoff'],
      brandGlow: 'rgba(162, 89, 255, 0.35)',
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
      tag: 'WEB FRAMEWORK',
      tenure: '3+ YRS',
      status: 'PRODUCTION',
      description: 'Production web applications leveraging App Router, React Server Components, SSR/SSG, and fast edge routing.',
      highlights: ['App Router', 'Server Actions', 'SSR / SSG'],
      brandGlow: 'rgba(255, 255, 255, 0.3)',
      logo: (
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="black" stroke="#ffffff" strokeWidth="2.5"/>
          <path d="M28 70 V 30 H 38 L 65 67 V 30 H 73 V 70 H 63 L 36 33 V 70 Z" fill="white"/>
        </svg>
      )
    },
    {
      id: 'react',
      name: 'React.js',
      category: 'frontend',
      tag: 'UI LIBRARY',
      tenure: '4+ YRS',
      status: 'CORE ENGINE',
      description: 'Modular component hierarchies, customized React hooks, reactive state workflows, and Virtual DOM rendering.',
      highlights: ['Custom Hooks', 'State Management', 'Virtual DOM'],
      brandGlow: 'rgba(97, 218, 251, 0.35)',
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
      id: 'typescript',
      name: 'TypeScript',
      category: 'frontend',
      tag: 'TYPED SYSTEM',
      tenure: '3+ YRS',
      status: 'STRICT MODE',
      description: 'Robust static typing, complex interface contracts, reusable generics, and zero-runtime-overhead safety.',
      highlights: ['Strict Typing', 'Generics', 'Interface Contracts'],
      brandGlow: 'rgba(49, 120, 198, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#3178C6"/>
          <text x="75" y="80" fill="#FFFFFF" fontSize="38" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">TS</text>
        </svg>
      )
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'frontend',
      tag: 'SCRIPTING',
      tenure: '6 YRS',
      status: 'ESNEXT',
      description: 'Mastery of ES6+ features, asynchronous event loops, DOM performance optimization, and modern browser APIs.',
      highlights: ['Async / Await', 'DOM API', 'Event Loop'],
      brandGlow: 'rgba(247, 223, 30, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#F7DF1E"/>
          <text x="75" y="80" fill="#000000" fontSize="38" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">JS</text>
        </svg>
      )
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'frontend',
      tag: 'UTILITY STYLING',
      tenure: '3+ YRS',
      status: 'PRODUCTION',
      description: 'Rapid interface development with utility classes, bespoke design systems, and responsive token architectures.',
      highlights: ['Utility Classes', 'JIT Engine', 'Custom Theme'],
      brandGlow: 'rgba(56, 189, 248, 0.35)',
      logo: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#38bdf8"/>
        </svg>
      )
    },
    {
      id: 'framer-motion',
      name: 'Framer Motion',
      category: 'frontend',
      tag: 'PHYSICS MOTION',
      tenure: '3+ YRS',
      status: 'INTERACTIVE',
      description: 'Fluid spring physics, declarative layout transitions, orchestrations, and interactive drag gestures.',
      highlights: ['Spring Physics', 'Layout Transitions', 'Gestures'],
      brandGlow: 'rgba(255, 0, 85, 0.35)',
      logo: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="#ff0055"/>
        </svg>
      )
    },
    {
      id: 'gsap',
      name: 'GSAP',
      category: 'frontend',
      tag: 'CINEMATIC MOTION',
      tenure: '2+ YRS',
      status: 'HARDWARE ACCEL',
      description: 'High-performance timelines, synchronized ScrollTrigger orchestrations, and complex SVG morphing.',
      highlights: ['ScrollTrigger', 'Complex Timelines', 'SVG Morphing'],
      brandGlow: 'rgba(10, 228, 72, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#0E100F"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="#0AE448" strokeWidth="4"/>
          <text x="50" y="58" fill="#0AE448" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">GSAP</text>
        </svg>
      )
    },
    {
      id: 'html-css',
      name: 'HTML5 & CSS3',
      category: 'frontend',
      tag: 'CORE FOUNDATION',
      tenure: '6 YRS',
      status: 'STANDARDS',
      description: 'Semantic document hierarchy, fluid CSS Grid/Flexbox layouts, responsive design, and WCAG accessibility standards.',
      highlights: ['Semantic HTML5', 'CSS Grid & Flex', 'Web Accessibility'],
      brandGlow: 'rgba(227, 79, 38, 0.35)',
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
      tag: 'RASTER GRAPHICS',
      tenure: '4+ YRS',
      status: 'CREATIVE',
      description: 'High-end asset manipulation, photo retouching, creative composite hero visuals, and background textures.',
      highlights: ['Compositing', 'Photo Retouching', 'Asset Prep'],
      brandGlow: 'rgba(49, 168, 255, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#001829"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#31A8FF" strokeWidth="4"/>
          <text x="50" y="64" fill="#31A8FF" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ps</text>
        </svg>
      )
    },
    {
      id: 'illustrator',
      name: 'Illustrator',
      category: 'design',
      tag: 'VECTOR GRAPHICS',
      tenure: '4+ YRS',
      status: 'CREATIVE',
      description: 'Scalable brand identity assets, custom vector iconography, illustrations, and web-optimized SVGs.',
      highlights: ['Iconography', 'Vector Art', 'SVG Optimization'],
      brandGlow: 'rgba(255, 154, 0, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#330000"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF9A00" strokeWidth="4"/>
          <text x="50" y="64" fill="#FF9A00" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Ai</text>
        </svg>
      )
    },
    {
      id: 'adobe-xd',
      name: 'Adobe XD',
      category: 'design',
      tag: 'PROTOTYPING',
      tenure: '3+ YRS',
      status: 'WIREFRAMING',
      description: 'Rapid user journey wireframing, transition mockups, stakeholder presentations, and screen flow maps.',
      highlights: ['Wireframing', 'User Journeys', 'Interactive Flows'],
      brandGlow: 'rgba(255, 97, 246, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#2E001F"/>
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="#FF61F6" strokeWidth="4"/>
          <text x="50" y="64" fill="#FF61F6" fontSize="42" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Xd</text>
        </svg>
      )
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      category: 'platforms',
      tag: 'CONTENT MANAGEMENT',
      tenure: '4+ YRS',
      status: 'FULL STACK',
      description: 'Bespoke theme architectures, advanced ACF Pro custom fields, WooCommerce stores, and headless setups.',
      highlights: ['Custom Themes', 'ACF Pro', 'Headless Setup'],
      brandGlow: 'rgba(33, 117, 155, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="#21759B"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="3"/>
          <path d="M 28 35 L 42 75 L 50 50 L 58 75 L 72 35 M 34 35 H 24 M 76 35 H 66" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'css-modules',
      name: 'CSS Modules',
      category: 'frontend',
      tag: 'SCOPED STYLING',
      tenure: '4+ YRS',
      status: 'ORGANIZED',
      description: 'Zero namespace collisions, scoped component styling, maintainable design systems, and tight CSS-to-code cohesion.',
      highlights: ['Scoped Classes', 'Zero Collision', 'Modular Design'],
      brandGlow: 'rgba(21, 114, 182, 0.35)',
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
      id: 'nodejs',
      name: 'Node.js',
      category: 'frontend',
      tag: 'RUNTIME ENGINE',
      tenure: '3+ YRS',
      status: 'BACKEND',
      description: 'Backend microservices, REST API routes, build automation scripts, and NPM package ecosystem tooling.',
      highlights: ['REST APIs', 'NPM Tooling', 'Server Scripts'],
      brandGlow: 'rgba(95, 160, 78, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="#333333" stroke="#5FA04E" strokeWidth="4"/>
          <text x="50" y="60" fill="#5FA04E" fontSize="28" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">JS</text>
        </svg>
      )
    },
    {
      id: 'git',
      name: 'Git & GitHub',
      category: 'platforms',
      tag: 'VERSION CONTROL',
      tenure: '4+ YRS',
      status: 'DEVOPS',
      description: 'Git flow branching strategies, peer pull request reviews, automated CI/CD pipelines, and project releases.',
      highlights: ['Branch Strategies', 'Pull Requests', 'CI/CD Pipelines'],
      brandGlow: 'rgba(240, 80, 50, 0.35)',
      logo: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="#1F2328"/>
          <path d="M50 20 A30 30 0 0 0 40.5 78.5 C42 78.8 42.5 77.8 42.5 77 V71.8 C34.2 73.6 32.4 67.8 32.4 67.8 C31 64.3 29 63.4 29 63.4 C26.3 61.5 29.2 61.6 29.2 61.6 C32.2 61.8 33.8 64.7 33.8 64.7 C36.4 69.2 40.7 68 42.3 67.2 C42.6 65.3 43.4 64 44.2 63.2 C37.5 62.5 30.5 59.8 30.5 48.2 C30.5 44.9 31.7 42.2 33.6 40.1 C33.3 39.3 32.3 36.2 33.9 32.1 C33.9 32.1 36.4 31.3 42.2 35.2 A28.5 28.5 0 0 1 57.2 35.2 C63 31.3 65.5 32.1 65.5 32.1 C67.1 36.2 66.1 39.3 65.8 40.1 C67.7 42.2 68.9 44.9 68.9 48.2 C68.9 59.9 61.8 62.4 55.1 63.2 C56.2 64.1 57.1 65.9 57.1 68.7 V77 C57.1 77.8 57.6 78.8 59.2 78.5 A30 30 0 0 0 50 20 Z" fill="#FFFFFF"/>
        </svg>
      )
    }
  ];

  const filteredTechs = activeCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  return (
    <section id="technology" className={styles.techSection}>
      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerTopRow}>
            
            <div className={styles.headerLeft}>
              <div className={styles.categorySubheading}>
                <span className={styles.subheadingDash}>[ 05 / ARSENAL ]</span>
                <span>• TECHNICAL SPECIFICATIONS</span>
              </div>
              <h2 className={styles.sectionTitle}>
                TECHNOLOGY & <span className={styles.limeHighlight}>SYSTEMS</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                A curated collection of modern technologies, creative tools, and engineering frameworks.
              </p>
            </div>

            {/* Total Count Badge */}
            <div className={styles.totalBadge}>
              <Sparkles size={16} className={styles.sparkleIcon} />
              <span className={styles.totalCountNumber}>{technologies.length}</span>
              <span className={styles.totalCountLabel}>PRODUCTION TOOLS</span>
            </div>

          </div>

          {/* Filter Categories */}
          <div className={styles.filterConsole}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${styles.filterBtn} ${isActive ? styles.activeFilterBtn : ''}`}
                >
                  <span className={styles.filterIcon}>{cat.icon}</span>
                  <span className={styles.filterLabel}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            RETRO BRUTALIST TECHNOLOGY MATRIX
            ==================================================================== */}
        <motion.div 
          layout 
          className={styles.cinematicTechGrid}
        >
          <AnimatePresence>
            {filteredTechs.map((tech, idx) => {
              return (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.35, 
                    delay: idx * 0.02, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={styles.techTileCard}
                  aria-label={`${tech.name} - ${tech.tag}`}
                >
                  {/* Top Docket Bar */}
                  <div className={styles.tileHeaderBar}>
                    <span className={styles.tileIndex}>
                      [ {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} ]
                    </span>
                    <span className={styles.tileTenure}>
                      {tech.tenure}
                    </span>
                  </div>

                  {/* Center SVG Logo */}
                  <div className={styles.tileLogoWrapper}>
                    {tech.logo}
                  </div>

                  {/* Bottom Tech Details */}
                  <div className={styles.tileDetails}>
                    <h3 className={styles.tileName}>
                      {tech.name}
                    </h3>
                    <span className={styles.tileCategoryTag}>
                      {tech.tag}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Cinematic Endless Ticker Marquee */}
        <div className={styles.marqueeBanner}>
          <div className={styles.marqueeTrack}>
            {technologies.concat(technologies).map((t, i) => (
              <div key={i} className={styles.marqueeItem}>
                <span className={styles.marqueeName}>{t.name}</span>
                <span className={styles.marqueeStar}>✦</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
