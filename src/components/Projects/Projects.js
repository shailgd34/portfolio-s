'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Sparkles, X, Maximize2 } from 'lucide-react';
import TechBadge, { TechMoreBadge } from '@/components/TechBadge/TechBadge';
import rawProjectsJson from '@/data/projects.json';
import styles from './Projects.module.css';

/**
 * Categorizes any project from projects.json into one of the 4 homepage filter tabs.
 * If projects.json defines an explicit `filterCategory`, that is respected.
 */
function getFilterCategory(p) {
  if (p.filterCategory) return p.filterCategory;

  const cat = (p.category || '').toLowerCase();
  const type = (p.type || '').toLowerCase();
  const name = (p.name || p.title || '').toLowerCase();
  const full = `${cat} ${type} ${name}`.toLowerCase();

  // 1. Mobile Apps
  const isMobile =
    cat.includes('mobile') ||
    type.includes('mobile') ||
    full.includes('ios') ||
    full.includes('android') ||
    full.includes('booking app') ||
    full.includes('tracking app') ||
    full.includes('social app') ||
    cat.includes('photo sharing') ||
    cat.includes('school bus');

  if (isMobile) {
    return 'MOBILE APPS';
  }

  // 2. Fintech & SaaS
  const isFintechSaas =
    full.includes('fintech') ||
    full.includes('saas') ||
    full.includes('finance') ||
    full.includes('trading') ||
    full.includes('crypto') ||
    full.includes('web3') ||
    /\b(ai)\b/i.test(full) ||
    full.includes('telemetry') ||
    full.includes('investment') ||
    full.includes('insurance');

  if (isFintechSaas) {
    return 'FINTECH & SAAS';
  }

  // 3. Web & Platforms
  const isWebPlatform =
    full.includes('enterprise') ||
    full.includes('corporate') ||
    full.includes('commerce') ||
    full.includes('luxury') ||
    full.includes('portal') ||
    full.includes('platform') ||
    full.includes('consulting') ||
    full.includes('next.js') ||
    full.includes('react');

  if (isWebPlatform) {
    return 'WEB & PLATFORMS';
  }

  // 4. UI/UX Design (Creative, WordPress, Portfolios, Styling, Figma Art)
  return 'UI/UX DESIGN';
}

/**
 * Ensures valid URL formatting (prefixes with https:// if bare domain)
 */
function formatUrl(url) {
  if (!url || url === '#' || url.trim() === '') return '#';
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  return `https://${clean}`;
}

/**
 * Standardizes a project object from projects.json for homepage display
 */
function formatProject(p, index) {
  const liveLink = p.liveLink && p.liveLink.trim() !== '' && p.liveLink !== '#' ? p.liveLink : null;
  const figmaLink = p.figmaLink && p.figmaLink.trim() !== '' && p.figmaLink !== '#' ? p.figmaLink : null;
  const genericLink = p.link && p.link.trim() !== '' && p.link !== '#' ? p.link : null;

  const targetLink = formatUrl(liveLink || genericLink || figmaLink || '#');

  const isLive = Boolean(liveLink && !liveLink.includes('figma.com'));
  const isFigma = Boolean(figmaLink || (targetLink && targetLink.includes('figma.com')));

  let badge = 'LIVE PLATFORM';
  if (isLive) {
    badge = 'LIVE WEBSITE';
  } else if (isFigma) {
    badge = 'FIGMA PROTOTYPE';
  } else if (targetLink && targetLink.startsWith('http')) {
    badge = 'LIVE PLATFORM';
  } else {
    badge = 'CASE STUDY';
  }

  const rawTechs = Array.isArray(p.technology)
    ? p.technology
    : (typeof p.tools === 'string' ? p.tools.split(',').map(s => s.trim()) : ['Figma', 'UI/UX']);

  const techList = Array.from(new Set(rawTechs.map(t => typeof t === 'string' ? t.trim() : t).filter(Boolean)));
  const services = techList.length > 0 ? techList.join(', ') : 'UI/UX Architecture, Design Systems';

  return {
    id: p.id || `project-${index}`,
    client: (p.name || p.title || 'UNTITLED PROJECT').toUpperCase(),
    headline: p.description || p.desc || p.role || 'High-performance digital design engineered for commercial impact.',
    category: p.category || p.type || 'UI/UX DESIGN',
    filterCategory: getFilterCategory(p),
    role: p.role || 'UX/UI Designer & Developer',
    services: services,
    techList: techList.length > 0 ? techList : ['Figma', 'UI/UX', 'Design System'],
    image: p.image && p.image.trim() !== '' ? p.image : '/neurokaizen.png',
    link: targetLink,
    figmaLink: figmaLink ? formatUrl(figmaLink) : null,
    liveLink: liveLink ? formatUrl(liveLink) : null,
    badge: badge,
    isFeatured: Boolean(p.isFeatured),
  };
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [projectsDataList, setProjectsDataList] = useState(rawProjectsJson);
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Sync dynamically with /projects.json on mount so editing public/projects.json
  // updates the UI immediately without full recompilation
  useEffect(() => {
    fetch('/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsDataList(data);
        }
      })
      .catch(() => {
        // Fallback to static rawProjectsJson import is already loaded
      });
  }, []);

  const filters = [
    'ALL',
    'FINTECH & SAAS',
    'MOBILE APPS',
    'WEB & PLATFORMS',
    'UI/UX DESIGN',
  ];

  // DYNAMIC HOMEPAGE PROJECTS: Filter directly by "isFeatured": true in projects.json
  const featuredProjects = projectsDataList
    .filter((p) => Boolean(p.isFeatured))
    .map(formatProject);

  const projects = featuredProjects;

  const filteredProjects = activeFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.filterCategory === activeFilter);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">
        
        {/* ====================================================================
            EDITORIAL HEADER (RETRO BRUTALIST AESTHETIC)
            ==================================================================== */}
        <div className={styles.headerContainer}>
          <div className={styles.headerTopRow}>
            
            <div className={styles.titleWrapper}>
              <div className={styles.categorySubheading}>
                <span className={styles.subheadingDash}>[ 04 / SELECTED WORKS ]</span>
                <span>• PROVEN COMMERCIAL IMPACT</span>
              </div>
              <h2 className={styles.sectionTitle}>
                WORK THAT <span className={styles.limeHighlight}>SPEAKS FOR ITSELF.</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                A curated catalog of fintech platforms, mobile ecosystems, enterprise design systems, and responsive web portals built for high performance.
              </p>
            </div>

            {/* Dynamic Total Count Badge & View Archive Link */}
            <div className={styles.headerRight}>
              <div className={styles.totalBadge}>
                <Sparkles size={16} className={styles.sparkleIcon} />
                <span className={styles.totalCountNumber}>
                  {activeFilter === 'ALL' ? `${projects.length}` : `${filteredProjects.length}/${projects.length}`}
                </span>
                <span className={styles.totalCountLabel}>
                  {activeFilter === 'ALL' ? 'FEATURED WORKS' : `${activeFilter}`}
                </span>
              </div>

              <Link href="/projects" className={styles.viewArchiveBtn}>
                <span>ALL ARCHIVE (50+)</span>
                <ArrowRight size={14} className={styles.arrowIcon} />
              </Link>
            </div>

          </div>

          {/* Category Filter Pills with Item Counters */}
          <div className={styles.filterConsole} role="tablist" aria-label="Project filter categories">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              const count = filter === 'ALL'
                ? projects.length
                : projects.filter((p) => p.filterCategory === filter).length;

              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`${styles.filterBtn} ${isActive ? styles.activeFilterBtn : ''}`}
                >
                  <span className={styles.filterBtnName}>{filter}</span>
                  <span className={styles.filterBtnCount}>[{count}]</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            EDITORIAL 2-COLUMN BRUTALIST SHOWCASE
            ==================================================================== */}
        <div className={styles.editorialGrid}>
          {filteredProjects.map((project, index) => {
            const hasFigma = Boolean(project.figmaLink || (project.link && project.link.includes('figma.com')));
            const liveWebUrl = project.liveLink && !project.liveLink.includes('figma.com') 
              ? project.liveLink 
              : (project.link && !project.link.includes('figma.com') && project.link.startsWith('http') ? project.link : null);

            return (
              <article
                key={project.id}
                className={styles.projectCard}
              >
                {/* Card Header Docket Bar */}
                <div className={styles.cardHeaderBar}>
                  <span className={styles.cardIndexNumber}>
                    [ {index < 9 ? `0${index + 1}` : index + 1} / {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length} ]
                  </span>
                  <span className={styles.cardCategoryPill}>
                    {project.category}
                  </span>
                  <span className={styles.cardStatusBadge}>
                    {project.isFeatured ? '★ FEATURED' : 'ACTIVE'}
                  </span>
                </div>

                {/* Cinematic Image Frame (16:10 Ratio) */}
                <div
                  className={styles.imageWrapper}
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  aria-label={`Open project details for ${project.client}`}
                >
                  <Image
                    src={encodeURI(project.image)}
                    alt={project.client}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className={styles.cardImg}
                    priority={index < 2}
                  />

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
                    <h3
                      className={styles.projectCardTitle}
                      onClick={() => setSelectedProject(project)}
                      role="button"
                      tabIndex={0}
                    >
                      {project.client}
                    </h3>
                    <span className={styles.roleTag}>
                      {project.role}
                    </span>
                  </div>

                  <p className={styles.projectDescription}>
                    {project.headline}
                  </p>

                  {/* Tech Stack Row with Interactive Badges */}
                  <div className={styles.techStackRow}>
                    {project.techList.slice(0, 5).map((tech, tIdx) => (
                      <TechBadge key={tIdx} name={tech} />
                    ))}
                    {project.techList.length > 5 && (
                      <TechMoreBadge
                        count={project.techList.length - 5}
                        remainingNames={project.techList.slice(5)}
                      />
                    )}
                  </div>

                  {/* Direct Links Below Project: Consistent Brutalist Buttons */}
                  <div className={styles.cardActionsRow}>
                    {hasFigma ? (
                      <a
                        href={project.figmaLink || project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewProjectBtn}
                        aria-label={`View Figma Prototype for ${project.client}`}
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
                        aria-label={`View live project for ${project.client}`}
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
                      aria-label={`Open details modal for ${project.client}`}
                    >
                      <span>DETAILS</span>
                    </button>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

        {/* Bottom Banner to Browse 50+ Projects in Full Archive */}
        <div className={styles.bottomArchiveBar}>
          <div className={styles.archiveTextGroup}>
            <span className={styles.archivePrompt}>LOOKING FOR MORE CASE STUDIES?</span>
            <span className={styles.archiveCount}>Explore over 50+ live websites, fintech platforms, mobile prototypes, and design systems.</span>
          </div>

          <Link href="/projects" className={styles.bottomArchiveCta}>
            <span>OPEN COMPLETE REPOSITORY</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* ====================================================================
          MODERN RETRO BRUTALIST PROJECT POPUP MODAL (WITH CLOSE BUTTON)
          ==================================================================== */}
      {selectedProject && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Editorial Bar */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span className={styles.modalDot}>●</span>
                <span className={styles.modalKicker}>PROJECT DOSSIER // {selectedProject.category}</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedProject(null)}
                aria-label="Close project modal"
              >
                <span>CLOSE [ESC]</span>
                <X size={15} />
              </button>
            </div>

            {/* Modal Main Grid */}
            <div className={styles.modalBody}>
              {/* Left Visual Preview Frame */}
              <div className={styles.modalVisualPane}>
                <div className={styles.modalImageWrapper}>
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.client}
                    fill
                    sizes="(max-width: 900px) 100vw, 600px"
                    className={styles.modalImg}
                    priority
                  />
                  <div className={styles.modalStatusBadge}>
                    <span>{selectedProject.badge}</span>
                  </div>
                </div>

                <div className={styles.modalMetaBar}>
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaLabel}>ROLE</span>
                    <span className={styles.modalMetaValue}>{selectedProject.role}</span>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaLabel}>TIMELINE</span>
                    <span className={styles.modalMetaValue}>2024 - 2026</span>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <span className={styles.modalMetaLabel}>PLATFORM</span>
                    <span className={styles.modalMetaValue}>{selectedProject.category}</span>
                  </div>
                </div>
              </div>

              {/* Right Information & Action Pane */}
              <div className={styles.modalInfoPane}>
                <div className={styles.modalTopBadgeRow}>
                  <span className={styles.modalCategoryTag}>{selectedProject.category}</span>
                  <span className={styles.modalStatusPill}>{selectedProject.badge}</span>
                </div>

                <h2 id="project-modal-title" className={styles.modalTitle}>
                  {selectedProject.client}
                </h2>

                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>OVERVIEW & EXECUTION</h4>
                  <p className={styles.modalDescription}>
                    {selectedProject.headline}
                  </p>
                </div>

                <div className={styles.modalSection}>
                  <h4 className={styles.modalSectionTitle}>TECHNOLOGIES & CAPABILITIES</h4>
                  <div className={styles.modalTechPills}>
                    {selectedProject.techList.map((tech, idx) => (
                      <span key={idx} className={styles.modalTechTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links Row */}
                <div className={styles.modalActionGroup}>
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalPrimaryActionBtn}
                    >
                      <span>
                        {selectedProject.badge.includes('FIGMA') ? 'LAUNCH FIGMA PROTOTYPE' : 'VISIT LIVE PROJECT'}
                      </span>
                      <ArrowUpRight size={16} />
                    </a>
                  )}

                  {selectedProject.figmaLink && selectedProject.figmaLink !== selectedProject.link && (
                    <a
                      href={selectedProject.figmaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalSecondaryActionBtn}
                    >
                      <span>FIGMA DESIGN FILE</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className={styles.modalDismissBtn}
                  >
                    <span>RETURN TO SHOWCASE</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
