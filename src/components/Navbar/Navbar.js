'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import MegaMenu from '@/components/MegaMenu/MegaMenu';
import { LINKEDIN_URL, openLinkedIn } from '@/utils/linkedin';
import styles from './Navbar.module.css';

export default function Navbar({ activeSection = 'hero' }) {
  const [isFullMenu, setIsFullMenu] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const megaMenuTimeout = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (isHomePage) {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.3 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
      }
    } else {
      router.push('/');
    }
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const cleanId = targetId.replace(/^#/, '');

    if (isHomePage) {
      const el = document.getElementById(cleanId);
      if (el) {
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -30, duration: 1.25 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.history.pushState) {
          window.history.pushState(null, '', `#${cleanId}`);
        }
      }
    } else {
      // Client-side SPA navigation without full browser reload
      router.push(`/#${cleanId}`);
    }
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);

      if (currentScrollY <= 80) {
        setIsFullMenu(true);
      } else if (currentScrollY < lastScrollY.current - 4) {
        setIsFullMenu(true);
      } else if (currentScrollY > lastScrollY.current + 4) {
        setIsFullMenu(false);
        setIsMegaMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleProjectsMouseEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleProjectsMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 250);
  };

  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuMouseLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 250);
  };

  return (
    <header className={styles.navHeader}>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${!isFullMenu ? styles.compactNavbar : ''}`}
        onClick={() => {
          if (!isFullMenu) setIsFullMenu(true);
        }}
      >
        {/* Mobile Dedicated Bar (Always visible on screens <= 900px) */}
        <div className={styles.mobileNavRow}>
          <Link href="/" className={styles.mobileBrand} onClick={handleHomeClick}>
            <div className={styles.mobileAvatarWrapper}>
              <Image
                src="/retro_close_portrait.jpg"
                alt="Sheelash Singh Bhadoriya"
                width={32}
                height={32}
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.mobileBrandMeta}>
              <span className={styles.mobileBrandName}>SHEELASH SINGH</span>
              <div className={styles.mobileStatusTag}>
                <span className={styles.orangePulseDot} />
                <span>PRODUCT DESIGNER</span>
              </div>
            </div>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
          </button>
        </div>

        {/* Uncle Joe Top Row: Logo/Name + Live Availability + Location (Desktop) */}
        {isFullMenu && (
          <div className={styles.navTopRow}>
            <div className={styles.logoComponent}>
              <Link href="/" className={styles.brandLogo} onClick={handleHomeClick}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src="/retro_close_portrait.jpg"
                    alt="Sheelash Singh Bhadoriya"
                    width={26}
                    height={26}
                    className={styles.avatarImg}
                  />
                </div>
                <span className={styles.brandNameText}>SHEELASH SINGH BHADORIYA</span>
              </Link>
              <span className={styles.editionBadge}>EST. 2020</span>
            </div>

            <div className={styles.centerStatusBadge}>
              <span className={styles.orangePulseDot} />
              <span className={styles.statusText}>AVAILABLE FOR PROJECTS</span>
            </div>

            <div className={styles.locationText}>
              INDORE, IN • REMOTE WORLDWIDE
            </div>
          </div>
        )}

        {/* Compact Mode Content when Scrolled Down (Desktop Only) */}
        {!isFullMenu && (
          <div className={styles.compactRow}>
            <div className={styles.avatarWrapper}>
              <Image
                src="/retro_close_portrait.jpg"
                alt="Sheelash Singh Bhadoriya"
                width={28}
                height={28}
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.scrolledStatusText}>
              <span className={styles.orangePulseDot} />
              <span>AVAILABLE FOR WORK</span>
            </div>
            <span className={styles.expandPrompt}>[EXPAND MENU ▾]</span>
          </div>
        )}

        {/* Uncle Joe Bottom Segmented Navigation Links (Desktop) */}
        {isFullMenu && (
          <div className={styles.navLinksRow}>
            <Link
              href="/"
              className={`${styles.navCell} ${activeSection === 'hero' && isHomePage ? styles.activeCell : ''}`}
              onClick={handleHomeClick}
            >
              {/* <span className={styles.cellNum}>01</span> */}
              <span>HOME</span>
            </Link>

            <Link
              href="/#what-i-can-do"
              className={`${styles.navCell} ${activeSection === 'what-i-can-do' ? styles.activeCell : ''}`}
              onClick={(e) => handleNavClick(e, 'what-i-can-do')}
            >
              {/* <span className={styles.cellNum}>02</span> */}
              <span>WHAT I DO</span>
            </Link>

            <div
              className={`${styles.navCell} ${styles.projectsCell} ${activeSection === 'projects' || isMegaMenuOpen ? styles.activeCell : ''}`}
              onMouseEnter={handleProjectsMouseEnter}
              onMouseLeave={handleProjectsMouseLeave}
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  e.preventDefault();
                  setIsMegaMenuOpen(prev => !prev);
                }
              }}
            >
              <Link
                href="/#projects"
                className={styles.cellLink}
                onClick={(e) => handleNavClick(e, 'projects')}
              >
                {/* <span className={styles.cellNum}>03</span> */}
                <span>WORK (50+)</span>
                <ChevronDown size={13} className={`${styles.navChevron} ${isMegaMenuOpen ? styles.navChevronActive : ''}`} />
              </Link>
            </div>

            <Link
              href="/#experience"
              className={`${styles.navCell} ${activeSection === 'experience' ? styles.activeCell : ''}`}
              onClick={(e) => handleNavClick(e, 'experience')}
            >
              {/* <span className={styles.cellNum}>04</span> */}
              <span>EXPERIENCE</span>
            </Link>

            <Link
              href="/#technology"
              className={`${styles.navCell} ${activeSection === 'technology' ? styles.activeCell : ''}`}
              onClick={(e) => handleNavClick(e, 'technology')}
            >
              <span className={styles.cellNum}>05</span>
              <span>TECH</span>
            </Link>

            <a
              href="https://wa.me/919516372235"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.navCell} ${styles.contactCell}`}
              aria-label="Contact Sheelash on WhatsApp"
            >
              <span>CONTACT ME</span>
              <ArrowUpRight size={14} className={styles.cellArrow} />
            </a>
          </div>
        )}
      </nav>

      {/* Projects Mega Menu Dropdown */}
      {isFullMenu && isMegaMenuOpen && (
        <div
          className={styles.megaMenuHolder}
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMegaMenuMouseLeave}
        >
          <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawerOverlay} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={styles.mobileDrawer}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.drawerHeader}>
            <div className={styles.drawerBrand}>
              <div className={styles.drawerAvatarWrapper}>
                <Image
                  src="/retro_close_portrait.jpg"
                  alt="Sheelash Singh Bhadoriya"
                  width={34}
                  height={34}
                  className={styles.avatarImg}
                />
              </div>
              <div className={styles.drawerBrandInfo}>
                <span className={styles.drawerName}>SHEELASH S.</span>
                <span className={styles.drawerRole}>PRODUCT DESIGNER</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className={styles.drawerStatusBadge}>
            <span className={styles.orangePulseDot} />
            <span>AVAILABLE FOR WORK • 2026</span>
          </div>

          <nav className={styles.drawerNav}>
            <Link
              href="/"
              className={`${styles.drawerNavLink} ${activeSection === 'hero' ? styles.drawerNavActive : ''}`}
              onClick={handleHomeClick}
            >
              <span className={styles.drawerNavNumber}>01</span>
              <span className={styles.drawerNavLabel}>HOME</span>
            </Link>

            <Link
              href="/#what-i-can-do"
              className={`${styles.drawerNavLink} ${activeSection === 'what-i-can-do' ? styles.drawerNavActive : ''}`}
              onClick={(e) => handleNavClick(e, 'what-i-can-do')}
            >
              <span className={styles.drawerNavNumber}>02</span>
              <span className={styles.drawerNavLabel}>WHAT I DO</span>
            </Link>

            <Link
              href="/#projects"
              className={`${styles.drawerNavLink} ${activeSection === 'projects' ? styles.drawerNavActive : ''}`}
              onClick={(e) => handleNavClick(e, 'projects')}
            >
              <span className={styles.drawerNavNumber}>03</span>
              <span className={styles.drawerNavLabel}>WORK (50+)</span>
            </Link>

            <Link
              href="/#experience"
              className={`${styles.drawerNavLink} ${activeSection === 'experience' ? styles.drawerNavActive : ''}`}
              onClick={(e) => handleNavClick(e, 'experience')}
            >
              <span className={styles.drawerNavNumber}>04</span>
              <span className={styles.drawerNavLabel}>EXPERIENCE</span>
            </Link>

            <Link
              href="/#technology"
              className={`${styles.drawerNavLink} ${activeSection === 'technology' ? styles.drawerNavActive : ''}`}
              onClick={(e) => handleNavClick(e, 'technology')}
            >
              <span className={styles.drawerNavNumber}>05</span>
              <span className={styles.drawerNavLabel}>TECH</span>
            </Link>
          </nav>

          <div className={styles.drawerFooter}>
            <a
              href="https://wa.me/919516372235"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.drawerContactBtn}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>WHATSAPP (+91 95163 72235)</span>
              <ArrowUpRight size={16} />
            </a>

            <div className={styles.drawerMeta}>
              <a href="mailto:shailashs79@gmail.com" className={styles.drawerEmail}>
                shailashs79@gmail.com
              </a>
              <div className={styles.drawerSocials}>
                <a href="https://wa.me/919516372235" target="_blank" rel="noopener noreferrer">WHATSAPP</a>
                <span>•</span>
                <a
                  href={LINKEDIN_URL}
                  onClick={openLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                >
                  LINKEDIN
                </a>
                <span>•</span>
                <a href="https://github.com/shailgd34" target="_blank" rel="noopener noreferrer">GITHUB</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
