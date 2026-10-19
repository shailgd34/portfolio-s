'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Palette,
  Type,
  Code2,
  Wrench,
  Layers,
  ExternalLink
} from 'lucide-react';
import Footer from '@/components/Footer/Footer';
import { getProjectBySlug, getNextPrevProjects } from '@/data/caseStudiesData';
import styles from './caseStudy.module.css';

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params?.slug || '';

  const project = getProjectBySlug(slug);
  const { prev: prevProject, next: nextProject } = getNextPrevProjects(slug);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Sync title and ensure viewport scrolls to top on navigation
  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} — Product Design | Sheelash`;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [project, slug]);

  if (!project) {
    return (
      <div className={styles.caseStudyPage}>
        <div className="container" style={{ padding: '140px 20px', textAlign: 'center' }}>
          <h1 className={styles.notFoundTitle}>PROJECT NOT FOUND</h1>
          <p className={styles.notFoundText}>
            The requested project details could not be found.
          </p>
          <Link href="/#projects" className={styles.highlightedBackButton}>
            ← RETURN TO ALL PROJECTS
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasFigma = Boolean(project.figmaLink);
  const hasLive = Boolean(project.liveLink && !project.liveLink.includes('figma.com'));

  // Simple Tools list
  const toolsList = (project.toolsList && project.toolsList.length > 0)
    ? project.toolsList
    : ['Figma', 'FigJam', 'Adobe Illustrator', 'Adobe Photoshop', 'Hotjar', 'Miro', 'React'];

  // Simple Colors list
  const colorsList = project.designSystem?.colors || [
    { name: 'Primary Orange', hex: '#FF6B35', role: 'Main CTA buttons, active states, key highlights' },
    { name: 'Obsidian Dark', hex: '#110F0D', role: 'Primary background canvas & contrast elements' },
    { name: 'Parchment Light', hex: '#F7F3EC', role: 'Clean readable text color & cards' },
    { name: 'Success Green', hex: '#0ACF83', role: 'Positive indicators, habit streaks & alerts' }
  ];

  // Simple Typography list
  const typographyList = project.designSystem?.typography || [
    { label: 'Headings & Titles', family: 'Fraunces / Antonio Bold', use: 'Big headlines, numbers, and hero titles' },
    { label: 'Technical Mono', family: 'Azeret Mono', use: 'Dockets, tags, dates, and metrics' },
    { label: 'Body Text', family: 'Manrope', use: 'Clean descriptions, advice cards, and questions' }
  ];

  // Simple Tech Stack
  const techStack = project.technology?.stack || [
    { name: 'React & Next.js', role: 'Fast, responsive component architecture' },
    { name: 'CSS Modules', role: 'Clean scoped styling without style bugs' },
    { name: 'Figma Design Tokens', role: 'Exact color and font match between design and code' },
    { name: 'Chart.js & SVG', role: 'Smooth, lightweight data visualization' }
  ];

  // Simple Summary / Description
  const descriptionText = project.overview?.description || project.summary || project.tagline;

  // Key highlights
  const highlights = project.overview?.coreObjectives || [
    'Designed a clean, intuitive interface that is easy to understand without confusion.',
    'Organized complex information into simple, bite-sized steps.',
    'Built a consistent design system with reusable components in Figma.',
    'Ensured full mobile responsiveness and fast page loading speed.'
  ];

  return (
    <div className={styles.caseStudyPage}>
      {/* WEBSITE HEADER HIDDEN AS REQUESTED */}

      {/* ====================================================================
          TOP BAR: HIGHLIGHTED BACK BUTTON & QUICK LINKS
          ==================================================================== */}
      <nav className={styles.topBar} aria-label="Project navigation">
        <div className="container">
          <div className={styles.topBarInner}>
            <div className={styles.topBarLeft}>
              <Link href="/#projects" className={styles.highlightedBackButton}>
                <ArrowLeft size={16} />
                <span>← BACK TO ALL PROJECTS</span>
              </Link>
              <span className={styles.topBarBreadcrumb}>
                [ {project.title} ]
              </span>
            </div>

            <div className={styles.topActions}>
              {hasFigma && (
                <a
                  href={project.figmaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerActionBtn}
                  title="Open Figma Prototype"
                >
                  <svg width="11" height="16" viewBox="0 0 38 57" fill="none">
                    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
                    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
                    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                  </svg>
                  <span>FIGMA PROTOTYPE ↗</span>
                </a>
              )}

              {hasLive && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.headerActionBtn} ${styles.liveSiteBtn}`}
                  title="Visit Live Site"
                >
                  <span>LIVE SITE</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ====================================================================
            HERO HEADER
            ==================================================================== */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroHeader}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} />
                <span>{project.category?.toUpperCase() || 'PRODUCT DESIGN'}</span>
              </div>
              <h1 className={styles.projectTitle}>{project.title}</h1>
              <p className={styles.projectTagline}>{project.tagline}</p>

              {/* Quick Metadata Docket */}
              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>ROLE</span>
                  <span className={styles.metaValue}>{project.role || 'Lead Product Designer'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>TIMELINE</span>
                  <span className={styles.metaValue}>{project.timeline || '12 Weeks'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>YEAR</span>
                  <span className={styles.metaValue}>{project.year || '2024 — 2025'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>PRIMARY DELIVERABLE</span>
                  <span className={styles.metaValue}>UI/UX Design System &amp; Web Platform</span>
                </div>
              </div>

              {/* Tools Used Badges */}
              <div className={styles.toolsChipsContainer}>
                <span className={styles.toolsChipsLabel}>TOOLS USED:</span>
                <div className={styles.toolsChipsList}>
                  {toolsList.map((tool, idx) => (
                    <span key={idx} className={styles.toolChipBadge}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Hero UI Mockup */}
            <div className={styles.heroImageContainer} style={{ marginTop: '32px' }}>
              <div className={styles.mockupBrowserBar}>
                <div className={styles.browserDots}>
                  <span className={styles.dotRed} />
                  <span className={styles.dotYellow} />
                  <span className={styles.dotGreen} />
                </div>
                <span className={styles.browserUrl}>
                  {project.liveLink || 'https://design.production-ui.com'}
                </span>
                <span className={styles.metaLabel} style={{ fontSize: '0.68rem' }}>
                  FINAL UI SHOWCASE
                </span>
              </div>

              <div className={styles.mockupImageWrap}>
                <Image
                  src={encodeURI(project.image || '/portfolio/Neuro Kaizen/mainone.png')}
                  alt={project.title}
                  fill
                  priority
                  className={styles.heroImage}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SIMPLE OVERVIEW & WHAT I DID
            ==================================================================== */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.overviewSplitGrid}>
              
              {/* Left: Simple Description */}
              <div className={styles.overviewCard}>
                <div className={styles.cardDocketHeader}>
                  <span className={styles.docketTag}>[ 01 / ABOUT THE PROJECT ]</span>
                  <span className={styles.metaLabel}>SIMPLE OVERVIEW</span>
                </div>
                <h2 className={styles.cardInnerTitle}>What This Project Is</h2>
                <p className={styles.leadParagraph} style={{ marginBottom: '16px' }}>
                  {descriptionText}
                </p>
                {project.summary && project.summary !== descriptionText && (
                  <p className={styles.bodyParagraph} style={{ color: 'rgba(24, 21, 18, 0.8)' }}>
                    {project.summary}
                  </p>
                )}
              </div>

              {/* Right: Key Highlights / What I Solved */}
              <div className={styles.roleResponsibilitiesCard}>
                <div className={styles.cardDocketHeader}>
                  <span className={styles.docketTag}>[ 02 / WHAT I DESIGNED ]</span>
                  <span className={styles.metaLabel}>KEY WORK</span>
                </div>
                <h2 className={styles.cardInnerTitle}>Key Work &amp; Design Solutions</h2>
                <ul className={styles.objectivesList}>
                  {highlights.map((point, idx) => (
                    <li key={idx} className={styles.objectiveItem}>
                      <CheckCircle2 size={16} className={styles.checkBullet} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================================
            PRODUCT DESIGN SYSTEM: FONT & COLOR DATA
            ==================================================================== */}
        <section className={`${styles.contentSection} ${styles.altBackgroundSection}`}>
          <div className="container">
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>03</span>
              <div>
                <span className={styles.sectionSub}>PRODUCT DESIGN DATA</span>
                <h2 className={styles.sectionTitle}>
                  Colors &amp; Typography (Style Guide)
                </h2>
              </div>
            </div>

            <p className={styles.leadParagraph} style={{ marginBottom: '32px' }}>
              Clean design tokens used across the project to maintain strong visual hierarchy, accessible contrast, and consistent branding.
            </p>

            <div className={styles.designSystemGrid}>
              
              {/* Color Palette Swatches */}
              <div>
                <div className={styles.cardDocketHeader} style={{ marginBottom: '16px' }}>
                  <span className={styles.docketTag}>[ COLOR PALETTE &amp; HEX CODES ]</span>
                  <span className={styles.metaLabel}>WCAG ACCESSIBLE</span>
                </div>

                <div className={styles.swatchesGrid}>
                  {colorsList.map((col, idx) => (
                    <div key={idx} className={styles.colorSwatch}>
                      <div
                        className={styles.swatchColorBox}
                        style={{
                          backgroundColor: col.hex,
                          border: col.hex === '#FFFFFF' || col.hex === '#F7F3EC' ? '1px solid #181512' : 'none'
                        }}
                      />
                      <div className={styles.swatchMeta}>
                        <span className={styles.swatchName}>{col.name}</span>
                        <span className={styles.swatchHex}>{col.hex}</span>
                        <span className={styles.swatchRole}>{col.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography Hierarchy */}
              <div>
                <div className={styles.cardDocketHeader} style={{ marginBottom: '16px' }}>
                  <span className={styles.docketTag}>[ TYPOGRAPHY &amp; FONTS ]</span>
                  <span className={styles.metaLabel}>FONT PAIRING</span>
                </div>

                <div className={styles.typographyGrid}>
                  {typographyList.map((font, idx) => (
                    <div key={idx} className={styles.typoCard}>
                      <span className={styles.typoLabel}>{font.label}</span>
                      <h3 className={styles.typoFamily}>{font.family}</h3>
                      <p className={styles.typoUse}>{font.use}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================================
            SIMPLE TECHNOLOGY STACK
            ==================================================================== */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.sectionHeadingRow}>
              <span className={styles.sectionNumber}>04</span>
              <div>
                <span className={styles.sectionSub}>DEVELOPMENT &amp; TOOLS</span>
                <h2 className={styles.sectionTitle}>
                  Technologies &amp; Code Stack
                </h2>
              </div>
            </div>

            <p className={styles.leadParagraph} style={{ marginBottom: '28px' }}>
              Modern frontend tools used to bring the product design into a fast, pixel-perfect production reality.
            </p>

            <div className={styles.techStackGrid} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {techStack.map((tech, idx) => (
                <div key={idx} className={styles.techCard} style={{
                  padding: '18px 20px',
                  background: 'rgba(24, 21, 18, 0.02)',
                  border: '1px solid rgba(24, 21, 18, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code2 size={16} color="#FF6B35" />
                    <h3 style={{
                      fontFamily: "var(--font-heading), 'Azeret Mono', monospace",
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      margin: 0
                    }}>
                      {tech.name}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    color: 'rgba(24, 21, 18, 0.7)',
                    margin: 0
                  }}>
                    {tech.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SCREENSHOT GALLERY (IF SECONDARY SCREENS EXIST)
            ==================================================================== */}
        {project.secondaryImages && project.secondaryImages.length > 0 && (
          <section className={`${styles.contentSection} ${styles.altBackgroundSection}`}>
            <div className="container">
              <div className={styles.sectionHeadingRow}>
                <span className={styles.sectionNumber}>05</span>
                <div>
                  <span className={styles.sectionSub}>UI SCREENSHOTS</span>
                  <h2 className={styles.sectionTitle}>
                    Key Screens &amp; User Interface
                  </h2>
                </div>
              </div>

              <div className={styles.galleryGrid} style={{ marginTop: '28px' }}>
                {project.secondaryImages.map((imgItem, idx) => (
                  <div key={idx} className={styles.galleryCard}>
                    <div className={styles.galleryImageWrap}>
                      <Image
                        src={encodeURI(imgItem.url)}
                        alt={imgItem.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 600px"
                        className={styles.galleryImage}
                      />
                    </div>
                    <div className={styles.galleryCaptionWrap}>
                      <h4 className={styles.galleryTitle}>{imgItem.title}</h4>
                      <p className={styles.galleryDesc}>{imgItem.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
            BOTTOM ACTIONS & PREV / NEXT PROJECT NAVIGATION
            ==================================================================== */}
        <section className={styles.contentSection} style={{ paddingBottom: '32px' }}>
          <div className="container">
            <div className={styles.actionsFooterRow} style={{ justifyContent: 'center', marginBottom: '40px' }}>
              <Link href="/#projects" className={styles.highlightedBackButton} style={{ fontSize: '0.88rem', padding: '10px 22px' }}>
                ← BACK TO ALL PROJECTS
              </Link>
              {hasFigma && (
                <a
                  href={project.figmaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryCtaBtn}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>OPEN FIGMA PROTOTYPE ↗</span>
                </a>
              )}
              {hasLive && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryCtaBtn}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>VISIT LIVE WEBSITE ↗</span>
                </a>
              )}
            </div>

            {/* Prev & Next Project Nav */}
            <div className={styles.bottomProjectNav}>
              <div className={styles.bottomNavInner}>
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`} className={styles.navProjectLink}>
                    <span className={styles.navDirection}>← PREVIOUS PROJECT</span>
                    <span className={styles.navProjectName}>{prevProject.title}</span>
                  </Link>
                ) : <div />}

                {nextProject && (
                  <Link href={`/projects/${nextProject.slug}`} className={`${styles.navProjectLink} ${styles.navProjectNext}`}>
                    <span className={styles.navDirection}>NEXT PROJECT →</span>
                    <span className={styles.navProjectName}>{nextProject.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
