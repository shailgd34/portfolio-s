'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Search, Sparkles, ChevronLeft, ChevronRight, X, Maximize2, Globe, Smartphone, BarChart3, Layers, Palette } from 'lucide-react';
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

// Intelligent Category Detection for Missing / Fallback Project Images
function getProjectType(project) {
  const cat = (project.category || '').toLowerCase();
  const type = (project.type || '').toLowerCase();
  const tools = Array.isArray(project.technology)
    ? project.technology.join(' ').toLowerCase()
    : (project.tools ? (Array.isArray(project.tools) ? project.tools.join(' ') : project.tools) : '').toLowerCase();
  const live = project.liveLink || (project.link && project.link.startsWith('http') && !project.link.includes('figma.com'));
  const isFigmaTarget = project.figmaLink || (project.link && project.link.includes('figma.com')) || type.includes('figma');

  // Mobile App (when not purely a standalone Figma prototype)
  if ((cat.includes('mobile') || type.includes('mobile app') || tools.includes('mobile ui')) && !isFigmaTarget) {
    return 'mobile';
  }

  // Figma Prototype or Design System
  if (isFigmaTarget || tools.includes('figjam') || cat.includes('brand') || cat.includes('logo')) {
    return 'figma';
  }

  // Mobile App that uses Figma
  if (cat.includes('mobile') || type.includes('mobile')) {
    return 'mobile';
  }

  // FinTech / SaaS / Trading Dashboard
  if (cat.includes('fintech') || type.includes('dashboard') || type.includes('trading') || cat.includes('saas')) {
    return 'dashboard';
  }

  // Default: Website / Web App / WordPress
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
      } catch (e) {}
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
            <svg width="10" height="10" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
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
          <span>FIGMA DESIGN SYSTEM</span>
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
              <div className={styles.phoneIcons}>
                <span className={styles.phoneSignal}>●●●</span>
                <span className={styles.phoneBattery} />
              </div>
            </div>

            <div className={styles.phoneContent}>
              <div className={styles.phoneAppHeader}>
                <div className={styles.appHeaderDot} />
                <div className={styles.appHeaderLine} />
              </div>
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
          <span>MOBILE APP UI CONCEPT</span>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className={`${styles.placeholderBox} ${styles.placeholderDashboard}`} aria-label={`SaaS Dashboard preview for ${cleanTitle}`}>
        <div className={styles.dashboardChrome}>
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
              <defs>
                <linearGradient id={`chartGrad-${project.id || 'dash'}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A3E635" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A3E635" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 55 Q 35 45, 60 25 T 120 35 T 180 15 T 240 8 L 240 70 L 0 70 Z"
                fill={`url(#chartGrad-${project.id || 'dash'})`}
              />
              <path
                d="M 0 55 Q 35 45, 60 25 T 120 35 T 180 15 T 240 8"
                fill="none"
                stroke="#A3E635"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="180" cy="15" r="4" fill="#FFFFFF" stroke="#A3E635" strokeWidth="2.5" />
              <circle cx="240" cy="8" r="4" fill="#FFFFFF" stroke="#A3E635" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        <div className={styles.placeholderBottomPill}>
          <BarChart3 size={11} />
          <span>SAAS & ANALYTICS DASHBOARD</span>
        </div>
      </div>
    );
  }

  // Default: Website / Web App Placeholder
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

        <div className={styles.webCardsRow}>
          <div className={styles.webCardBox} />
          <div className={styles.webCardBox} />
          <div className={styles.webCardBox} />
        </div>
      </div>

      <div className={styles.placeholderBottomPill}>
        <Globe size={11} />
        <span>RESPONSIVE WEB EXPERIENCE</span>
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
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
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
  
  // Slider state for extra projects
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const sliderTrackRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.title = 'Projects Archive & Gallery — Shailash Singh Bhadoriya';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Filter tab definitions
  const filterTabs = [
    { id: 'all', label: 'All Projects', icon: <Layers size={14} /> },
    { id: 'websites', label: 'Websites', icon: <Globe size={14} /> },
    { id: 'mobile', label: 'Mobile Apps', icon: <Smartphone size={14} /> },
    { id: 'figma', label: 'Figma', icon: getTechInfo('figma')?.svg },
    { id: 'react', label: 'React', icon: getTechInfo('react')?.svg },
    { id: 'next', label: 'Next.js', icon: getTechInfo('next.js')?.svg },
    { id: 'wordpress', label: 'WordPress', icon: getTechInfo('wordpress')?.svg },
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
    } else if (filter === 'websites') {
      matchesFilter =
        cat.includes('web') ||
        type.includes('web') ||
        type.includes('wordpress') ||
        techs.some(t => t.includes('web')) ||
        Boolean(p.liveLink && !p.liveLink.includes('figma.com'));
    } else if (filter === 'mobile') {
      matchesFilter =
        cat.includes('mobile') ||
        type.includes('mobile') ||
        techs.some(t => t.includes('mobile') || t.includes('react native') || t.includes('ios') || t.includes('android')) ||
        title.includes('app');
    } else if (filter === 'figma') {
      matchesFilter =
        techs.some(t => t.includes('figma') || t.includes('figjam')) ||
        cat.includes('figma') ||
        type.includes('figma') ||
        Boolean(p.figmaLink) ||
        Boolean(p.link && p.link.includes('figma.com'));
    } else if (filter === 'react') {
      matchesFilter =
        techs.some(t => t.includes('react')) ||
        cat.includes('react') ||
        type.includes('react');
    } else if (filter === 'next') {
      matchesFilter =
        techs.some(t => t.includes('next')) ||
        cat.includes('next') ||
        type.includes('next');
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
    } else {
      matchesFilter =
        cat.includes(filter.toLowerCase()) ||
        type.includes(filter.toLowerCase()) ||
        techs.some(t => t.includes(filter.toLowerCase()));
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
        <div className={styles.meshGlow} />

        <div className="container">
          
          {/* Back link */}
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={16} /> <span>Return to Home</span>
          </Link>

          {/* Header Block */}
          <header className={styles.headerBlock}>
            <div className={styles.badgeTag}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>COMPLETE DESIGN DIRECTORY</span>
            </div>
            <h1 className={styles.archiveTitle}>ALL PROJECTS</h1>
            <p className={styles.archiveDesc}>
              A curated collection of client products, SaaS dashboards, Web3 platforms, mobile applications, and high-impact digital experiences engineered by Shailash Singh Bhadoriya.
            </p>
          </header>

          {/* Search & Filter Toolbar */}
          <div className={styles.toolbar}>
            
            {/* Search Input */}
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by project name or technology (e.g. Next.js, Figma, React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                >
                  ✕
                </button>
              )}
            </div>

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

          {/* Projects Results Count */}
          <div className={styles.resultsBar}>
            <span>Showing <strong>{filteredProjects.length}</strong> Projects</span>
          </div>

          {/* Primary Projects Grid */}
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project, idx) => {
              const rawTechs = Array.isArray(project.technology)
                ? project.technology
                : (typeof project.tools === 'string' ? project.tools.split(',').map(s => s.trim()) : ['Figma', 'UI/UX']);
              // Deduplicate technologies preserving order
              const techs = Array.from(new Set(rawTechs.map(t => typeof t === 'string' ? t.trim() : t).filter(Boolean)));

              // Determine Figma prototype link vs Live Website link
              const figmaUrl = (project.figmaLink && project.figmaLink.trim() !== '')
                ? project.figmaLink
                : ((project.link && project.link.includes('figma.com'))
                  ? project.link
                  : ((project.liveLink && project.liveLink.includes('figma.com')) ? project.liveLink : null));

              const liveWebUrl = (project.liveLink && !project.liveLink.includes('figma.com') && project.liveLink.startsWith('http'))
                ? project.liveLink
                : ((project.link && !project.link.includes('figma.com') && project.link.startsWith('http')) ? project.link : null);

              const hasFigma = Boolean(figmaUrl);
              const primaryUrl = figmaUrl || liveWebUrl || project.link || '#';
              const hasLive = primaryUrl && primaryUrl !== '#';

              return (
                <article key={project.id || idx} className={styles.projectCard}>
                  
                  {/* Card Image Area */}
                  <div className={styles.imageWrapper}>
                    <ProjectCardImage project={project} />
                    
                    {/* Launch Pill on Top Right of Image: Show "View Figma Prototype" when Figma is available, else "Open Live" */}
                    {hasFigma ? (
                      <a
                        href={figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.imageLaunchBtn} ${styles.figmaLaunchBtn}`}
                        aria-label={`View Figma Prototype for ${project.title}`}
                      >
                        <svg width="10" height="15" viewBox="0 0 38 57" fill="none" className={styles.figmaBtnIcon}>
                          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
                          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
                          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                        </svg>
                        <span>View Figma Prototype</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : liveWebUrl ? (
                      <a
                        href={liveWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.imageLaunchBtn}
                        aria-label={`Open ${project.title}`}
                      >
                        <span>Open Live</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : null}

                    <div className={styles.cardCategoryPill}>
                      {project.category}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className={styles.cardDetails}>
                    <h2 className={styles.projectCardTitle}>
                      {project.title || project.name}
                    </h2>

                    <p className={styles.projectDescription}>
                      {project.description || project.desc || 'High-impact design execution with responsive architecture and user-tested workflows.'}
                    </p>

                    {/* Tech Stack Real Brand Icons */}
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

                    {/* Card Footer Link: Change "Explore Project" to "View Figma" when Figma is available */}
                    <div className={styles.cardBottomBar}>
                      <span className={styles.roleText}>{project.role || 'Product Designer'}</span>
                      {hasFigma && liveWebUrl ? (
                        <div className={styles.multiLinksRow}>
                          <a
                            href={figmaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.viewLink} ${styles.viewLinkFigma}`}
                            aria-label={`View Figma Prototype for ${project.title}`}
                          >
                            <span>View Figma</span>
                            <ExternalLink size={13} />
                          </a>
                          <span className={styles.linkDivider}>•</span>
                          <a
                            href={liveWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLink}
                            aria-label={`Explore Live Site for ${project.title}`}
                          >
                            <span>Explore Live</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      ) : hasFigma ? (
                        <a
                          href={figmaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.viewLink} ${styles.viewLinkFigma}`}
                          aria-label={`View Figma Prototype for ${project.title}`}
                        >
                          <span>View Figma</span>
                          <ExternalLink size={14} />
                        </a>
                      ) : liveWebUrl ? (
                        <a
                          href={liveWebUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewLink}
                          aria-label={`Explore Project for ${project.title}`}
                        >
                          <span>Explore Project</span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className={styles.confidentialTag}>Client Confidential</span>
                      )}
                    </div>
                  </div>

                </article>
              );
            })}
          </div>

          {/* ==============================================================
             EXTRA PROJECTS CREATIVE SLIDER GALLERY
             ============================================================== */}
          <section className={styles.extraGallerySection}>
            <div className={styles.galleryHeader}>
              <div className={styles.galleryHeaderLeft}>
                <div className={styles.badgeTag}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <span>CREATIVE VAULT & EXPLORATIONS</span>
                </div>
                <h2 className={styles.galleryTitle}>
                  EXTRA PROJECTS & MOCKUPS GALLERY
                </h2>
                <p className={styles.gallerySubtitle}>
                  Specialized concepts, booking applications, brand marks, and PropTech SaaS experiments from the private archive.
                </p>
              </div>

              {/* Slider Controls */}
              <div className={styles.sliderControls}>
                <div className={styles.slideCounter}>
                  <span className={styles.counterCurrent}>0{activeSlide + 1}</span>
                  <span className={styles.counterDivider}>/</span>
                  <span className={styles.counterTotal}>{extraProjects.length < 10 ? `0${extraProjects.length}` : extraProjects.length}</span>
                </div>

                <div className={styles.arrowGroup}>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className={styles.arrowBtn}
                    aria-label="Previous Project"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className={styles.arrowBtn}
                    aria-label="Next Project"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Creative Horizontal Slider Carousel */}
            <div className={styles.sliderViewport}>
              <div
                ref={sliderTrackRef}
                className={styles.sliderTrack}
                style={{
                  transform: `translateX(-${activeSlide * 340}px)`
                }}
              >
                {extraProjects.map((item, idx) => {
                  const isActive = idx === activeSlide;

                  return (
                    <div
                      key={item.id}
                      className={`${styles.sliderCard} ${isActive ? styles.activeCard : ''}`}
                      onClick={() => setLightboxImg(item)}
                    >
                      <div className={styles.sliderImgWrapper}>
                        <ProjectCardImage
                          project={item}
                          className={styles.sliderCardImg}
                          sizes="360px"
                        />

                        <div className={styles.zoomHoverOverlay}>
                          <Maximize2 size={24} className={styles.zoomIcon} />
                          <span>View Mockup</span>
                        </div>

                        <span className={styles.sliderTagBadge}>{item.tag}</span>
                      </div>

                      <div className={styles.sliderCardInfo}>
                        <span className={styles.sliderCategory}>{item.category}</span>
                        <h3 className={styles.sliderCardTitle}>{item.title}</h3>

                        <div className={styles.sliderPillsRow}>
                          {Array.from(new Set(item.tools || [])).map((tool, toolIdx) => (
                            <TechBadge key={toolIdx} name={tool} compact />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Dots Navigation */}
            <div className={styles.sliderDots}>
              {extraProjects.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveSlide(dotIdx)}
                  className={`${styles.sliderDot} ${dotIdx === activeSlide ? styles.activeDot : ''}`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

          </section>

        </div>
      </main>

      {/* Lightbox Modal for Full-Res Image Zoom */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeLightboxBtn}
              onClick={() => setLightboxImg(null)}
              aria-label="Close Preview"
            >
              <X size={22} />
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
