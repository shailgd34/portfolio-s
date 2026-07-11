'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import styles from './Experience.module.css';

export default function Experience() {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = listRef.current?.children;
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className={styles.experienceSection} ref={containerRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Timeline</span>
          <h2 className="section-title">Experience & Education</h2>
        </div>

        <div className={styles.experienceGrid}>
          {/* Left Column: Work Experience */}
          <div>
            <h3 className={styles.columnTitle}>Work Experience</h3>
            <div className={styles.timeline} ref={listRef}>
              
              {/* Experience 1 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNode}></div>
                <div className={styles.glassCard}>
                  <div className={styles.timelineHeader}>
                    <div>
                      <h3 className={styles.timelineRole}>Product Designer (UX/UI Lead)</h3>
                      <div className={styles.timelineCompany}>Savo Technology Pvt. Ltd.</div>
                    </div>
                    <span className={styles.timelineDate}>Nov 2022 – Present</span>
                  </div>
                  <div className={styles.timelineBody}>
                    <ul className={styles.timelineList}>
                      <li>Conducted user interviews, surveys, competitive analysis, and market research.</li>
                      <li>Redesigned the product to address the business goal of recapturing the consumer market.</li>
                      <li>Worked directly with executives and higher-level management to produce prototypes, as well as front-end and back-end developers to implement designs.</li>
                      <li>Conveyed user-sentiment and communicated business goals to development teams.</li>
                      <li>Onboarded new UX team members through facilitation of the iterative design and review process and peer-to-peer coaching.</li>
                    </ul>
                    <div className={styles.timelineImpact}>
                      <strong>Impact:</strong> Responsible for designing the look and feel for the updated website which increased the traffic by 40%, page views by 60% and average session time by 90%.
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience 2 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNode}></div>
                <div className={styles.glassCard}>
                  <div className={styles.timelineHeader}>
                    <div>
                      <h3 className={styles.timelineRole}>Web Designer</h3>
                      <div className={styles.timelineCompany}>Votive Technology Pvt. Ltd.</div>
                    </div>
                    <span className={styles.timelineDate}>Jun 2021 – Nov 2022</span>
                  </div>
                  <div className={styles.timelineBody}>
                    <ul className={styles.timelineList}>
                      <li>Worked individually and collaboratively on projects centered around user research, interactive design and rapid prototyping.</li>
                      <li>Produced personas, user flows, journey maps, sketches, wireframes, and prototypes.</li>
                      <li>Managed visual designers to develop high-fidelity concepts.</li>
                      <li>Worked with a team of developers in an Agile environment to bring designs to light.</li>
                    </ul>
                    <div className={styles.timelineImpact} style={{ borderColor: 'var(--accent-primary)', background: 'rgba(5, 80, 255, 0.02)' }}>
                      <strong>Impact:</strong> Created narratives and produced videos to share the product's vision with everyone in the company.
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience 3 */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNode}></div>
                <div className={styles.glassCard}>
                  <div className={styles.timelineHeader}>
                    <div>
                      <h3 className={styles.timelineRole}>Web Designer (Internship)</h3>
                      <div className={styles.timelineCompany}>
                        Mind Info Services 
                        <a 
                          href="https://mindinfoservices.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={styles.timelineLink}
                          data-cursor-text="VISIT"
                        >
                          mindinfoservices.com <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    <span className={styles.timelineDate}>Nov 2020 – Jun 2021</span>
                  </div>
                  <div className={styles.timelineBody}>
                    <ul className={styles.timelineList}>
                      <li>Indore-based Web Design Internship role that served as my career entry milestone.</li>
                      <li>Assisted lead developers in drafting web layouts and assets using Adobe Photoshop and Illustrator.</li>
                      <li>Coded responsive components and custom landing pages using semantic HTML5 and CSS3.</li>
                      <li>Gained foundational workflow knowledge of Agile project sprints and designer-to-developer handoffs.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Education & Languages */}
          <div className={styles.rightColContainer}>
            <div>
              <h3 className={styles.columnTitle}>Education</h3>
              <div className={styles.educationTimeline}>
                
                {/* Edu 1 */}
                <div className={styles.educationCard}>
                  <div className={styles.eduDot}></div>
                  <div className={styles.eduHeader}>
                    <span className={styles.eduDate}>2020</span>
                    <h4 className={styles.eduDegree}>Course in UX Research</h4>
                  </div>
                  <p className={styles.eduSchool}>Educational Platform</p>
                </div>

                {/* Edu 2 */}
                <div className={styles.educationCard}>
                  <div className={styles.eduDot}></div>
                  <div className={styles.eduHeader}>
                    <span className={styles.eduDate}>2014</span>
                    <h4 className={styles.eduDegree}>Diploma In Engineering</h4>
                  </div>
                  <p className={styles.eduSchool}>RGPV University</p>
                </div>

                {/* Edu 3 */}
                <div className={styles.educationCard}>
                  <div className={styles.eduDot}></div>
                  <div className={styles.eduHeader}>
                    <span className={styles.eduDate}>2010 – 2012</span>
                    <h4 className={styles.eduDegree}>Intermediate</h4>
                  </div>
                  <p className={styles.eduSchool}>MP Board</p>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '3.5rem' }}>
              <h3 className={styles.columnTitle}>Languages</h3>
              <div className={styles.languagesCard}>
                <div className={styles.langItem}>
                  <div className={styles.langHeader}>
                    <span className={styles.langName}>English</span>
                    <span className={styles.langDot} style={{ background: 'var(--accent-secondary)' }}></span>
                  </div>
                  <span className={styles.langProficiency}>Professional Proficiency</span>
                </div>
                <div className={styles.langItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div className={styles.langHeader}>
                    <span className={styles.langName}>Hindi</span>
                    <span className={styles.langDot} style={{ background: 'var(--accent-primary)' }}></span>
                  </div>
                  <span className={styles.langProficiency}>Native Speaker</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
