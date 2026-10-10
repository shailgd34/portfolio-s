'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Grid } from 'lucide-react';
import Counter from '@/components/Counter/Counter';
import styles from './MegaMenu.module.css';

export default function MegaMenu({ onClose }) {
  const showcaseProjects = [
    {
      id: '7sens',
      title: '7Sens Luxury Brand',
      category: 'Creative Agency',
      image: '/portfolio/7Sens/mainone.png',
      link: 'https://7sens-frontend.vercel.app/',
      isExternal: true
    },
    {
      id: 'carat-club',
      title: 'Carat Club 3D Luxury',
      category: 'E-Commerce',
      image: '/portfolio/Carat Club/mainone.png',
      link: 'https://carat-club.vercel.app/',
      isExternal: true
    },
    {
      id: 'neuro-kaizen',
      title: 'NeuroKaizen AI Portal',
      category: 'AI SaaS',
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
        
        {/* Top Header of Mega Menu */}
        <div className={styles.megaMenuHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.sparkleBadge}>
              <Sparkles size={16} />
            </div>
            <div className={styles.titleColumn}>
              <h4 className={styles.headerTitle}>PROJECTS SHOWCASE</h4>
              <span className={styles.headerSubtitle}>Curated Design & Engineering Case Studies</span>
            </div>
          </div>

          <Link 
            href="/projects" 
            className={styles.viewAllDirectoryLink}
            onClick={onClose}
          >
            <span>View All Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Equal Cards Grid: 3 Showcase Projects + 1 "See All" Equal Card */}
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
              <div className={styles.imageBox}>
                <Image
                  src={encodeURI(item.image)}
                  alt={item.title}
                  fill
                  sizes="240px"
                  className={styles.thumbImg}
                />
                <span className={styles.categoryTag}>{item.category}</span>
              </div>

              <div className={styles.cardContent}>
                <h5 className={styles.cardTitle}>{item.title}</h5>

                <div className={styles.cardFooter}>
                  <span className={styles.viewProjectText}>
                    Launch Project
                  </span>
                  <div className={styles.cardArrowIcon}>
                    ↗
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Equal 4th Card: "SEE ALL PROJECTS" */}
          <Link
            href="/projects"
            className={styles.seeAllCard}
            onClick={onClose}
          >
            <div className={styles.seeAllTopRow}>
              <div className={styles.seeAllCountBadgeGroup}>
                <span className={styles.seeAllCountBadge}>
                  <Counter end={18} suffix="+" />
                </span>
                <span className={styles.seeAllCountLabel}>ALL WORKS</span>
              </div>
              <div className={styles.seeAllIconCircle}>
                <Grid size={16} />
              </div>
            </div>

            <div className={styles.seeAllCenter}>
              <h5 className={styles.seeAllTitle}>ALL PROJECTS</h5>
              <p className={styles.seeAllDesc}>
                Explore full directory of client apps, SaaS platforms & private archive mockups.
              </p>
            </div>

            <div className={styles.seeAllActionPill}>
              <span>All Projects</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
