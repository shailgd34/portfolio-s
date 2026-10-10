'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './WhatICanDo.module.css';

export default function WhatICanDo() {
  // All accordion items closed by default (null)
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const services = [
    {
      num: '1.',
      title: 'UI/UX DESIGN',
      previewImage: '/uiux.jpg',
      checklist: [
        'User research and persona creation',
        'Wireframing and interactive prototyping',
        'Design systems and UI style guides',
        'Usability testing and feedback analysis'
      ]
    },
    {
      num: '2.',
      title: 'GRAPHIC DESIGN',
      previewImage: '/graphics.jpg',
      checklist: [
        'Logo and brand identity design',
        'Social media graphics and ad creatives',
        'Infographics and data visualization',
        'Custom illustrations and icons'
      ]
    },
    {
      num: '3.',
      title: 'WEB DESIGN',
      previewImage: '/webdesign.jpg',
      checklist: [
        'Responsive web design and layout',
        'Landing page design and optimization',
        'E-commerce website design',
        'CMS integration and theme customization'
      ]
    },
    {
      num: '4.',
      title: 'FRONTEND DEVELOPMENT',
      previewImage: '/frontend.jpg',
      checklist: [
        'React & Next.js web application development',
        'Responsive pixel-perfect HTML/CSS layout',
        'GSAP motion animations & micro-interactions',
        'Performance, SEO & clean code architecture'
      ]
    }
  ];

  return (
    <section id="what-i-can-do" className={styles.section}>
      <div className="container">
        
        {/* Main Section Grid */}
        <div className={styles.sectionGrid}>
          
          {/* Left Column */}
          <div className={styles.leftCol}>
            
            {/* Header Title & Subtitle */}
            <div className={styles.header}>
              <h2 className={styles.sectionTitle}>WHAT I CAN DO FOR YOU</h2>
              <p className={styles.sectionSubtitle}>
                As a digital designer, I am a visual storyteller, crafting experiences that connect deeply and spark creativity.
              </p>
            </div>

            {/* Accordion List - Hover to open, closed by default */}
            <div className={styles.accordionContainer}>
              {services.map((service, index) => {
                const isOpen = activeItemIndex === index;

                return (
                  <div
                    key={index}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}
                    onMouseEnter={() => setActiveItemIndex(index)}
                    onMouseLeave={() => setActiveItemIndex(null)}
                  >
                    {/* Header Row */}
                    <div
                      className={styles.accordionHeader}
                      onClick={() => setActiveItemIndex(isOpen ? null : index)}
                    >
                      <h3 className={styles.itemTitle}>
                        <span className={styles.itemNum}>{service.num}</span> {service.title}
                      </h3>

                      <div className={styles.chevronWrap}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Checklist Body (Appears on Hover) */}
                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <ul className={styles.checklistList}>
                          {service.checklist.map((item, i) => (
                            <li key={i} className={styles.checkItem}>
                              <div className={styles.checkIcon}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* On-Hover Tilted Floating Overlay Image Preview */}
                    {isOpen && (
                      <div className={styles.hoverFloatingThumbnail}>
                        <Image
                          src={service.previewImage}
                          alt={service.title}
                          width={280}
                          height={170}
                          priority
                          className={styles.thumbnailImg}
                        />
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Destination Landing Area for the Scroll-Flipping Hero Card */}
          <div className={styles.rightColTargetArea}>
            <div id="what-i-can-do-card-target" className={styles.cardPlaceholderSpace}>
              {/* Backup workspace card container */}
              <div className={styles.backupCard}>
                <Image
                  src="/workspace_mockup.jpg"
                  alt="Workspace Setup"
                  width={380}
                  height={500}
                  className={styles.backupCardImg}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
