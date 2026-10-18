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
  ArrowUpRight,
  ArrowRight,
  LayoutGrid,
  List,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FloatingActions from '@/components/FloatingActions/FloatingActions';
import ScrollTextEffect from '@/components/ScrollTextEffect/ScrollTextEffect';
import styles from './projects.module.css';
import { projectsData } from '@/data/projectsData';
import { logosData } from '@/data/logosData';
import { slugify } from '@/data/caseStudiesData';
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

function ProjectCardImage({ project, className, sizes, plateNum = '01' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!project.image || hasError) {
    return <ProjectPlaceholder project={project} />;
  }

  const pType = getProjectType(project);
  const isMobileApp = pType === 'mobile';

  return (
    <div className={styles.vintageImgWrapper}>
      <Image
        src={encodeURI(project.image)}
        alt={project.title || project.name || 'Project'}
        fill
        sizes={sizes || "(max-width: 900px) 100vw, 50vw"}
        className={`${className || (isMobileApp ? styles.vintageCardImgContain : styles.vintageCardImg)} ${isLoaded ? styles.imgLoaded : styles.imgLoading}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Halftone Micro-Dot Pattern Overlay */}
      <div className={styles.halftoneOverlay} aria-hidden="true" />

      {/* Aged Parchment Wash Layer */}
      <div className={styles.parchmentWash} aria-hidden="true" />

      {/* Film Grain Texture */}
      <div className={styles.filmGrainOverlay} aria-hidden="true" />

      {/* Registration Corner Brackets */}
      <span className={`${styles.photoBracket} ${styles.bracketTL}`} aria-hidden="true" />
      <span className={`${styles.photoBracket} ${styles.bracketTR}`} aria-hidden="true" />
      <span className={`${styles.photoBracket} ${styles.bracketBL}`} aria-hidden="true" />
      <span className={`${styles.photoBracket} ${styles.bracketBR}`} aria-hidden="true" />

      {/* Technical Plate Docket */}
      <span className={styles.plateDocket}>PLATE {plateNum} // 1280×800</span>
    </div>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(3);
  const [theme, setTheme] = useState('dark');

  // Logo Showcase & Carousel state
  const [logoCategoryFilter, setLogoCategoryFilter] = useState('all');
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoModalSurface, setLogoModalSurface] = useState('dark');
  const logoCarouselRef = useRef(null);
  const [isLogoCarouselPaused, setIsLogoCarouselPaused] = useState(false);

  const toggleLogoCarouselPause = () => {
    setIsLogoCarouselPaused((prev) => !prev);
  };

  const scrollLogoCarousel = (direction) => {
    if (!logoCarouselRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    logoCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Slider state for extra projects
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderTrackRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.title = 'Complete Project Archives (50+) — Sheelash Singh Bhadoriya';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const handlePrevLogo = () => {
    if (!selectedLogo) return;
    const currentIndex = logosData.findIndex((l) => l.id === selectedLogo.id);
    const prevIndex = (currentIndex - 1 + logosData.length) % logosData.length;
    setSelectedLogo(logosData[prevIndex]);
  };

  const handleNextLogo = () => {
    if (!selectedLogo) return;
    const currentIndex = logosData.findIndex((l) => l.id === selectedLogo.id);
    const nextIndex = (currentIndex + 1) % logosData.length;
    setSelectedLogo(logosData[nextIndex]);
  };

  // Keyboard shortcut: close modals on ESC & navigate logos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedLogo(null);
      }
      if (selectedLogo) {
        if (e.key === 'ArrowLeft') handlePrevLogo();
        if (e.key === 'ArrowRight') handleNextLogo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLogo]);

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

  // Logo Showcase filter definitions
  const logoFilterTabs = [
    { id: 'all', label: 'All Marks [17]', count: '17' },
    { id: 'tech', label: 'FinTech & Tech [4]', count: '04' },
    { id: 'culinary', label: 'Culinary & Dining [2]', count: '02' },
    { id: 'luxury', label: 'Luxury & Art [3]', count: '03' },
    { id: 'creative', label: 'Creative & Media [4]', count: '04' },
    { id: 'business', label: 'Advisory & Fleet [4]', count: '04' }
  ];

  const filteredLogos = logosData.filter((item) => {
    if (logoCategoryFilter === 'all') return true;
    if (logoCategoryFilter === 'tech') return ['Fintech & Trading', 'Enterprise Tech', 'Hardware & Energy', 'Photography & Media'].includes(item.category);
    if (logoCategoryFilter === 'culinary') return ['Hospitality & Food', 'Culinary & Dining'].includes(item.category);
    if (logoCategoryFilter === 'luxury') return ['Luxury & Art', 'Lifestyle & Luxury', 'Commodities & Trading'].includes(item.category);
    if (logoCategoryFilter === 'creative') return ['Creative Arts', 'Music & Entertainment', 'Media & Communication', 'Design & Community'].includes(item.category);
    if (logoCategoryFilter === 'business') return ['Venture Capital', 'Logistics & Fleet', 'Business Advisory', 'Community & Healthcare'].includes(item.category);
    return true;
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
            {/* Real-time Search Box */}
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="SEARCH 50+ CASE STUDIES BY TECH, KEYWORD, OR DOMAIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                  aria-label="Clear search query"
                >
                  <X size={14} />
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

          {/* Projects Results Count Bar with View Mode Toggle */}
          <div className={styles.resultsBar}>
            <div className={styles.resultsInfo}>
              <span className={styles.resultsTag}>[ 04 / ACTIVE ARCHIVES ]</span>
              <span>SHOWING <strong>{filteredProjects.length}</strong> ACTIVE CASE STUDIES</span>
            </div>

            <div className={styles.gridDensityToggle} role="group" aria-label="Grid Column Density">
              <span className={styles.densityLabel}>GRID VIEW:</span>
              <button
                type="button"
                onClick={() => setGridCols(3)}
                className={`${styles.densityBtn} ${gridCols === 3 ? styles.densityBtnActive : ''}`}
                aria-label="3 Columns Compact Grid"
              >
                <LayoutGrid size={13} />
                <span>3 COLUMNS</span>
              </button>
              <button
                type="button"
                onClick={() => setGridCols(2)}
                className={`${styles.densityBtn} ${gridCols === 2 ? styles.densityBtnActive : ''}`}
                aria-label="2 Columns Large Grid"
              >
                <Layers size={13} />
                <span>2 COLUMNS</span>
              </button>
            </div>
          </div>

          {/* ==============================================================
             EDITORIAL IMAGE & PROJECT GRID (IMAGE SHOWN + PROJECT DETAILS)
             ============================================================== */}
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateBadge}>[ NOTICE: 0 MATCHES ]</div>
              <h3 className={styles.emptyStateTitle}>NO ARCHIVED SPECIFICATIONS FOUND</h3>
              <p className={styles.emptyStateText}>
                No project dossiers match your current filter or keyword search &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                className={styles.emptyStateResetBtn}
              >
                RESET ARCHIVE FILTERS
              </button>
            </div>
          ) : (
            <div className={`${styles.editorialProjectsGrid} ${gridCols === 2 ? styles.grid2Cols : ''}`}>
              {filteredProjects.map((project, idx) => {
                const slug = slugify(project.slug || project.id || project.title || project.name);
                const rawTechs = Array.isArray(project.technology)
                  ? project.technology
                  : (typeof project.tools === 'string' ? project.tools.split(',').map((s) => s.trim()) : ['Figma', 'UI/UX']);
                const techs = Array.from(new Set(rawTechs.map((t) => (typeof t === 'string' ? t.trim() : t)).filter(Boolean)));

                const figmaUrl = (project.figmaLink && project.figmaLink.trim() !== '')
                  ? project.figmaLink
                  : ((project.link && project.link.includes('figma.com'))
                    ? project.link
                    : ((project.liveLink && project.liveLink.includes('figma.com')) ? project.liveLink : null));

                const liveWebUrl = (project.liveLink && !project.liveLink.includes('figma.com') && project.liveLink.startsWith('http'))
                  ? project.liveLink
                  : ((project.link && !project.link.includes('figma.com') && project.link.startsWith('http')) ? project.link : null);

                const plateNum = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
                const totalCount = filteredProjects.length < 10 ? `0${filteredProjects.length}` : `${filteredProjects.length}`;

                return (
                  <article key={project.id || idx} className={styles.editorialGridCard}>
                    {/* Header Bar Docket */}
                    <div className={styles.cardHeaderBar}>
                      <div className={styles.cardHeaderLeft}>
                        <span className={styles.cardIndexNumber}>[ {plateNum} / {totalCount} ]</span>
                        <span className={styles.cardCategoryPill}>{project.category || 'Digital Product'}</span>
                      </div>
                      {project.isFeatured ? (
                        <span className={styles.cardFeaturedBadge}>★ TOP WORK</span>
                      ) : (
                        <span className={styles.cardRoleBadge}>{project.role || 'Design'}</span>
                      )}
                    </div>

                    {/* Image Frame with 16:10 Ratio & Vintage Risograph Treatment */}
                    <Link
                      href={`/projects/${slug}`}
                      className={styles.cardImageWrapper}
                      aria-label={`Open case study for ${project.title || project.name}`}
                    >
                      <ProjectCardImage
                        project={project}
                        plateNum={plateNum}
                        sizes={gridCols === 2 ? "(max-width: 680px) 100vw, 50vw" : "(max-width: 680px) 100vw, (max-width: 1180px) 50vw, 33vw"}
                      />

                      {/* Top Right Quick Launch Tag */}
                      {figmaUrl ? (
                        <span className={`${styles.imageLaunchBtn} ${styles.figmaLaunchBtn}`}>
                          <span>FIGMA ↗</span>
                        </span>
                      ) : liveWebUrl ? (
                        <span className={styles.imageLaunchBtn}>
                          <span>LIVE ↗</span>
                        </span>
                      ) : null}

                      {/* Center Hover Action */}
                      <div className={styles.centerHoverAction}>
                        <span className={styles.quickPreviewHoverBtn}>
                          <Maximize2 size={13} />
                          <span>CASE STUDY ↗</span>
                        </span>
                      </div>
                    </Link>

                    {/* Card Details Dossier: Title, Description, Tech Badges, Action Buttons */}
                    <div className={styles.cardDetails}>
                      <div className={styles.cardDetailsTop}>
                        <div className={styles.titleRow}>
                          <Link
                            href={`/projects/${slug}`}
                            className={styles.cardTitleLink}
                          >
                            <h3 className={styles.projectCardTitle}>
                              {project.title || project.name}
                            </h3>
                          </Link>
                        </div>

                        <p className={styles.projectDescription}>
                          {project.description || project.desc || 'Engineered interface, user flows, and scalable design system.'}
                        </p>

                        {/* Tech Stack Badges */}
                        <div className={styles.techStackRow}>
                          {techs.slice(0, 3).map((t, i) => (
                            <TechBadge key={i} name={t} />
                          ))}
                          {techs.length > 3 && (
                            <TechMoreBadge count={techs.length - 3} remainingNames={techs.slice(3)} />
                          )}
                        </div>
                      </div>

                      {/* Pinned Bottom Actions Row */}
                      <div className={styles.cardActionsRow}>
                        <Link
                          href={`/projects/${slug}`}
                          className={styles.viewProjectBtn}
                          aria-label={`Explore case study for ${project.title || project.name}`}
                        >
                          <span>CASE STUDY</span>
                          <ArrowRight size={13} className={styles.viewProjectIcon} />
                        </Link>

                        {figmaUrl ? (
                          <a
                            href={figmaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.cardDetailsBtn}
                            aria-label={`Open Figma Prototype for ${project.title || project.name}`}
                          >
                            <span>FIGMA ↗</span>
                          </a>
                        ) : liveWebUrl ? (
                          <a
                            href={liveWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.cardDetailsBtn}
                            aria-label={`Open Live Demo for ${project.title || project.name}`}
                          >
                            <span>LIVE ↗</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* ==============================================================
             BRAND IDENTITIES & LOGOMARKS (NEWSPAPER PAPER-CUTTING SCRAPBOOK)
             ============================================================== */}
          <section className={styles.logosSection} id="brand-logos">
            {/* Newspaper Masthead Editorial Header */}
            <div className={styles.newspaperMasthead}>
              <div className={styles.mastheadMetaRow}>
                <span className={styles.mastheadMetaTag}>[ CLASSIFIED SUPPLEMENT // ARCHIVAL PRESS CLIPPINGS ]</span>
                <span className={styles.mastheadEdition}>VOL. 1984–2026 • ROTOGRAVURE INK PRESS</span>
                <span className={styles.mastheadStampBadge}>OFFICIAL DISPATCH</span>
              </div>

              <div className={styles.newspaperRuleDouble} />

              <div className={styles.logosHeaderBar}>
                <div className={styles.logosHeaderLeft}>
                  <div className={styles.clippingCutoutLabel}>
                    <span>✂ CUT ALONG DOTTED LINE</span>
                    <span className={styles.docketArchiveCode}>// PRESS CLIPPING ARCHIVE</span>
                  </div>
                  <h2 className={styles.logosTitle}>BRAND IDENTITIES & TRADEMARKS</h2>
                  <p className={styles.newspaperSubhead}>
                    Authentic client insignias, vector logomarks, and brand identities clipped directly from commercial print publications and digital design systems.
                  </p>
                </div>

                <div className={styles.carouselArrows}>
                  <button
                    type="button"
                    className={styles.carouselArrowBtn}
                    onClick={() => scrollLogoCarousel('left')}
                    aria-label="Previous clippings"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className={styles.carouselArrowBtn}
                    onClick={() => scrollLogoCarousel('right')}
                    aria-label="Next clippings"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.newspaperRuleSingle} />
            </div>

            {/* Seamless Old Paper Cutting Scrapbook Carousel */}
            <div
              className={styles.logoCarouselViewport}
              ref={logoCarouselRef}
              onMouseEnter={() => setIsLogoCarouselPaused(true)}
              onMouseLeave={() => setIsLogoCarouselPaused(false)}
            >
              <div
                className={`${styles.logoCarouselTrack} ${isLogoCarouselPaused ? styles.carouselPaused : ''}`}
              >
                {[...logosData, ...logosData].map((item, idx) => {
                  const itemIndex = (idx % logosData.length) + 1;
                  const itemCode = itemIndex < 10 ? `0${itemIndex}` : `${itemIndex}`;
                  const isDarkBg = item.bgColor && !item.bgColor.toLowerCase().startsWith('#fff') && !item.bgColor.toLowerCase().startsWith('#faf');

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={styles.newspaperClippingItem}
                      onClick={() => {
                        setSelectedLogo(item);
                        setLogoModalSurface(item.bgColor === '#FFFFFF' || item.bgColor.startsWith('#FFF') ? 'light' : 'dark');
                      }}
                      title={`Inspect ${item.title} Press Clipping`}
                    >
                      {/* Translucent Washi / Masking Tape Strip holding paper */}
                      <div className={styles.tapeStrip} aria-hidden="true" />

                      {/* Main Newsprint Paper Cutout Body */}
                      <div className={styles.clippingPaperCard}>
                        {/* Scissors Cut Header Docket */}
                        <div className={styles.clippingDocketHeader}>
                          <span className={styles.cutDocketCode}>[ FIG. {itemCode} // PRESS ]</span>
                          <span className={styles.cutDocketSection}>SEC. {item.year || '2025'}</span>
                        </div>

                        {/* Inked Press Bed / Plate Container */}
                        <div
                          className={styles.clippingPressBed}
                          style={{
                            backgroundColor: item.bgColor || (isDarkBg ? '#181512' : '#F4ECE1'),
                            borderColor: item.borderColor || '#181512'
                          }}
                        >
                          {/* Corner Registration Brackets */}
                          <span className={`${styles.pressBracket} ${styles.pressTL}`} />
                          <span className={`${styles.pressBracket} ${styles.pressTR}`} />
                          <span className={`${styles.pressBracket} ${styles.pressBL}`} />
                          <span className={`${styles.pressBracket} ${styles.pressBR}`} />

                          {/* Subtle Halftone Print Grain */}
                          <div className={styles.halftonePrintOverlay} />

                          <div className={styles.badgeLogoWrap}>
                            <Image
                              src={encodeURI(item.image)}
                              alt={item.title}
                              width={180}
                              height={180}
                              className={styles.badgeLogoImg}
                            />
                          </div>

                          {/* Rubber Stamp Watermark in corner */}
                          <div className={styles.postalStampOverlay}>
                            <span>APPROVED</span>
                          </div>
                        </div>

                        {/* Newspaper Article Caption Docket */}
                        <div className={styles.clippingCaptionDocket}>
                          <div className={styles.clippingTitleRow}>
                            <h4 className={styles.clippingTitle}>{item.title}</h4>
                            <span className={styles.clippingTagPill}>{item.tagText || 'TRADEMARK'}</span>
                          </div>
                          <p className={styles.clippingClientText}>
                            {item.client || item.industry || item.category}
                          </p>
                          <div className={styles.clippingFooterMeta}>
                            <span className={styles.clippingDeliverablesCount}>
                              {item.deliverables?.length || 3} DELIVERABLES
                            </span>
                            <span className={styles.clippingInspectLink}>
                              INSPECT ↗
                            </span>
                          </div>
                        </div>

                        {/* Scissors cut dashed guide at bottom */}
                        <div className={styles.scissorsGuideBottom}>
                          <span>✂ -----------------</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ==============================================================
         RETRO LOGOMARK DOSSIER MODAL
         ============================================================== */}
      {selectedLogo && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedLogo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.logoModalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              '--modal-accent': selectedLogo.accentColor,
              '--modal-border': selectedLogo.borderColor,
            }}
          >
            {/* Top Modal Header */}
            <div className={styles.logoModalHeader}>
              <div className={styles.logoModalHeaderLeft}>
                <span className={styles.modalDossierTag}>
                  [ LOGOMARK DOSSIER // {selectedLogo.id.toUpperCase()} ]
                </span>
                <span className={styles.modalYearTag}>YEAR {selectedLogo.year}</span>
              </div>

              {/* Prev / Next & Close */}
              <div className={styles.logoModalNavActions}>
                <button
                  type="button"
                  className={styles.logoNavBtn}
                  onClick={handlePrevLogo}
                  title="Previous Logo (Left Arrow)"
                >
                  <ChevronLeft size={16} /> PREV
                </button>
                <button
                  type="button"
                  className={styles.logoNavBtn}
                  onClick={handleNextLogo}
                  title="Next Logo (Right Arrow)"
                >
                  NEXT <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  className={styles.closeModalBtn}
                  onClick={() => setSelectedLogo(null)}
                  aria-label="Close Dossier"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Split 2 columns */}
            <div className={styles.logoModalBody}>
              {/* Left Column: Huge Preview with Canvas Background Toggle */}
              <div className={styles.logoModalCanvasCol}>
                {/* Surface Switcher */}
                <div className={styles.surfaceSwitcher}>
                  <span className={styles.surfaceLabel}>SURFACE:</span>
                  <button
                    type="button"
                    className={`${styles.surfaceBtn} ${logoModalSurface === 'dark' ? styles.surfaceBtnActive : ''}`}
                    onClick={() => setLogoModalSurface('dark')}
                  >
                    DARK
                  </button>
                  <button
                    type="button"
                    className={`${styles.surfaceBtn} ${logoModalSurface === 'light' ? styles.surfaceBtnActive : ''}`}
                    onClick={() => setLogoModalSurface('light')}
                  >
                    LIGHT
                  </button>
                  <button
                    type="button"
                    className={`${styles.surfaceBtn} ${logoModalSurface === 'brand' ? styles.surfaceBtnActive : ''}`}
                    onClick={() => setLogoModalSurface('brand')}
                  >
                    BRAND COLOR
                  </button>
                </div>

                {/* Canvas Area */}
                <div
                  className={`${styles.logoModalCanvas} ${
                    logoModalSurface === 'dark'
                      ? styles.canvasDark
                      : logoModalSurface === 'light'
                      ? styles.canvasLight
                      : styles.canvasBrand
                  }`}
                  style={
                    logoModalSurface === 'brand'
                      ? { backgroundColor: selectedLogo.bgColor }
                      : {}
                  }
                >
                  {/* Subtle retro alignment grid lines */}
                  <div className={styles.canvasGridLines} />
                  
                  {/* Large Logo */}
                  <div className={styles.modalLogoImgWrap}>
                    <Image
                      src={encodeURI(selectedLogo.image)}
                      alt={selectedLogo.title}
                      width={650}
                      height={450}
                      className={styles.modalLargeLogoImg}
                      priority
                    />
                  </div>

                  <div className={styles.canvasWatermark}>
                    <span>{selectedLogo.shape.toUpperCase()} GEOMETRY • {selectedLogo.industry.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Specifications & Identity Brief */}
              <div className={styles.logoModalInfoCol}>
                <div className={styles.modalIdentityHeader}>
                  <div className={styles.modalMetaTagRow}>
                    <span className={styles.modalCategoryBadge}>
                      {selectedLogo.category}
                    </span>
                    <span className={styles.modalShapeBadge}>
                      SHAPE: {selectedLogo.shape.toUpperCase()}
                    </span>
                  </div>
                  <h2 className={styles.modalLogoTitle}>{selectedLogo.title}</h2>
                  <p className={styles.modalClientName}>{selectedLogo.client}</p>
                </div>

                {/* Design Narrative */}
                <div className={styles.modalSectionBox}>
                  <span className={styles.modalSectionHeading}>[ DESIGN CONCEPT & GEOMETRY ]</span>
                  <p className={styles.modalConceptText}>{selectedLogo.desc}</p>
                </div>

                {/* Deliverables Suite */}
                <div className={styles.modalSectionBox}>
                  <span className={styles.modalSectionHeading}>[ DELIVERABLES & ASSETS ]</span>
                  <div className={styles.modalDeliverablesList}>
                    {selectedLogo.deliverables?.map((deliv, i) => (
                      <span key={i} className={styles.modalDeliverablePill}>
                        • {deliv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spec Table */}
                <div className={styles.modalSpecTable}>
                  <div className={styles.modalSpecRow}>
                    <span className={styles.modalSpecKey}>INDUSTRY</span>
                    <span className={styles.modalSpecVal}>{selectedLogo.industry}</span>
                  </div>
                  <div className={styles.modalSpecRow}>
                    <span className={styles.modalSpecKey}>YEAR</span>
                    <span className={styles.modalSpecVal}>{selectedLogo.year}</span>
                  </div>
                  <div className={styles.modalSpecRow}>
                    <span className={styles.modalSpecKey}>PALETTE</span>
                    <div className={styles.modalPaletteSwatches}>
                      {[
                        selectedLogo.bgColor,
                        selectedLogo.borderColor,
                        selectedLogo.accentColor,
                        selectedLogo.textColor
                      ].filter(Boolean).map((hex, hIdx) => (
                        <div key={hIdx} className={styles.modalSwatch} title={hex}>
                          <span className={styles.swatchDot} style={{ background: hex }} />
                          <span className={styles.swatchHex}>{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className={styles.modalFooterActions}>
                  <a
                    href={encodeURI(selectedLogo.image)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalDownloadBtn}
                  >
                    <span>OPEN ORIGINAL ASSET</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
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
