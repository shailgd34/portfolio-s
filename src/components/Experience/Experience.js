'use client';

import { useState } from 'react';
import { 
  ExternalLink, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  GraduationCap, 
  Globe, 
  ChevronDown, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import Counter from '@/components/Counter/Counter';
import styles from './Experience.module.css';

function formatCounterMetric(val) {
  if (typeof val !== 'string') return val;
  const isPrefixPlus = val.startsWith('+');
  const clean = val.replace(/^\+/, '');
  const isSuffixPlus = clean.endsWith('+');
  const isSuffixPercent = clean.endsWith('%');
  const num = parseInt(clean.replace(/[+%]/g, ''), 10);

  if (isNaN(num)) return val;

  return (
    <Counter 
      end={num} 
      prefix={isPrefixPlus ? '+' : ''} 
      suffix={isSuffixPlus ? '+' : isSuffixPercent ? '%' : ''} 
    />
  );
}

export default function Experience() {
  // Allow interactive expanding/collapsing of career entries (current role open by default)
  const [openItems, setOpenItems] = useState({
    savo: true,
    votive: false,
    mindinfo: false
  });

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const workExperiences = [
    {
      id: 'savo',
      index: '01',
      badge: 'CURRENT LEADERSHIP',
      role: 'Product Designer (UX/UI Lead)',
      company: 'Savo Technology Pvt. Ltd.',
      period: 'Nov 2022 – Present',
      tenure: '2.5+ Years',
      location: 'India',
      active: true,
      summary: 'Directing the product design vision, user research operations, and multi-platform design system architecture across enterprise SaaS platforms and consumer digital portals.',
      contributions: [
        'Spearheaded generative user research sprints, stakeholder workshops, and usability heuristics benchmarking.',
        'Redesigned the end-to-end core SaaS navigation, boosting customer retention and daily active usage.',
        'Partnered directly with executive leadership & engineering teams to ship scalable Next.js and React interfaces.',
        'Created and maintained enterprise design tokens, comprehensive Figma component libraries, and documentation.'
      ],
      metrics: [
        { value: '+40%', label: 'Traffic Increase', detail: 'Organic user acquisition' },
        { value: '+60%', label: 'Page Views', detail: 'Cross-module discovery' },
        { value: '+90%', label: 'Session Duration', detail: 'Deeper user engagement' }
      ],
      skills: ['UX Architecture', 'Design Systems', 'Figma', 'Next.js', 'User Research', 'Rapid Prototyping']
    },
    {
      id: 'votive',
      index: '02',
      badge: 'SENIOR ROLE',
      role: 'Web Designer',
      company: 'Votive Technology Pvt. Ltd.',
      period: 'Jun 2021 – Nov 2022',
      tenure: '1.5 Years',
      location: 'Indore, India',
      active: false,
      summary: 'Orchestrated customer journeys, responsive web applications, and interactive micro-prototypes inside fast-paced Agile sprint teams for multinational client accounts.',
      contributions: [
        'Developed comprehensive user personas, journey architectures, wireframes, and interactive click-through prototypes.',
        'Supervised visual designers to ensure high brand fidelity, conversion-driven landing pages, and typography standards.',
        'Collaborated closely with frontend developers during sprint reviews, ensuring pixel-perfect CSS and layout implementation.',
        'Authored interactive motion prototypes for C-level pitch decks, resulting in immediate product roadmap buy-ins.'
      ],
      metrics: [
        { value: '45+', label: 'Prototypes Delivered', detail: 'High-fidelity Figma flows' },
        { value: '98%', label: 'Client Approvals', detail: 'First-round signoffs' },
        { value: '+35%', label: 'Sprint Velocity', detail: 'Design-to-code speed' }
      ],
      skills: ['Interactive Design', 'Wireframing', 'Visual Systems', 'HTML5 & CSS3', 'Agile Sprints']
    },
    {
      id: 'mindinfo',
      index: '03',
      badge: 'CAREER MILESTONE',
      role: 'Web Designer (Internship)',
      company: 'Mind Info Services',
      companyUrl: 'https://mindinfoservices.com',
      period: 'Nov 2020 – Jun 2021',
      tenure: '8 Months',
      location: 'Indore, India',
      active: false,
      summary: 'Immersive hands-on training ground mastering digital interface engineering, vector graphic systems, and modular semantic web development.',
      contributions: [
        'Designed custom vector iconography, responsive website layouts, and visual banners using Adobe Creative Suite.',
        'Wrote semantic HTML5, CSS3, and JavaScript components with clean cross-browser compatibility.',
        'Established foundational developer-designer handoff pipelines using Git version control and Figma inspection.'
      ],
      metrics: [
        { value: '25+', label: 'Landing Pages', detail: 'High-converting designs' },
        { value: '120+', label: 'Vector Assets', detail: 'Custom illustration library' },
        { value: '100%', label: 'Code Quality', detail: 'Semantic & validated' }
      ],
      skills: ['Photoshop', 'Illustrator', 'Semantic HTML5', 'CSS3 Modules', 'Responsive Layouts']
    }
  ];

  const educationMilestones = [
    {
      year: '2020',
      degree: 'Advanced Course in UX Research',
      institution: 'Specialized Online UX Platform',
      details: 'Cognitive user psychology, heuristic evaluations, usability benchmarking & qualitative testing methodologies.'
    },
    {
      year: '2014',
      degree: 'Diploma in Engineering',
      institution: 'RGPV University',
      details: 'Technical analytical principles, structured system mechanics, mathematical logic & engineering problem solving.'
    },
    {
      year: '2010 – 2012',
      degree: 'Intermediate (Science & Math)',
      institution: 'MP Board',
      details: 'High school graduation with foundational science, calculus, logic & structured computing fundamentals.'
    }
  ];

  const languages = [
    { name: 'English', level: 'Professional Working Proficiency', percent: 90 },
    { name: 'Hindi', level: 'Native / Bilingual Speaker', percent: 100 }
  ];

  const coreStrengths = [
    'Design Systems Architecture',
    'Heuristic UX Evaluations',
    'High-Fidelity Prototyping',
    'Frontend Bridge (Next.js/React)',
    'Data-Informed UX Decisions',
    'Cross-Functional Leadership'
  ];

  return (
    <section id="experience" className={styles.experienceSection}>
      {/* Subtle ambient lighting */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.badgeTag}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>CAREER ARCHITECTURE</span>
            </div>
            <h2 className={styles.sectionTitle}>
              EXPERIENCE & MILESTONES
            </h2>
          </div>
          <p className={styles.sectionSubtitle}>
            A 6+ year creative track record bridging intuitive user experience design with high-performance digital engineering.
          </p>
        </div>

        {/* Top Awwwards Stats Counter Bar */}
        <div className={styles.statsBanner}>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>
              <Counter end={6} suffix="+" padZero />
            </span>
            <span className={styles.statLabel}>Years of Professional Experience</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>
              <Counter end={3} padZero />
            </span>
            <span className={styles.statLabel}>Key Industry Milestones</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>
              <Counter end={40} prefix="+" suffix="%" />
            </span>
            <span className={styles.statLabel}>Proven User Traffic Impact</span>
          </div>
          <div className={styles.statCell}>
            <span className={styles.statNumber}>
              <Counter end={100} suffix="%" />
            </span>
            <span className={styles.statLabel}>Dedication to Pixel Excellence</span>
          </div>
        </div>

        {/* Work Experience: Modern Architectural Interactive Ledger */}
        <div className={styles.experienceLedger}>
          {workExperiences.map((exp) => {
            const isOpen = openItems[exp.id];

            return (
              <div 
                key={exp.id} 
                className={`${styles.ledgerItem} ${isOpen ? styles.ledgerItemOpen : ''}`}
              >
                {/* Clickable Header Row */}
                <button
                  type="button"
                  className={styles.ledgerHeaderBtn}
                  onClick={() => toggleItem(exp.id)}
                  aria-expanded={isOpen}
                  aria-controls={`exp-content-${exp.id}`}
                >
                  {/* Left Column: Number + Role + Company */}
                  <div className={styles.ledgerMainInfo}>
                    <span className={styles.ledgerIndex}>{exp.index}</span>

                    <div className={styles.roleIdentity}>
                      <div className={styles.roleTitleRow}>
                        <h3 className={styles.roleTitle}>{exp.role}</h3>
                        {exp.active && (
                          <span className={styles.activeLivePill}>
                            <span className={styles.livePulseDot} />
                            PRESENT
                          </span>
                        )}
                      </div>

                      <div className={styles.companyMetaRow}>
                        <span className={styles.companyName}>{exp.company}</span>
                        <span className={styles.metaDivider}>•</span>
                        <span className={styles.locationTag}>{exp.location}</span>
                        <span className={styles.metaDivider}>•</span>
                        <span className={styles.periodText}>{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Skills Teaser + Action Toggle Icon */}
                  <div className={styles.ledgerActionGroup}>
                    <div className={styles.skillsTeaserRow}>
                      {exp.skills.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className={styles.teaserSkillPill}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className={`${styles.toggleCircleBtn} ${isOpen ? styles.toggleCircleActive : ''}`}>
                      <ChevronDown size={20} className={styles.chevronIcon} />
                    </div>
                  </div>
                </button>

                {/* Collapsible Detail Drawer */}
                {isOpen && (
                  <div id={`exp-content-${exp.id}`} className={styles.ledgerDrawer}>
                    <div className={styles.drawerGrid}>
                      
                      {/* Left Side: Summary & Key Contributions */}
                      <div className={styles.drawerLeft}>
                        <p className={styles.roleSummary}>{exp.summary}</p>

                        <div className={styles.highlightsBlock}>
                          <h4 className={styles.blockTitle}>Core Contributions & Impact:</h4>
                          <ul className={styles.contributionsList}>
                            {exp.contributions.map((item, cIdx) => (
                              <li key={cIdx} className={styles.contributionItem}>
                                <div className={styles.bulletDot}>✦</div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Complete Skills Badges */}
                        <div className={styles.fullSkillsWrap}>
                          {exp.skills.map((skill, sIdx) => (
                            <span key={sIdx} className={styles.fullSkillBadge}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Impact Metrics & Company Link */}
                      <div className={styles.drawerRight}>
                        <div className={styles.metricsBox}>
                          <div className={styles.metricsHeader}>
                            <TrendingUp size={16} className={styles.metricHeaderIcon} />
                            <span>VERIFIED METRICS</span>
                          </div>

                          <div className={styles.metricsList}>
                            {exp.metrics.map((metric, mIdx) => (
                              <div key={mIdx} className={styles.metricRow}>
                                <div className={styles.metricValueBlock}>
                                  <span className={styles.metricNumber}>{formatCounterMetric(metric.value)}</span>
                                  <span className={styles.metricTitle}>{metric.label}</span>
                                </div>
                                <span className={styles.metricSubdetail}>{metric.detail}</span>
                              </div>
                            ))}
                          </div>

                          {exp.companyUrl && (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.companyPortalBtn}
                            >
                              <span>Visit Organization</span>
                              <ArrowUpRight size={15} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Academics, Certifications & Communication Credentials Bento Grid */}
        <div className={styles.credentialsBento}>
          
          {/* Card 1: Academic Milestones Timeline */}
          <div className={styles.bentoCard}>
            <div className={styles.bentoCardHeader}>
              <div className={styles.bentoIconBox}>
                <GraduationCap size={22} />
              </div>
              <div className={styles.bentoTitleGroup}>
                <h3 className={styles.bentoCardTitle}>ACADEMIC FOUNDATIONS</h3>
                <span className={styles.bentoSubtitle}>Formal Education & Specialized Studies</span>
              </div>
            </div>

            <div className={styles.timelineList}>
              {educationMilestones.map((edu, eIdx) => (
                <div key={eIdx} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>
                    <span className={styles.timelineYearBadge}>{edu.year}</span>
                    <div className={styles.timelineConnectorLine} />
                  </div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.degreeTitle}>{edu.degree}</h4>
                    <span className={styles.institutionName}>{edu.institution}</span>
                    <p className={styles.degreeDetails}>{edu.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Global Communication & Core Strengths */}
          <div className={styles.bentoCard}>
            <div className={styles.bentoCardHeader}>
              <div className={styles.bentoIconBox}>
                <Globe size={22} />
              </div>
              <div className={styles.bentoTitleGroup}>
                <h3 className={styles.bentoCardTitle}>GLOBAL COMMUNICATION</h3>
                <span className={styles.bentoSubtitle}>Languages & Core Professional Competencies</span>
              </div>
            </div>

            {/* Language Meters */}
            <div className={styles.languagesSection}>
              {languages.map((lang, lIdx) => (
                <div key={lIdx} className={styles.langItem}>
                  <div className={styles.langMeta}>
                    <span className={styles.langName}>{lang.name}</span>
                    <span className={styles.langLevel}>{lang.level}</span>
                  </div>
                  <div className={styles.meterTrack}>
                    <div 
                      className={styles.meterFill} 
                      style={{ width: `${lang.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Core Competencies Matrix */}
            <div className={styles.competenciesBlock}>
              <span className={styles.competenciesTitle}>STRATEGIC COMPETENCIES</span>
              <div className={styles.strengthsGrid}>
                {coreStrengths.map((strength, sIdx) => (
                  <div key={sIdx} className={styles.strengthPill}>
                    <span className={styles.greenDot} />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
