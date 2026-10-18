'use client';

import { useState } from 'react';
import styles from './HowIWork.module.css';

export default function HowIWork() {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Discover',
      phase: 'RESEARCH & EMPATHY',
      desc: 'Uncovering behavioral frictions, mental models, and business objectives before designing solutions. Utilizing Hotjar heatmap auditing, stakeholder discovery syncs, and FigJam empathy mapping to identify usability drop-offs.',
      example: 'Project Example: On Neuro Kaizen, discovery audits revealed that 48% of users abandoned cognitive evaluations due to dense text clusters, establishing the need for progressive micro-step assessments.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="35" stroke="var(--accent-secondary)" strokeWidth="1" strokeDasharray="4 4" className={styles.discoverRadar} />
          <circle cx="50" cy="50" r="20" stroke="var(--accent-primary)" strokeWidth="2" className={styles.discoverCore} />
          <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Define',
      phase: 'ARCHITECTURE & STRATEGY',
      desc: 'Synthesizing qualitative and quantitative research into actionable information architecture, user journeys, and jobs-to-be-done (JTBD) in Miro. We establish clear task success criteria, cognitive load thresholds, and content hierarchy.',
      example: 'Project Example: On TugaTrades, we defined high-density cognitive load guidelines for day traders, prioritizing real-time execution clarity and low-latency widget docking over ornamental UI.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="70" height="70" stroke="var(--border-color-active)" strokeWidth="1.5" />
          <g className={styles.researchGlass}>
            <circle cx="40" cy="45" r="12" stroke="var(--accent-secondary)" strokeWidth="2" fill="none" />
            <line x1="48" y1="53" x2="65" y2="70" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <path d="M 25 25 H 75 M 25 75 H 55" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" className={styles.researchLine} />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Design',
      phase: 'SYSTEMS & INTERACTION',
      desc: 'Translating structural flows into low-to-high fidelity interfaces within Figma. Creating scalable atomic design systems, tokenized variables (color, typography, spacing, elevation), interactive micro-prototypes, and responsive layouts.',
      example: 'Project Example: For Fresh Art Club, engineered a 200+ token component library with dark/light themes, WCAG AAA accessibility, and responsive multi-column gallery grids.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="50" r="22" stroke="var(--accent-secondary)" strokeWidth="2" className={styles.designShape1} />
          <circle cx="65" cy="50" r="22" stroke="var(--accent-primary)" strokeWidth="2" className={styles.designShape2} />
          <path d="M 50 15 Q 50 50, 50 85" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="42" y="42" width="16" height="16" stroke="var(--text-primary)" strokeWidth="1.5" transform="rotate(45 50 50)" />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Deliver',
      phase: 'VALIDATION & CODE',
      desc: 'Bridging design into production reality with pixel-perfect frontend engineering in Next.js/React, design tokens, responsive QA, and usability testing validation via Maze and System Usability Scale (SUS) benchmarks.',
      example: 'Project Example: Bridged design tokens directly into production React & Next.js codebases, ensuring zero design drift between Figma prototypes and live browser execution.',
      icon: (
        <svg viewBox="0 0 100 100" className={styles.visualVector} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className={styles.launchRocket}>
            <path d="M 50 15 C 40 25, 40 50, 42 65 C 45 62, 55 62, 58 65 C 60 50, 60 25, 50 15 Z" stroke="var(--accent-secondary)" strokeWidth="2" fill="rgba(0, 240, 255, 0.05)" />
            <path d="M 42 65 C 42 75, 45 80, 50 85 C 55 80, 58 75, 58 65" stroke="var(--accent-primary)" strokeWidth="2" className={styles.launchFlame} />
          </g>
          <line x1="25" y1="85" x2="75" y2="85" stroke="var(--border-color-active)" strokeWidth="1.5" />
          <line x1="50" y1="85" x2="50" y2="92" stroke="var(--accent-primary)" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-i-work" className={styles.howIWorkSection}>
      <div className="container">
        
        {/* Title Info */}
        <div className={styles.header}>
          <div className={styles.categorySubheading}>
            <span className={styles.subheadingDash}>[ 04 / WORKFLOW ]</span>
            <span>• HUMAN-CENTERED PRODUCT DESIGN</span>
          </div>
          <h2 className={styles.sectionTitle}>HOW I WORK</h2>
          <p className={styles.sectionSubtitle}>
            A rigorous 4-stage product design methodology bridging behavioral discovery, information architecture, tokenized design systems, and frontend execution.
          </p>
        </div>

        {/* Dashboard Split View & Mobile Stack */}
        <div className={styles.dashboard}>
          
          {/* Left Panel: Step Selector buttons */}
          <nav className={styles.selectorPane} aria-label="Workflow Steps">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`${styles.selectorItem} ${activeIndex === idx ? styles.selectorItemActive : ''}`}
                aria-label={`View step ${step.title}`}
                aria-selected={activeIndex === idx}
                role="tab"
              >
                <span className={styles.selectorNum}>{step.num}</span>
                <span className={styles.selectorTitle}>{step.title}</span>
              </button>
            ))}
          </nav>

          {/* Right Panel: Step Detail Card */}
          <div className={styles.displayPane} role="tabpanel">
            <div key={activeIndex} className={styles.displayCard}>
              <div className={styles.displayGrid}>
                
                <div className={styles.displayLeft}>
                  <div className={styles.displayTopMeta}>
                    <span className={styles.displayNum}>{steps[activeIndex].num}</span>
                    <span className={styles.phaseTag}>[ {steps[activeIndex].phase} ]</span>
                  </div>
                  <h3 className={styles.displayTitle}>{steps[activeIndex].title}</h3>
                  <p className={styles.displayDesc}>{steps[activeIndex].desc}</p>

                  {steps[activeIndex].example && (
                    <div className={styles.exampleCallout}>
                      <span className={styles.exampleLabel}>APPLIED IN PRODUCTION</span>
                      <p className={styles.exampleText}>{steps[activeIndex].example}</p>
                    </div>
                  )}
                </div>

                <div className={styles.displayRight}>
                  <div className={styles.visualFrame} data-cursor-text={steps[activeIndex].title.toUpperCase()}>
                    {steps[activeIndex].icon}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Mobile Layout: Vertical stacked cards */}
          <div className={styles.mobileStack}>
            {steps.map((step, idx) => (
              <article key={idx} className={styles.mobileCard}>
                <div className={styles.mobileHeader}>
                  <span className={styles.mobileNum}>{step.num}</span>
                  <div>
                    <span className={styles.phaseTag}>[ {step.phase} ]</span>
                    <h3 className={styles.mobileTitle}>{step.title}</h3>
                  </div>
                </div>
                <div className={styles.mobileVisual}>
                  <div className={styles.visualFrame}>
                    {step.icon}
                  </div>
                </div>
                <p className={styles.mobileDesc}>{step.desc}</p>
                {step.example && (
                  <div className={styles.exampleCallout}>
                    <span className={styles.exampleLabel}>APPLIED IN PRODUCTION</span>
                    <p className={styles.exampleText}>{step.example}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
