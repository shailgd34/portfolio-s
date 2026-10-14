'use client';

import {
  Briefcase,
  Layers,
  Users,
  Star,
  Zap,
  Trophy,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Clock,
  Sparkles
} from 'lucide-react';
import Counter from '@/components/Counter/Counter';
import styles from './Experience.module.css';

export default function Experience() {
  const stats = [
    {
      icon: Briefcase,
      value: 6,
      suffix: '+',
      label: 'Years In Industry',
    },
    {
      icon: Layers,
      value: 200,
      suffix: '+',
      label: 'Completed Projects',
    },
    {
      icon: Users,
      value: 50,
      suffix: '+',
      label: 'Worldwide Clients',
    },
    {
      icon: Star,
      value: 100,
      suffix: '%',
      label: 'Quality Commitment',
    },
  ];

  const timelineItems = [
    {
      index: '01',
      period: '2022 — PRESENT',
      role: 'SENIOR PRODUCT DESIGNER & FRONTEND ARCHITECT',
      isPresent: true,
      company: 'Savo Technology Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full Time Employment',
      highlights: [
        'Lead end-to-end design & frontend engineering for venture-backed SaaS, FinTech dashboards, and bespoke digital platforms.',
        'Architect high-performance React and Next.js applications with comprehensive design systems, reducing development time by ~40%.',
        'Direct UX strategy, user journey mapping, and interactive prototyping in Figma through production deployment.'
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'Figma', 'Tailwind/CSS', 'UI/UX Architecture', 'Wordpress', 'Framer', 'GSAP'],
    },
    {
      index: '02',
      period: '2021 — 2022',
      role: 'UI/UX Designer & Web Designer',
      isPresent: true,
      company: 'Votive Technology Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full Time Employment',
      highlights: [
        'Spearheaded user research, interface design, and frontend code delivery for 25+ international enterprise clients.',
        'Engineered complex analytical dashboards, e-commerce platforms, and interactive client portals.',
        'Collaborated with backend engineers to integrate RESTful APIs and ensure pixel-perfect fidelity from Figma designs.'
      ],
      technologies: ['React', 'JavaScript (ES6+)', 'Design Systems', 'WordPress', 'Figma', 'REST APIs'],
    },

    {
      index: '03',
      period: '2020 — 2021',
      role: 'UI/UX Designer',
      isPresent: false,
      company: 'Mind Info Services',
      location: 'Indore, India',
      type: 'Full Time Employment',
      highlights: [
        'Developed foundational expertise in semantic HTML5, modern CSS layouts, and JavaScript DOM manipulation.',
        'Created marketing collateral, interactive web banners, and responsive client microsites.',
        'Established strong coding discipline, browser compatibility testing, and responsive design fundamentals.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Photoshop', 'Visual Design'],
    },
  ];

  const achievements = [
    {
      code: 'REC_01',
      icon: Trophy,
      title: '50+ COMMERCIAL DEPLOYMENTS',
      description: 'Delivered mission-critical digital platforms across FinTech, SaaS, Healthcare, and E-Commerce.',
    },
    {
      code: 'REC_02',
      icon: Users,
      title: 'WORLDWIDE CLIENT TRUST',
      description: 'Successfully partnered with clients and engineering teams across US, Europe, UAE, and APAC.',
    },
    {
      code: 'REC_03',
      icon: Code2,
      title: 'FULL-SPECTRUM MASTERY',
      description: 'Direct continuity from high-fidelity Figma design systems to clean, production-ready React / Next.js code.',
    },
    {
      code: 'REC_04',
      icon: ShieldCheck,
      title: 'TOP-TIER CLIENT SATISFACTION',
      description: '100% on-time milestone delivery record with recurring client partnerships and stellar feedback.',
    },
  ];

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className="container">

        {/* Section Header */}
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <div className={styles.categorySubheading}>
              <span className={styles.subheadingDash}>[ 06 / CAREER CHRONOLOGY ]</span>
              <span className={styles.subheadingText}>• TRACK RECORD & PRODUCTION MILESTONES</span>
            </div>
            <h2 className={styles.sectionTitle}>
              EXPERIENCE &amp;<br />
              <span className={styles.limeHighlight}>CAREER DOSSIER</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              A six-year chronological record of frontend architecture, enterprise product design, and commercial production milestones.
            </p>
          </div>

          {/* Top Right Stats Docket Grid */}
          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className={styles.statBox}>
                  <div className={styles.statTopRow}>
                    <span className={styles.statIndex}>0{idx + 1}</span>
                    <IconComponent size={16} className={styles.statIcon} />
                  </div>
                  <div className={styles.statNumber}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className={styles.contentGrid}>

          {/* Left Column: Editorial Retro Timeline Dossier */}
          <div className={styles.timelineColumn}>
            <div className={styles.timelineWrapper}>

              {timelineItems.map((item, idx) => (
                <article key={idx} className={styles.dossierEntry}>

                  {/* Docket Header Bar */}
                  <div className={styles.dossierHeaderBar}>
                    <div className={styles.dossierMetaLeft}>
                      <span className={styles.dossierTag}>[LOG // {item.index}]</span>
                      <span className={styles.dossierPeriod}>{item.period}</span>
                    </div>

                    <div className={styles.dossierMetaRight}>
                      {item.isPresent ? (
                        <span className={styles.activeStatusPill}>
                          <span className={styles.pulseDot} />
                          ACTIVE CONTRACT
                        </span>
                      ) : (
                        <span className={styles.archivedPill}>COMPLETED</span>
                      )}
                    </div>
                  </div>

                  {/* Main Entry Body */}
                  <div className={styles.dossierBody}>
                    <div className={styles.companyRow}>
                      <span className={styles.companyName}>{item.company}</span>
                      <span className={styles.metaDivider}>•</span>
                      <span className={styles.companyMeta}>{item.location}</span>
                      <span className={styles.metaDivider}>•</span>
                      <span className={styles.typeBadge}>{item.type}</span>
                    </div>

                    <h3 className={styles.roleTitle}>{item.role}</h3>

                    {/* Editorial Highlights */}
                    <ul className={styles.highlightsList}>
                      {item.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className={styles.highlightItem}>
                          <span className={styles.bulletSymbol}>▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Badges Footer */}
                    <div className={styles.techPillList}>
                      <span className={styles.techListPrefix}>CAPABILITIES:</span>
                      {item.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className={styles.techPill}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                </article>
              ))}

            </div>
          </div>

          {/* Right Column: Achievements & Engineering Philosophy */}
          <div className={styles.sidebarColumn}>

            {/* Card 1: Verified Track Record */}
            <div className={styles.achievementsCard}>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderLeft}>
                  <Zap size={18} className={styles.zapIcon} />
                  <h3 className={styles.sidebarTitle}>VERIFIED TRACK RECORD</h3>
                </div>
                <span className={styles.dossierStampSmall}>[AUDIT // 100%]</span>
              </div>

              <div className={styles.achievementsList}>
                {achievements.map((ach, aIdx) => {
                  const AchIcon = ach.icon;
                  return (
                    <div key={aIdx} className={styles.achievementRow}>
                      <div className={styles.achievementCodeCol}>
                        <span className={styles.achievementCode}>{ach.code}</span>
                      </div>
                      <div className={styles.achievementIconCircle}>
                        <AchIcon size={16} className={styles.achievementIcon} />
                      </div>
                      <div className={styles.achievementContent}>
                        <h4 className={styles.achievementTitle}>{ach.title}</h4>
                        <p className={styles.achievementDescription}>{ach.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Operating Doctrine & Engineering Principles (Retro Punchcard Style) */}
            <div className={styles.doctrineCard}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <span className={styles.termDot} />
                  <span className={styles.termDot} />
                  <span className={styles.termDot} />
                </div>
                <span className={styles.terminalTitle}>[ STANDARDS // OPERATING DOCTRINE ]</span>
              </div>

              <div className={styles.doctrineBody}>
                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>01</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>PIXEL FIDELITY &amp; RIGOR</h5>
                    <p className={styles.doctrineDesc}>
                      Zero delta between approved Figma design systems and production code. Every border, typography scale, and micro-interaction is strictly calibrated.
                    </p>
                  </div>
                </div>

                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>02</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>PERFORMANCE BY ARCHITECTURE</h5>
                    <p className={styles.doctrineDesc}>
                      Sub-second load times, lightweight client hydration, accessible semantic markup, and rock-solid SEO structure built into every platform.
                    </p>
                  </div>
                </div>

                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>03</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>COMMERCIAL VALUE DRIVEN</h5>
                    <p className={styles.doctrineDesc}>
                      Design is engineered for tangible conversion and retention. Code is structured cleanly for maintainability and scale over the next 5+ years.
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentic Vintage Stamp */}
              <div className={styles.vintageStamp}>
                <div className={styles.stampBorder}>
                  <div className={styles.stampTopRow}>
                    <Sparkles size={12} className={styles.stampSparkle} />
                    <span>PRODUCTION VERIFIED</span>
                  </div>
                  <span className={styles.stampMain}>SHEELASH S. BHADORIYA</span>
                  <span className={styles.stampSub}>ACTIVE ENGAGEMENTS • 2024–2026</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
