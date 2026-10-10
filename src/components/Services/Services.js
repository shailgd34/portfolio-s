'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Services.module.css';

export default function Services() {
  const [openIndex, setOpenIndex] = useState(0);

  const servicesList = [
    {
      num: '1',
      title: 'UI/UX DESIGN',
      desc: 'Creating intuitive user interfaces, scalable design systems, interactive Figma prototypes, and seamless user experiences tuned for modern web & mobile products.'
    },
    {
      num: '2',
      title: 'GRAPHIC DESIGN',
      desc: 'Crafting memorable visual brand assets, digital art direction, vector graphics, typography systems, and high-converting marketing collateral.'
    },
    {
      num: '3',
      title: 'WEB DESIGN',
      desc: 'Designing high-impact, award-worthy web layouts with creative motion animations, clean responsive grids, and human-centered digital experiences.'
    },
    {
      num: '4',
      title: 'BRANDING',
      desc: 'Building complete brand identities, visual language guidelines, logomarks, color palettes, and strategic digital positioning for startups and enterprises.'
    }
  ];

  return (
    <section id="services" className={styles.servicesSection}>
      <div className="container">
        
        {/* Main Grid: Left Accordion Content, Right 3D Workspace Card */}
        <div className={styles.servicesGrid}>
          
          {/* Left Column */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>WHAT I CAN DO FOR YOU</h2>
            
            <p className={styles.sectionSubtitle}>
              As a digital designer, I am a visual storyteller, crafting experiences that connect deeply and spark creativity.
            </p>

            {/* Accordion List */}
            <div className={styles.accordionList}>
              {servicesList.map((service, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <div className={styles.accordionHeader}>
                      <h3 className={styles.itemTitle}>
                        {service.num}. {service.title}
                      </h3>
                      <span className={styles.chevronIcon}>
                        {isOpen ? '⌃' : '⌄'}
                      </span>
                    </div>

                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <p className={styles.itemDesc}>{service.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Rotated Workspace Card */}
          <div className={styles.rightCol}>
            <div className={styles.workspaceCard}>
              <Image
                src="/workspace_mockup.jpg"
                alt="Designer Workspace Setup"
                width={500}
                height={640}
                className={styles.workspaceImg}
              />
              {/* Lime Green Dot Badge */}
              <div className={styles.limeBadgeDot}></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
