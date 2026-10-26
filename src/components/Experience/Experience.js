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
  Sparkles,
  Paperclip,
  Check
} from 'lucide-react';
import Counter from '@/components/Counter/Counter';
import styles from './Experience.module.css';

export default function Experience() {
  const stats = [
    {
      icon: Briefcase,
      value: 6,
      suffix: '+',
      label: 'Years Experience',
    },
    {
      icon: Layers,
      value: 200,
      suffix: '+',
      label: 'Projects Done',
    },
    {
      icon: Users,
      value: 50,
      suffix: '+',
      label: 'Happy Clients',
    },
    {
      icon: Star,
      value: 100,
      suffix: '%',
      label: 'On-Time Delivery',
    },
  ];

  const timelineItems = [
    {
      folderId: 'FILE // 01',
      index: '01',
      period: 'NOV 2022 — OCT 2026',
      role: 'Senior Product Designer / Frontend Developer',
      isPresent: true,
      company: 'Savo Technology Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: '4 enterprise SaaS platforms · 50,000+ users',
      simpleSummary: 'Drove Product Discovery, Interaction Design, and scalable design systems for enterprise SaaS applications.',
      highlights: [
        'Led Product Discovery and Interaction Design for 4 enterprise SaaS platforms, structuring complex Information Architecture and user flows to increase task completion rates by 32% across 50,000+ users.',
        'Architected and scaled a multi-brand Figma design system with 250+ tokens and components, establishing standardized UI patterns across 4 product squads and accelerating sprint delivery velocity by over 40%.',
        'Executed 45+ Usability Research sessions and heuristic audits applying Design Thinking, translating user feedback into interface refinements that reduced workflow drop-off by 28% and cut support tickets by 35%.',
        'Developed responsive, accessible web interfaces adhering strictly to Accessibility (WCAG) standards using React, Next.js, and Redux, cutting design handoff discrepancies and UI defect tickets by 35%.'
      ],
      technologies: ['Product Discovery', 'Figma Design System', 'Information Architecture', 'WCAG Accessibility', 'React', 'Next.js', 'Redux', 'Usability Testing'],
    },
    {
      folderId: 'FILE // 02',
      index: '02',
      period: 'JUN 2021 — NOV 2022',
      role: 'UI/UX & Web Designer',
      isPresent: false,
      company: 'Votive Technologies Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: '18+ international client accounts',
      simpleSummary: 'Delivered Interaction Design, user journeys, wireframes, and clickable interactive prototypes for global SaaS & web apps.',
      highlights: [
        'Delivered Interaction Design, detailed user personas, journey maps, wireframes, and clickable interactive prototypes in Figma for 18+ international client accounts across diverse responsive web and mobile products.',
        'Facilitated Product Discovery workshops and restructured complex Information Architecture, applying Design Thinking principles to streamline onboarding funnels and boost enterprise user retention by 25%.',
        'Partnered closely with cross-functional engineering teams during Agile sprints to deliver pixel-accurate design specifications and token documentation, cutting frontend implementation turnaround by 30%.'
      ],
      technologies: ['Interaction Design', 'User Personas', 'Journey Mapping', 'Figma Prototyping', 'Design Thinking', 'Information Architecture', 'Agile/Scrum'],
    },
    {
      folderId: 'FILE // 03',
      index: '03',
      period: 'JUN 2020 — JUN 2021',
      role: 'Web Design Trainee',
      isPresent: false,
      company: 'Mind Info Services',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: 'Accessibility (WCAG 2.1) & UI standards',
      simpleSummary: 'Built semantic, accessible web layouts, UI prototypes, and standardized component libraries.',
      highlights: [
        'Built semantic, responsive web layouts and interactive UI prototypes using HTML5, CSS3, and JavaScript, collaborating on 12+ client website launches complying with Accessibility (WCAG 2.1) standards.',
        'Standardized reusable UI component libraries, responsive layout grids, and digital asset production guidelines, ensuring seamless cross-browser consistency and accelerating team asset delivery turnaround by 20%.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'WCAG 2.1', 'UI Component Libraries', 'Responsive Layout Grids', 'Cross-Browser Consistency'],
    },
  ];

  const achievements = [
    {
      code: 'POINT_01',
      icon: Trophy,
      title: '50+ LIVE PRODUCTS',
      description: 'Shipped real-world websites, dashboards, and mobile prototypes across SaaS, finance, and shopping.',
    },
    {
      code: 'POINT_02',
      icon: Users,
      title: 'GLOBAL CLIENT WORK',
      description: 'Successfully partnered with startup founders and teams across the US, Europe, UAE, and India.',
    },
    {
      code: 'POINT_03',
      icon: Code2,
      title: 'DESIGN + CODE COMBO',
      description: 'I design the UI in Figma and write the clean frontend code in React & Next.js myself.',
    },
    {
      code: 'POINT_04',
      icon: ShieldCheck,
      title: '100% RELIABLE DELIVERY',
      description: 'Always deliver work on time with clear communication and helpful long-term support.',
    },
  ];

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className="container">

        {/* Section Header */}
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <div className={styles.categorySubheading}>
              <span className={styles.subheadingDash}>[ 06 / WORK EXPERIENCE ]</span>
              <span className={styles.subheadingText}>&bull; 6 YEARS IN TECH &bull; ROLES &amp; MILESTONES</span>
            </div>
            <h2 className={styles.sectionTitle}>
              EXPERIENCE &amp;<br />
              <span className={styles.limeHighlight}>CAREER RECORD</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Over 6 years of designing simple, clean interfaces and building fast websites. From growing startups to global clients, here is what I did and the results I delivered.
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
                <div key={idx} className={styles.dossierFolderWrapper}>
                  {/* File Folder Tab with Paperclip */}
                  <div className={styles.dossierFolderTabRow}>
                    <span className={`${styles.folderTabPill} ${item.isPresent ? styles.folderTabActive : ''}`}>
                      <Paperclip size={12} className={styles.paperclipIcon} />
                      {item.folderId}
                    </span>
                  </div>

                  <article className={styles.dossierEntry}>

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
                            CURRENT ROLE
                          </span>
                        ) : (
                          <span className={styles.archivedPill}>COMPLETED</span>
                        )}
                      </div>
                    </div>

                    {/* Main Entry Body */}
                    <div className={styles.dossierBody}>
                      <div className={styles.dossierTopMetaRow}>
                        <div className={styles.companyRow}>
                          <span className={styles.companyName}>{item.company}</span>
                          <span className={styles.metaDivider}>&bull;</span>
                          <span className={styles.companyMeta}>{item.location}</span>
                          <span className={styles.metaDivider}>&bull;</span>
                          <span className={styles.typeBadge}>{item.type}</span>
                        </div>

                        {/* Taped Quote Note */}
                        <div className={styles.tapedDossierNote}>
                          <div className={styles.dossierNoteTape} />
                          <span>&ldquo;{item.tapedNote}&rdquo;</span>
                        </div>
                      </div>

                      <h3 className={styles.roleTitle}>{item.role}</h3>

                      {/* Plain-English Summary Box */}
                      <p className={styles.roleSimpleSummary}>
                        {item.simpleSummary}
                      </p>

                      {/* Editorial Highlights */}
                      <ul className={styles.highlightsList}>
                        {item.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className={styles.highlightItem}>
                            <span className={styles.bulletSymbol}>&bull;</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Badges Footer */}
                      <div className={styles.techPillList}>
                        <span className={styles.techListPrefix}>SKILLS USED:</span>
                        {item.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className={styles.techPill}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </article>
                </div>
              ))}

              {/* Retro Barcode & Document Verification Strip */}
              <div className={styles.timelineBarcodeStrip}>
                <div className={styles.barcodeLeft}>
                  <span className={styles.barcodeLines}>||||| | |||| || ||| | |||||</span>
                  <span className={styles.barcodeLabel}>DOC ID: SB-CAREER-2026</span>
                </div>
                <div className={styles.verifiedArchiveBadge}>
                  <Check size={13} />
                  <span>ALL RECORDS VERIFIED &bull; 6 YRS ACTIVE</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Achievements & Work Promises */}
          <div className={styles.sidebarColumn}>

            {/* Card 1: What I Bring to the Table */}
            <div className={styles.achievementsCard}>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderLeft}>
                  <Zap size={18} className={styles.zapIcon} />
                  <h3 className={styles.sidebarTitle}>WHAT I BRING TO THE TABLE</h3>
                </div>
                <span className={styles.dossierStampSmall}>[PROVEN RESULTS]</span>
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

            {/* Card 2: My 3 Simple Work Promises (Retro Index Card Style) */}
            <div className={styles.doctrineCard}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <span className={styles.termDot} />
                  <span className={styles.termDot} />
                  <span className={styles.termDot} />
                </div>
                <span className={styles.terminalTitle}>[ WORK ETHIC // MY 3 SIMPLE PROMISES ]</span>
              </div>

              <div className={styles.doctrineBody}>
                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>01</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>EXACT MATCH TO FIGMA</h5>
                    <p className={styles.doctrineDesc}>
                      What you see and approve in Figma is exactly what you get in the live code. Every color, spacing, and font matches 100%.
                    </p>
                  </div>
                </div>

                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>02</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>FAST &amp; MOBILE-FRIENDLY</h5>
                    <p className={styles.doctrineDesc}>
                      I build pages that load fast even on slow connections, work smoothly on all mobile phones, and are easy for search engines to rank.
                    </p>
                  </div>
                </div>

                <div className={styles.doctrineItem}>
                  <span className={styles.doctrineNum}>03</span>
                  <div className={styles.doctrineText}>
                    <h5 className={styles.doctrineHeading}>BUILT TO HELP YOU GROW</h5>
                    <p className={styles.doctrineDesc}>
                      Good design should turn visitors into customers. I write clean, simple code that is easy to update and grow as your business expands.
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentic Vintage Stamp */}
              <div className={styles.vintageStamp}>
                <div className={styles.stampBorder}>
                  <div className={styles.stampTopRow}>
                    <Sparkles size={12} className={styles.stampSparkle} />
                    <span>VERIFIED EXPERIENCE</span>
                  </div>
                  <span className={styles.stampMain}>SHEELASH S. BHADORIYA</span>
                  <span className={styles.stampSub}>AVAILABLE FOR NEW PROJECTS &bull; 2026</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
