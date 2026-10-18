'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import styles from './MegaMenu.module.css';

export default function MegaMenu({ onClose }) {
  const showcaseProjects = [
    {
      id: 'neuro-kaizen',
      log: 'LOG // 01',
      title: 'Neuro Kaizen SaaS',
      category: 'Bio-Analytics SaaS',
      image: '/portfolio/Neuro Kaizen/mainone.png',
      link: '/projects/neuro-kaizen',
      isExternal: false
    },
    {
      id: '7sens',
      log: 'LOG // 02',
      title: '7Sens Luxury Brand',
      category: 'Creative Agency',
      image: '/portfolio/7Sens/mainone.png',
      link: '/projects/7sens',
      isExternal: false
    },
    {
      id: 'carat-club',
      log: 'LOG // 03',
      title: 'Carat Club 3D Luxury',
      category: 'E-Commerce 3D',
      image: '/portfolio/Carat Club/mainone.png',
      link: '/projects/carat-club',
      isExternal: false
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
            <Link
              key={item.id}
              href={item.link}
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
                <span className={styles.liveTag}>CASE STUDY ↗</span>
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
            </Link>
          ))}

          {/* Eye-Catching Inverted Brutalist Master Directory Card - Links directly to /projects page */}
          <Link
            href="/projects"
            className={styles.seeAllCard}
            onClick={onClose}
          >
            {/* Header Docket Bar */}
            <div className={styles.seeAllTopRow}>
              <span className={styles.seeAllDocketTag}>[ ARCHIVE // 04 ]</span>
              <span className={styles.seeAllStatusPill}>
                <span className={styles.orangePulseDot} />
                <span>50+ WORKS</span>
              </span>
            </div>

            {/* Center Content: Clean Title + Description */}
            <div className={styles.seeAllCenter}>
              <span className={styles.retroRefTag}>DIRECT ACCESS // 2026</span>
              <h5 className={styles.seeAllTitle}>COMPLETE ARCHIVE</h5>
              <p className={styles.seeAllDesc}>
                Enterprise SaaS platforms, FinTech dashboards, mobile apps, and Figma design systems.
              </p>

              {/* Authentic Retro Archival Barcode Accent */}
              <div className={styles.retroBarcodeWrapper} aria-hidden="true">
                <div className={styles.barcodeLines}>
                  {[3, 1, 4, 2, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 3, 2, 5, 1, 4, 2].map((w, i) => (
                    <span key={i} style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className={styles.barcodeText}>CODE: ARCHIVE-50-INDEX</span>
              </div>
            </div>

            {/* High-Impact Retro Action Button */}
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
