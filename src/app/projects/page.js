'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ExternalLink,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Globe,
  Smartphone,
  BarChart3,
  Layers,
  Palette,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FloatingActions from '@/components/FloatingActions/FloatingActions';
import ScrollTextEffect from '@/components/ScrollTextEffect/ScrollTextEffect';
import styles from './projects.module.css';
import { projectsData } from '@/data/projectsData';
import TechBadge, { TechMoreBadge, getTechInfo } from '@/components/TechBadge/TechBadge';

// 16 Extra Projects from public/extra project/
const extraProjects = [
  {
    id: 'extra-1',
    title: 'BNL Resort Booking App',
    category: 'Mobile Application',
    image: '/extra project/BNL - resport booking app.png',
    tag: 'Hospitality & Travel',
    tools: ['Figma', 'UI/UX', 'Mobile App']
  },
  {
    id: 'extra-2',
    title: 'Ipixit Image Platform',
    category: 'SaaS Platform',
    image: '/extra project/Ipixit - image sharing platform.png',
    tag: 'Media & Social',
    tools: ['Figma', 'Web Design', 'SaaS']
  },
  {
    id: 'extra-3',
    title: 'Ashmount Services',
    category: 'Corporate Web',
    image: '/extra project/ashmount services.png',
    tag: 'Enterprise Services',
    tools: ['Web Design', 'Responsive UI']
  },
  {
    id: 'extra-4',
    title: 'Shivmeera Brand Creative',
    category: 'Brand Identity',
    image: '/extra project/banner shivmeera.png',
    tag: 'Marketing Creative',
    tools: ['Photoshop', 'Illustrator', 'Branding']
  },
  {
    id: 'extra-5',
    title: 'Chatline Hookup Social App',
    category: 'Mobile Application',
    image: '/extra project/chatlinehookup- adult website.png',
    tag: 'Social Network',
    tools: ['Mobile UI', 'Figma', 'Interactive']
  },
  {
    id: 'extra-6',
    title: 'Driving Learning App',
    category: 'EdTech App',
    image: '/extra project/driving learning app.png',
    tag: 'Interactive Education',
    tools: ['Mobile UI', 'iOS Design', 'Figma']
  },
  {
    id: 'extra-7',
    title: 'IJ Art Identity & Logo',
    category: 'Branding & Logo',
    image: '/extra project/ij art logo.png',
    tag: 'Visual Identity',
    tools: ['Illustrator', 'Logo Design']
  },
  {
    id: 'extra-8',
    title: 'Jain Web & Mobile App',
    category: 'Web & Mobile',
    image: '/extra project/jain web & app.png',
    tag: 'Digital Experience',
    tools: ['UI/UX', 'Fullstack Concept']
  },
  {
    id: 'extra-9',
    title: 'PetCare Booking Portal',
    category: 'E-Commerce / Booking',
    image: '/extra project/petcare booking web.png',
    tag: 'Pet Care Booking',
    tools: ['Figma', 'Web Flow', 'UI Design']
  },
  {
    id: 'extra-10',
    title: 'Pyro Property Management',
    category: 'Real Estate SaaS',
    image: '/extra project/pyro - property management app.png',
    tag: 'PropTech SaaS',
    tools: ['Figma', 'SaaS Dashboard']
  },
  {
    id: 'extra-11',
    title: 'SCDS Brand Mark',
    category: 'Brand & Logo',
    image: '/extra project/scds logo.jpg',
    tag: 'Identity Design',
    tools: ['Vector Art', 'Brand Guidelines']
  },
  {
    id: 'extra-12',
    title: 'Shout Scout Discovery',
    category: 'Creative Portal',
    image: '/extra project/shout scout.png',
    tag: 'Community Platform',
    tools: ['Web Design', 'Creative UI']
  },
  {
    id: 'extra-13',
    title: 'Speakeasy Brand Identity',
    category: 'Brand Identity',
    image: '/extra project/speak easy logo.png',
    tag: 'Hospitality Brand',
    tools: ['Typography', 'Branding']
  },
  {
    id: 'extra-14',
    title: 'Travel Booking Portal',
    category: 'Travel & Web Design',
    image: '/extra project/travel website.jpg',
    tag: 'Travel Tourism',
    tools: ['Landing Page', 'Figma']
  },
  {
    id: 'extra-15',
    title: 'Vuyo Brand Concept',
    category: 'Brand & Logo',
    image: '/extra project/vuyo logo.png',
    tag: 'Identity Design',
    tools: ['Illustrator', 'Iconography']
  },
  {
    id: 'extra-16',
    title: 'Zawaya Property Management',
    category: 'Real Estate / PropTech',
    image: '/extra project/zawaya property management.png',
    tag: 'Real Estate App',
    tools: ['PropTech', 'Mobile UI', 'Figma']
  }
];

// Fallback project placeholders
function getProjectType(project) {
  const cat = (project.category || '').toLowerCase();
  const type = (project.type || '').toLowerCase();
  const tools = Array.isArray(project.technology)
    ? project.technology.join(' ').toLowerCase()
    : (project.tools ? (Array.isArray(project.tools) ? project.tools.join(' ') : project.tools) : '').toLowerCase();
  const isFigmaTarget = project.figmaLink || (project.link && project.link.includes('figma.com')) || type.includes('figma');

  if ((cat.includes('mobile') || type.includes('mobile app') || tools.includes('mobile ui')) && !isFigmaTarget) {
    return 'mobile';
  }
  if (isFigmaTarget || tools.includes('figjam') || cat.includes('brand') || cat.includes('logo')) {
    return 'figma';
  }
  if (cat.includes('mobile') || type.includes('mobile')) {
    return 'mobile';
  }
  if (cat.includes('fintech') || type.includes('dashboard') || type.includes('trading') || cat.includes('saas')) {
    return 'dashboard';
  }
  return 'website';
}

function ProjectPlaceholder({ project }) {
  const type = getProjectType(project);
  const cleanTitle = project.title || project.name || 'Creative Project';

  const getDomain = () => {
    if (project.liveLink && project.liveLink.startsWith('http')) {
      try {
        const url = new URL(project.liveLink);
        return url.hostname;
      } catch (e) { }
    }
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${slug || 'design'}.com`;
  };

  if (type === 'figma') {
    return (
      <div className={`${styles.placeholderBox} ${styles.placeholderFigma}`} aria-label={`Figma design preview for ${cleanTitle}`}>
        <div className={styles.figmaCanvasGrid} />
        <div className={styles.figmaFrameHeader}>
          <div className={styles.figmaFrameName}>
            <span className={styles.figmaHash}>#</span>
            <span className={styles.figmaTitleText}>{cleanTitle.slice(0, 24)}</span>
            <span className={styles.figmaZoomPill}>100%</span>
          </div>
          <div className={styles.figmaBadge}>
            <span>FIGMA PROTOTYPE</span>
          </div>
        </div>
        <div className={styles.figmaArtboard}>
          <div className={`${styles.figmaHandle} ${styles.handleTL}`} />
          <div className={`${styles.figmaHandle} ${styles.handleTR}`} />
          <div className={`${styles.figmaHandle} ${styles.handleBL}`} />
          <div className={`${styles.figmaHandle} ${styles.handleBR}`} />
          <div className={styles.figmaWireframe}>
            <div className={styles.figmaWireNav}>
              <div className={styles.wireLogo} />
              <div className={styles.wirePill} />
              <div className={styles.wirePill} />
            </div>
            <div className={styles.figmaWireBody}>
              <div className={styles.wireBar1} />
              <div className={styles.wireBar2} />
              <div className={styles.vectorNodesRow}>
                <svg className={styles.bezierSvg} viewBox="0 0 160 40" fill="none">
                  <path d="M 10 30 C 40 10, 80 35, 120 15 C 135 7, 150 20, 155 25" stroke="#A259FF" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="10" cy="30" r="3.5" fill="#FFFFFF" stroke="#A259FF" strokeWidth="2" />
                  <circle cx="65" cy="22" r="3.5" fill="#FFFFFF" stroke="#0ACF83" strokeWidth="2" />
                  <circle cx="120" cy="15" r="3.5" fill="#FFFFFF" stroke="#1ABCFE" strokeWidth="2" />
                </svg>
              </div>
              <div className={styles.wireCardRow}>
                <div className={styles.wireCardBox} />
                <div className={styles.wireCardBox} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.placeholderBottomPill}>
          <span className={styles.layerDot} />
          <span>FIGMA SYSTEM</span>
        </div>
      </div>
    );
  }

  if (type === 'mobile') {
    return (
      <div className={`${styles.placeholderBox} ${styles.placeholderMobile}`} aria-label={`Mobile application preview for ${cleanTitle}`}>
        <div className={styles.phoneDevice}>
          <div className={styles.phoneSpeakerNotch}>
            <div className={styles.dynamicIsland} />
          </div>
          <div className={styles.phoneScreen}>
            <div className={styles.phoneStatusBar}>
              <span className={styles.phoneTime}>9:41</span>
              <span>●●●</span>
            </div>
            <div className={styles.phoneContent}>
              <div className={styles.phoneHeroBanner}>
                <div className={styles.phoneHeroText1} />
                <div className={styles.phoneHeroText2} />
              </div>
              <div className={styles.phoneGrid}>
                <div className={styles.phoneTile} />
                <div className={styles.phoneTile} />
              </div>
            </div>
            <div className={styles.phoneTabBar}>
              <span className={`${styles.tabDot} ${styles.tabDotActive}`} />
              <span className={styles.tabDot} />
              <span className={styles.tabDot} />
            </div>
          </div>
        </div>
        <div className={styles.placeholderBottomPill}>
          <Smartphone size={11} />
          <span>MOBILE APP UI</span>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className={`${styles.placeholderBox} ${styles.placeholderDashboard}`} aria-label={`SaaS Dashboard preview for ${cleanTitle}`}>
        <div className={styles.dashMetricGroup}>
          <div className={styles.dashMetricCard}>
            <span className={styles.dashMetricLabel}>METRIC INDEX</span>
            <span className={styles.dashMetricVal}>+38.4%</span>
          </div>
          <div className={styles.dashMetricCard}>
            <span className={styles.dashMetricLabel}>ACTIVE USERS</span>
            <span className={styles.dashMetricVal}>14.2K</span>
          </div>
        </div>
        <div className={styles.dashChartWrapper}>
          <svg viewBox="0 0 240 70" className={styles.dashChartSvg} preserveAspectRatio="none">
            <path
              d="M 0 55 Q 35 45, 60 25 T 120 35 T 180 15 T 240 8 L 240 70 L 0 70 Z"
              fill="rgba(255, 107, 53, 0.2)"
            />
            <path
              d="M 0 55 Q 35 45, 60 25 T 120 35 T 180 15 T 240 8"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <div className={styles.placeholderBottomPill}>
          <BarChart3 size={11} />
          <span>SAAS DASHBOARD</span>
        </div>
      </div>
    );
  }

  // Default Website
  return (
    <div className={`${styles.placeholderBox} ${styles.placeholderWebsite}`} aria-label={`Website preview for ${cleanTitle}`}>
      <div className={styles.browserHeader}>
        <div className={styles.browserTrafficDots}>
          <span className={`${styles.trafficDot} ${styles.trafficDotRed}`} />
          <span className={`${styles.trafficDot} ${styles.trafficDotYellow}`} />
          <span className={`${styles.trafficDot} ${styles.trafficDotGreen}`} />
        </div>
        <div className={styles.browserAddressBar}>
          <span className={styles.addressLock}>🔒</span>
          <span className={styles.addressUrl}>https://{getDomain()}</span>
        </div>
        <div className={styles.browserRefreshBtn}>⟳</div>
      </div>
      <div className={styles.browserViewport}>
        <div className={styles.webNavSkeleton}>
          <div className={styles.webNavLogo} />
          <div className={styles.webNavLinks}>
            <span className={styles.webNavLinkPill} />
            <span className={styles.webNavLinkPill} />
          </div>
        </div>
        <div className={styles.webHeroSkeleton}>
          <div className={styles.webHeroText1} />
          <div className={styles.webHeroText2} />
          <div className={styles.webHeroCta}>
            <span>VISIT SITE</span>
          </div>
        </div>
      </div>
      <div className={styles.placeholderBottomPill}>
        <Globe size={11} />
        <span>WEB PLATFORM</span>
      </div>
    </div>
  );
}

function ProjectCardImage({ project, className, sizes }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!project.image || hasError) {
    return <ProjectPlaceholder project={project} />;
  }

  return (
    <Image
      src={encodeURI(project.image)}
      alt={project.title || project.name || 'Project'}
      fill
      sizes={sizes || "(max-width: 900px) 100vw, 50vw"}
      className={`${className || styles.cardImg} ${isLoaded ? styles.imgLoaded : styles.imgLoading}`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
    />
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');

  // Interactive Dossier Modal state
  const [selectedProject, setSelectedProject] = useState(null);

  // Slider state for extra projects
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const sliderTrackRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.title = 'Complete Project Archives (50+) — Sheelash Singh Bhadoriya';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  // Keyboard shortcut: close modals on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setLightboxImg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Filter tab definitions
  const filterTabs = [
    { id: 'all', label: 'All Projects [50+]', icon: <Layers size={14} /> },
    { id: 'mobile', label: 'Mobile Apps', icon: <Smartphone size={14} /> },
    { id: 'fintech', label: 'Fintech & SaaS', icon: <BarChart3 size={14} /> },
    { id: 'websites', label: 'Web & Platforms', icon: <Globe size={14} /> },
    { id: 'figma', label: 'Figma Prototypes', icon: getTechInfo('figma')?.svg },
    { id: 'react', label: 'React & Next.js', icon: getTechInfo('react')?.svg },
    { id: 'wordpress', label: 'WordPress / CMS', icon: getTechInfo('wordpress')?.svg },
    { id: 'ui-ux', label: 'UI/UX Design', icon: <Palette size={14} /> }
  ];

  // Filter & Search logic
  const filteredProjects = projectsData.filter((p) => {
    const cat = (p.category || '').toLowerCase();
    const type = (p.type || '').toLowerCase();
    const title = (p.title || p.name || '').toLowerCase();
    const desc = (p.description || p.desc || '').toLowerCase();
    const techs = Array.isArray(p.technology)
      ? p.technology.map(t => String(t).toLowerCase())
      : (typeof p.tools === 'string' ? p.tools.toLowerCase().split(',').map(s => s.trim()) : []);

    let matchesFilter = true;

    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'mobile') {
      matchesFilter =
        cat.includes('mobile') ||
        type.includes('mobile') ||
        techs.some(t => t.includes('mobile') || t.includes('react native') || t.includes('ios') || t.includes('android')) ||
        title.includes('app');
    } else if (filter === 'fintech') {
      matchesFilter =
        cat.includes('fintech') ||
        type.includes('dashboard') ||
        type.includes('trading') ||
        type.includes('crypto') ||
        cat.includes('saas') ||
        desc.includes('trading') ||
        desc.includes('finance');
    } else if (filter === 'websites') {
      matchesFilter =
        cat.includes('web') ||
        type.includes('web') ||
        type.includes('wordpress') ||
        techs.some(t => t.includes('web')) ||
        Boolean(p.liveLink && !p.liveLink.includes('figma.com'));
    } else if (filter === 'figma') {
      matchesFilter =
        techs.some(t => t.includes('figma') || t.includes('figjam')) ||
        cat.includes('figma') ||
        type.includes('figma') ||
        Boolean(p.figmaLink) ||
        Boolean(p.link && p.link.includes('figma.com'));
    } else if (filter === 'react') {
      matchesFilter =
        techs.some(t => t.includes('react') || t.includes('next')) ||
        cat.includes('react') ||
        type.includes('react');
    } else if (filter === 'wordpress') {
      matchesFilter =
        techs.some(t => t.includes('wordpress') || t.includes('woocommerce') || t.includes('php')) ||
        cat.includes('wordpress') ||
        type.includes('wordpress');
    } else if (filter === 'ui-ux') {
      matchesFilter =
        techs.some(t => t.includes('ui') || t.includes('ux') || t.includes('prototyping') || t.includes('adobe')) ||
        cat.includes('ui') ||
        cat.includes('ux') ||
        type.includes('ui') ||
        type.includes('ux');
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      title.includes(q) ||
      cat.includes(q) ||
      type.includes(q) ||
      desc.includes(q) ||
      techs.some(t => t.includes(q));

    return matchesFilter && matchesSearch;
  });

  // Slider navigation
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % extraProjects.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + extraProjects.length) % extraProjects.length);
  };

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} activeSection="projects" />

      <main className={styles.archiveWrapper}>
        <div className="container">

          {/* Header Area with Return to Home aligned right on flex-top */}
          <div className={styles.headerTopFlex}>
            <header className={styles.headerBlock}>
              <div className={styles.badgeTag}>
                <Sparkles size={14} className={styles.sparkleIcon} />
                <span>[ 04 / ARCHIVE CATALOG ] • ALL CLIENT & PROPRIETARY WORKS</span>
              </div>
              <h1 className={styles.archiveTitle}>COMPLETE ARCHIVES</h1>
              <p className={styles.archiveDesc}>
                A comprehensive showcase of 50+ enterprise SaaS platforms, FinTech dashboards, mobile applications, and high-impact design systems engineered by Sheelash Singh Bhadoriya.
              </p>
            </header>

            <Link href="/" className={styles.backBtn}>
              <ArrowLeft size={14} /> <span>RETURN TO HOME</span>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className={styles.toolbar}>



            {/* Category Filter Pills */}
            <div className={styles.filterPills}>
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`${styles.filterBtn} ${filter === tab.id ? styles.filterBtnActive : ''}`}
                >
                  {tab.icon && (
                    <span className={styles.filterBtnIcon}>
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Projects Results Count Bar */}
          <div className={styles.resultsBar}>
            <span>SHOWING <strong>{filteredProjects.length}</strong> ACTIVE CASE STUDIES</span>
            <span>GRID MODE: 2 IN A ROW // EDITORIAL VIEW</span>
          </div>

          {/* Primary 2-Column Projects Grid */}
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project, idx) => {
              const rawTechs = Array.isArray(project.technology)
                ? project.technology
                : (typeof project.tools === 'string' ? project.tools.split(',').map(s => s.trim()) : ['Figma', 'UI/UX']);
              const techs = Array.from(new Set(rawTechs.map(t => typeof t === 'string' ? t.trim() : t).filter(Boolean)));

              const figmaUrl = (project.figmaLink && project.figmaLink.trim() !== '')
                ? project.figmaLink
                : ((project.link && project.link.includes('figma.com'))
                  ? project.link
                  : ((project.liveLink && project.liveLink.includes('figma.com')) ? project.liveLink : null));

              const liveWebUrl = (project.liveLink && !project.liveLink.includes('figma.com') && project.liveLink.startsWith('http'))
                ? project.liveLink
                : ((project.link && !project.link.includes('figma.com') && project.link.startsWith('http')) ? project.link : null);

              const hasFigma = Boolean(figmaUrl);

              return (
                <article key={project.id || idx} className={styles.projectCard}>

                  {/* Card Header Docket Bar */}
                  <div className={styles.cardHeaderBar}>
                    <span className={styles.cardIndexNumber}>
                      [ {idx < 9 ? `0${idx + 1}` : idx + 1} / {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length} ]
                    </span>
                    <span className={styles.cardCategoryPill}>
                      {project.category || 'Digital Product'}
                    </span>
                    <span className={styles.cardStatusBadge}>
                      {project.isFeatured ? '★ FEATURED' : 'ARCHIVE'}
                    </span>
                  </div>

                  {/* Cinematic Visual Frame (16:10 Ratio) */}
                  <div
                    className={styles.imageWrapper}
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Preview details for ${project.title || project.name}`}
                  >
                    <ProjectCardImage project={project} />

                    {/* Vintage Scanline Film Overlay */}
                    <div className={styles.filmOverlay} />

                    {/* Top Right Launch Tag */}
                    {hasFigma ? (
                      <span className={`${styles.imageLaunchBtn} ${styles.figmaLaunchBtn}`}>
                        <svg width="10" height="15" viewBox="0 0 38 57" fill="none" className={styles.figmaBtnIcon}>
                          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
                          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
                          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                        </svg>
                        <span>FIGMA PROTOTYPE ↗</span>
                      </span>
                    ) : liveWebUrl ? (
                      <span className={styles.imageLaunchBtn}>
                        <span>LIVE PRODUCT ↗</span>
                      </span>
                    ) : null}

                    {/* Center Hover Action: Quick Preview Prompt */}
                    <div className={styles.centerHoverAction}>
                      <span className={styles.quickPreviewHoverBtn}>
                        <Maximize2 size={14} />
                        <span>PREVIEW DOSSIER 👁️</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Details Docket */}
                  <div className={styles.cardDetails}>
                    <div className={styles.titleRow}>
                      <h2
                        className={styles.projectCardTitle}
                        onClick={() => setSelectedProject(project)}
                      >
                        {project.title || project.name}
                      </h2>
                      <span className={styles.roleTag}>
                        {project.role || 'Product Designer'}
                      </span>
                    </div>

                    <p className={styles.projectDescription}>
                      {project.description || project.desc || 'High-impact design execution with responsive architecture and user-tested workflows.'}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className={styles.techStackRow}>
                      {techs.slice(0, 5).map((tech, tIdx) => (
                        <TechBadge key={tIdx} name={tech} />
                      ))}
                      {techs.length > 5 && (
                        <TechMoreBadge
                          count={techs.length - 5}
                          remainingNames={techs.slice(5)}
                        />
                      )}
                    </div>

                    {/* Direct Links Below Project: Consistent Brutalist Buttons */}
                    <div className={styles.cardActionsRow}>
                      {hasFigma ? (
                        <a
                          href={figmaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewProjectBtn}
                          aria-label={`View Figma Prototype for ${project.title || project.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>VIEW FIGMA PROTOTYPE</span>
                          <ArrowUpRight size={14} className={styles.viewProjectIcon} />
                        </a>
                      ) : liveWebUrl ? (
                        <a
                          href={liveWebUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewProjectBtn}
                          aria-label={`View live project for ${project.title || project.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>VIEW LIVE PROJECT</span>
                          <ArrowUpRight size={14} className={styles.viewProjectIcon} />
                        </a>
                      ) : (
                        <span className={styles.confidentialTag}>[ CLIENT CONFIDENTIAL ]</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className={styles.cardDetailsBtn}
                        aria-label={`Open details modal for ${project.title || project.name}`}
                      >
                        <span>DETAILS</span>
                      </button>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>

          
          

        </div>
      </main>

      {/* ==============================================================
         CINEMATIC RETRO DOSSIER MODAL POPUP
         ============================================================== */}
      {selectedProject && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className={styles.modalHeader}>
              <span className={styles.modalTitleText}>
                [ PROJECT DOSSIER // DECLASSIFIED RECORD ]
              </span>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setSelectedProject(null)}
                aria-label="Close Dossier"
              >
                CLOSE [ESC] ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Full-width Image Frame */}
              <div className={styles.modalImageContainer}>
                <ProjectCardImage project={selectedProject} className={styles.modalImage} />
              </div>

              {/* Project Meta Dossier */}
              <div className={styles.modalMetaDocket}>
                <div className={styles.modalHeaderMeta}>
                  <div>
                    <span className={styles.modalCategoryTag}>
                      {selectedProject.category || 'Digital Product'}
                    </span>
                    <h3 className={styles.modalProjectTitle}>
                      {selectedProject.title || selectedProject.name}
                    </h3>
                  </div>
                  <div className={styles.modalRoleRow}>
                    <span>ROLE: <strong>{selectedProject.role || 'Product Designer'}</strong></span>
                    <span>YEAR: <strong>2024 - 2026</strong></span>
                  </div>
                </div>

                <p className={styles.modalDescText}>
                  {selectedProject.description || selectedProject.desc || 'High-impact design execution with responsive architecture, user-tested workflows, and bespoke UI engineering.'}
                </p>

                {/* Full Tech Stack Grid */}
                <div>
                  <h4 className={styles.modalTechTitle}>[ TECHNOLOGIES & TOOLCHAIN ]</h4>
                  <div className={styles.techStackRow}>
                    {(Array.isArray(selectedProject.technology)
                      ? selectedProject.technology
                      : (typeof selectedProject.tools === 'string' ? selectedProject.tools.split(',') : ['Figma', 'UI/UX'])
                    ).map((t, i) => (
                      <TechBadge key={i} name={typeof t === 'string' ? t.trim() : t} />
                    ))}
                  </div>
                </div>

                {/* Modal Action Links */}
                <div className={styles.modalActionsRow}>
                  {selectedProject.figmaLink ? (
                    <a
                      href={selectedProject.figmaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewProjectBtn}
                    >
                      <span>VIEW FIGMA PROTOTYPE</span>
                      <ArrowUpRight size={14} className={styles.viewProjectIcon} />
                    </a>
                  ) : null}

                  {selectedProject.liveLink && !selectedProject.liveLink.includes('figma.com') ? (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewProjectBtn}
                    >
                      <span>VIEW LIVE PROJECT</span>
                      <ArrowUpRight size={14} className={styles.viewProjectIcon} />
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className={styles.cardDetailsBtn}
                  >
                    <span>RETURN TO ARCHIVE</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox Modal for Extra Projects Mockup Zoom */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeLightboxBtn}
              onClick={() => setLightboxImg(null)}
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>

            <div className={styles.lightboxImgBox}>
              <Image
                src={encodeURI(lightboxImg.image)}
                alt={lightboxImg.title}
                width={1200}
                height={800}
                className={styles.lightboxImg}
              />
            </div>

            <div className={styles.lightboxMeta}>
              <div>
                <span className={styles.lightboxCategory}>{lightboxImg.category}</span>
                <h4 className={styles.lightboxTitle}>{lightboxImg.title}</h4>
              </div>
              <span className={styles.lightboxTag}>{lightboxImg.tag}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <FloatingActions />
      <ScrollTextEffect />
    </>
  );
}
