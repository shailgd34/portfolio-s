'use client';

import { useEffect, useRef } from 'react';
import { User, MapPin, Sparkles, TrendingUp, Eye, Clock, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Bento.module.css';

export default function Bento() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gridRef.current.children;
      gsap.fromTo(items,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className={styles.bentoSection} ref={containerRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Profile & Details</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className={styles.grid} ref={gridRef}>
          {/* Cell 1: Bio */}
          <div className={`${styles.item} ${styles.bioCard}`}>
            <div>
              <span className={styles.cardTitle}>
                <User size={16} /> Biography
              </span>
              <p className={styles.bioText}>
                Based in Indore, I design high-growth interfaces for Fintech startups.
              </p>
              <p className={styles.bioSubText}>
                With 5 years of professional experience, I bridge the gap between complex financial systems and intuitive user design. I combine analytical research with frontend coding to deploy layouts that convert.
              </p>
            </div>
          </div>

          {/* Cell 2: Location Map */}
          <div className={`${styles.item} ${styles.mapCard}`}>
            <div>
              <span className={styles.cardTitle}>
                <MapPin size={16} /> Location
              </span>
              <div className={styles.mapVisual}>
                <div className={styles.mapSignal}></div>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}>
                  <path d="M 10 0 V 100 M 30 0 V 100 M 50 0 V 100 M 70 0 V 100 M 90 0 V 100 M 0 10 H 100 M 0 30 H 100 M 0 50 H 100 M 0 70 H 100 M 0 90 H 100" stroke="white" strokeWidth="0.5"/>
                </svg>
              </div>
            </div>
            <div className={styles.mapCoords}>
              <span>INDORE, MP, IND</span>
              <span>22.7196° N, 75.8577° E</span>
            </div>
          </div>

          {/* Cell 3: Traffic Metric */}
          <div className={`${styles.item} ${styles.metricCard}`}>
            <span className={styles.cardTitle}>
              <TrendingUp size={16} /> Traffic Growth
            </span>
            <div className={styles.metricCircle}>
              <span>+40%</span>
            </div>
            <span className={styles.metricDesc}>SAVO TECH PLATFORM REDESIGN</span>
          </div>

          {/* Cell 4: Views Metric */}
          <div className={`${styles.item} ${styles.metricCard}`}>
            <span className={styles.cardTitle}>
              <Eye size={16} /> Page Views
            </span>
            <div className={styles.metricValue}>+60%</div>
            <span className={styles.metricDesc}>PLATFORM INTERACTION METRIC</span>
          </div>

          {/* Cell 5: Session Metric */}
          <div className={`${styles.item} ${styles.metricCard}`}>
            <span className={styles.cardTitle}>
              <Clock size={16} /> Session Time
            </span>
            <div className={styles.metricValue}>+90%</div>
            <span className={styles.metricDesc}>AVERAGE USER ENGAGEMENT</span>
          </div>

          {/* Cell 6: Experience Milestones */}
          <div className={`${styles.item} ${styles.experienceCard}`}>
            <div>
              <span className={styles.cardTitle}>
                <Briefcase size={16} /> Career History
              </span>
              <div className={styles.careerTimeline}>
                <div className={styles.careerItem}>
                  <div className={styles.careerHeader}>
                    <div>
                      <h4 className={styles.careerRole}>Product Designer (UX/UI Lead)</h4>
                      <span className={styles.careerCompany}>Savo Technology Pvt. Ltd.</span>
                    </div>
                    <span className={styles.careerDate}>Nov 2022 - Present</span>
                  </div>
                  <p className={styles.careerDesc}>
                    Led the design overhaul of core systems to recapture market audiences, coordinate between C-suite and frontend teams, and onboard junior UX designers.
                  </p>
                </div>

                <div className={styles.careerItem}>
                  <div className={styles.careerHeader}>
                    <div>
                      <h4 className={styles.careerRole}>Web Designer</h4>
                      <span className={styles.careerCompany}>Votive Technology Pvt. Ltd.</span>
                    </div>
                    <span className={styles.careerDate}>Jun 2021 - Nov 2022</span>
                  </div>
                  <p className={styles.careerDesc}>
                    Drafted user flows, wireframes, and interactive rapid prototypes. Structured visual alignment in cross-functional agile development sprints.
                  </p>
                </div>

                {/* Mind Info Services Internship */}
                <div className={styles.careerItem}>
                  <div className={styles.careerHeader}>
                    <div>
                      <h4 className={styles.careerRole}>Web Designer (Internship)</h4>
                      <span className={styles.careerCompany}>
                        Mind Info Services
                        <a 
                          href="https://mindinfoservices.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.22rem', 
                            marginLeft: '0.6rem', 
                            fontSize: '0.8rem',
                            color: 'var(--accent-secondary)',
                            textDecoration: 'none'
                          }}
                          data-cursor-text="VISIT"
                        >
                          mindinfoservices.com
                        </a>
                      </span>
                    </div>
                    <span className={styles.careerDate}>Nov 2020 - Jun 2021</span>
                  </div>
                  <p className={styles.careerDesc}>
                    Assisted lead designers in drafting visual web layouts and assets using Adobe Photoshop and Illustrator. Coded responsive landing pages using semantic HTML5 and CSS3.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
