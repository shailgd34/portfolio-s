'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import styles from './MegaMenu.module.css';

export default function MegaMenu({ onClose }) {
  const showcaseProjects = [
    {
      id: '7sens',
      log: 'LOG // 01',
      title: '7Sens Luxury Brand',
      category: 'Creative Agency',
      image: '/portfolio/7Sens/mainone.png',
      link: 'https://7sens-frontend.vercel.app/',
      isExternal: true
    },
    {
      id: 'carat-club',
      log: 'LOG // 02',
      title: 'Carat Club 3D Luxury',
      category: 'E-Commerce 3D',
      image: '/portfolio/Carat Club/mainone.png',
      link: 'https://carat-club.vercel.app/',
      isExternal: true
    },
    {
      id: 'neuro-kaizen',
      log: 'LOG // 03',
      title: 'NeuroKaizen AI Portal',
      category: 'AI SaaS Platform',
      image: '/portfolio/Neuro Kaizen/mainone.png',
      link: 'https://portal.neurokaizen.com/',
      isExternal: true
    }
  ];

  return (
    <div 
      className={styles.megaMenuWrapper}
      role="region"
      aria-label="Projects Mega Menu"
    >
      <div className={styles.megaMenuContainer}>
        
        {/* Editorial Retro Header Docket */}
        <div className={styles.megaMenuHeader}>
          <div className={styles.headerLeftGroup}>
            <div className={styles.headerBadge}>
              <span className={styles.orangePulseDot} />
              <span>[ ARCHIVE CATALOG // SELECT DOSSIERS ]</span>
            </div>
            <div className={styles.headerMetaRow}>
              <span className={styles.headerTitle}>CURATED CASE STUDIES</span>
              <span className={styles.headerDivider}>•</span>
              <span className={styles.headerSubtitle}>ENTERPRISE SAAS, FINTECH & DESIGN SYSTEMS</span>
            </div>
          </div>

          <Link 
            href="/projects" 
            className={styles.viewAllDirectoryLink}
            onClick={onClose}
          >
            <span>OPEN COMPLETE ARCHIVE [50+]</span>
            <ArrowUpRight size={14} className={styles.headerLinkArrow} />
          </Link>
        </div>

        {/* 4 Cards Grid: 3 Editorial Case Studies + 1 Brutalist Archive Ledger */}
        <div className={styles.projectsGrid}>
          {showcaseProjects.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target={item.isExternal ? '_blank' : '_self'}
              rel={item.isExternal ? 'noopener noreferrer' : ''}
              className={styles.projectCard}
              onClick={onClose}
            >
              {/* Card Docket Bar */}
              <div className={styles.cardDocketBar}>
                <span className={styles.cardLogNum}>[{item.log}]</span>
                <span className={styles.categoryPill}>{item.category}</span>
              </div>

              {/* Card Visual Frame with Vintage Scanline */}
              <div className={styles.imageBox}>
                <Image
                  src={encodeURI(item.image)}
                  alt={item.title}
                  fill
                  sizes="260px"
                  className={styles.thumbImg}
                />
                <div className={styles.filmOverlay} />
                <span className={styles.liveTag}>LIVE PROD ↗</span>
              </div>

              {/* Card Content Docket */}
              <div className={styles.cardContent}>
                <h5 className={styles.cardTitle}>{item.title}</h5>

                <div className={styles.cardFooter}>
                  <span className={styles.viewProjectText}>
                    EXPLORE CASE STUDY
                  </span>
                  <div className={styles.cardArrowIcon}>
                    ↗
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Eye-Catching Inverted Brutalist Master Directory Card */}
          <Link
            href="/projects"
            className={styles.seeAllCard}
            onClick={onClose}
          >
            {/* Header Docket Bar */}
            <div className={styles.seeAllTopRow}>
              <span className={styles.seeAllDocketTag}>[ MASTER ARCHIVE ]</span>
              <span className={styles.seeAllStatusPill}>
                <span className={styles.orangePulseDot} />
                <span>50+ ENTRIES</span>
              </span>
            </div>

            {/* Center Content */}
            <div className={styles.seeAllCenter}>
              <div className={styles.seeAllCountRow}>
                <span className={styles.seeAllBigNum}>50</span>
                <span className={styles.seeAllPlus}>+</span>
                <span className={styles.seeAllBadgeTag}>FULL ACCESS</span>
              </div>
              <h5 className={styles.seeAllTitle}>COMPLETE DIRECTORY</h5>
              <p className={styles.seeAllDesc}>
                Enterprise SaaS, FinTech dashboards, mobile apps & Figma design systems.
              </p>

              {/* Editorial Telemetry Micro-List */}
              <div className={styles.seeAllBreakdown}>
                <span className={styles.breakdownItem}>⚡ 24+ SaaS Platforms</span>
                <span className={styles.breakdownItem}>📱 16+ Mobile Apps</span>
                <span className={styles.breakdownItem}>🎨 12+ Figma Systems</span>
              </div>
            </div>

            {/* High-Impact Action Button */}
            <div className={styles.seeAllActionPill}>
              <span>EXPLORE ALL 50+ WORKS</span>
              <ArrowRight size={14} className={styles.actionArrow} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
