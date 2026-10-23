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
      period: '2022 — PRESENT',
      role: 'Senior Product Designer & Frontend Developer',
      isPresent: true,
      company: 'Savo Technology Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: 'Lead designer for SaaS & FinTech apps',
      simpleSummary: 'I lead product design and code modern frontends for web apps, SaaS dashboards, and client platforms.',
      highlights: [
        'Lead UI/UX design and write frontend code for web apps, SaaS dashboards, and modern client websites.',
        'Build reusable design systems in Figma and code them in React & Next.js, helping projects launch 40% faster.',
        'Study how real people use our products using heatmaps and user tests to make navigation simple and effortless.',
        'Work closely with company founders and backend engineers from first wireframe to public release.'
      ],
      technologies: ['Figma', 'React', 'Next.js', 'TypeScript', 'CSS3', 'Design Systems', 'User Testing', 'Tailwind'],
    },
    {
      folderId: 'FILE // 02',
      index: '02',
      period: '2021 — 2022',
      role: 'UI/UX Designer & Web Designer',
      isPresent: false,
      company: 'Votive Technology Pvt. Ltd.',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: 'Shipped 25+ global client websites',
      simpleSummary: 'Designed clean interfaces and built frontends for over 25 international business clients.',
      highlights: [
        'Designed and launched modern web interfaces for 25+ international business clients.',
        'Created clean admin dashboards, online shops, and customer portals that are easy to browse.',
        'Talked with real customers to understand their goals and organized complex pages into simple, clear layouts.',
        'Turned Figma mockups into responsive HTML, CSS, and React code that looks sharp on every screen.'
      ],
      technologies: ['Figma', 'JavaScript', 'React', 'WordPress', 'Wireframing', 'Responsive Web', 'REST APIs'],
    },
    {
      folderId: 'FILE // 03',
      index: '03',
      period: '2020 — 2021',
      role: 'Junior UI/UX & Web Designer',
      isPresent: false,
      company: 'Mind Info Services',
      location: 'Indore, India',
      type: 'Full-Time Role',
      tapedNote: 'Strong coding & visual foundation',
      simpleSummary: 'Started my career building mobile-friendly websites, learning core HTML/CSS, and mastering responsive layouts.',
      highlights: [
        'Built fast, mobile-friendly websites with clean semantic HTML5, modern CSS3, and JavaScript.',
        'Designed landing pages, marketing banners, and visual layouts for different devices and screen sizes.',
        'Tested every page across phones, tablets, and desktop browsers to make sure everything works smoothly.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Photoshop', 'Mobile Web', 'Visual Design'],
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
