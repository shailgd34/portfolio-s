'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, X, ArrowUpRight } from 'lucide-react';
import MegaMenu from '@/components/MegaMenu/MegaMenu';
import styles from './Navbar.module.css';

export default function Navbar({ activeSection = 'hero' }) {
  // isFullMenu is true at top or when scrolling up; false when scrolling down into other sections
  const [isFullMenu, setIsFullMenu] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const megaMenuTimeout = useRef(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '';

  const handleHomeClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.history.pushState) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 60);

      if (currentScrollY <= 80) {
        // At top: always show full header with links
        setIsFullMenu(true);
      } else if (currentScrollY < lastScrollY.current - 4) {
        // Scrolling UP in other sections: change from "Available for work" pill to full header with links!
        setIsFullMenu(true);
      } else if (currentScrollY > lastScrollY.current + 4) {
        // Scrolling DOWN into other sections: change to "Available for work" pill!
        setIsFullMenu(false);
        setIsMegaMenuOpen(false); // Close mega menu on scroll down
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scrolling when mobile drawer is open
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

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle Mega Menu Hover with smooth debouncing so user can move into dropdown
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
        {/* Left Avatar Thumbnail */}
        <Link 
          href="/" 
          className={styles.brandLogo} 
          aria-label="Home"
          onClick={handleHomeClick}
        >
          <div className={styles.avatarWrapper}>
            <Image
              src="/Professional Indian Corporate Headshot.png"
              alt="Sheelash Singh Bhadoriya"
              width={36}
              height={36}
              className={styles.avatarImg}
            />
          </div>
        </Link>

        {/* Dynamic Nav: "Available for work" on scroll down, full links on scroll up */}
        {!isFullMenu ? (
          <div className={styles.scrolledStatusText}>
            <span>Available for work</span>
            <span className={styles.greenPulseDot} />
          </div>
        ) : (
          <ul className={styles.navLinks}>
            <li>
              <Link 
                href="/" 
                className={`${styles.navLink} ${activeSection === 'hero' && isHomePage ? styles.active : ''}`}
                onClick={handleHomeClick}
              >
                Home
              </Link>
            </li>
            <li>
              <a 
                href={isHomePage ? "#what-i-can-do" : "/#what-i-can-do"} 
                className={`${styles.navLink} ${activeSection === 'what-i-can-do' ? styles.active : ''}`}
              >
                What I Do
              </a>
            </li>
            <li 
              className={styles.projectsNavItem}
              onMouseEnter={handleProjectsMouseEnter}
              onMouseLeave={handleProjectsMouseLeave}
            >
              <a 
                href={isHomePage ? "#projects" : "/#projects"} 
                className={`${styles.navLink} ${activeSection === 'projects' || isMegaMenuOpen ? styles.active : ''}`}
                onClick={(e) => {
                  // Click toggles mega menu on touch devices
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    e.preventDefault();
                    setIsMegaMenuOpen(prev => !prev);
                  }
                }}
              >
                <span>Projects</span>
                <ChevronDown size={14} className={`${styles.navChevron} ${isMegaMenuOpen ? styles.navChevronActive : ''}`} />
              </a>
            </li>
            <li>
              <a 
                href={isHomePage ? "#experience" : "/#experience"} 
                className={`${styles.navLink} ${activeSection === 'experience' ? styles.active : ''}`}
              >
                Experience
              </a>
            </li>
            <li>
              <a 
                href={isHomePage ? "#technology" : "/#technology"} 
                className={`${styles.navLink} ${activeSection === 'technology' ? styles.active : ''}`}
              >
                Technology
              </a>
            </li>
          </ul>
        )}

        {/* Desktop Contact Pill Button (Hidden on Mobile) */}
        {isFullMenu && (
          <a 
            href={isHomePage ? "#contact" : "/#contact"} 
            className={styles.contactPillBtn}
          >
            Contact
          </a>
        )}

        {/* Modern Mobile Animated Hamburger Button (Shown only on Mobile) */}
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
      </nav>

      {/* Projects Mega Menu Dropdown (Desktop) */}
      {isFullMenu && isMegaMenuOpen && (
        <div
          className={styles.megaMenuHolder}
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMegaMenuMouseLeave}
        >
          <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      )}

      {/* Modern Mobile Navigation Drawer / Overlay */}
      <div 
        className={`${styles.mobileDrawerOverlay} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={styles.mobileDrawer}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerBrand}>
              <div className={styles.drawerAvatarWrapper}>
                <Image
                  src="/Professional Indian Corporate Headshot.png"
                  alt="Sheelash Singh Bhadoriya"
                  width={34}
                  height={34}
                  className={styles.avatarImg}
                />
              </div>
              <div className={styles.drawerBrandInfo}>
                <span className={styles.drawerName}>Shailash S.</span>
                <span className={styles.drawerRole}>Product Designer</span>
              </div>
            </div>

            <button 
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status Badge */}
          <div className={styles.drawerStatusBadge}>
            <span className={styles.greenPulseDot} />
            <span>Available for new projects</span>
          </div>

          {/* Navigation Links */}
          <nav className={styles.drawerNav}>
            <Link 
              href="/"
              className={`${styles.drawerNavLink} ${activeSection === 'hero' && isHomePage ? styles.drawerNavActive : ''}`}
              onClick={(e) => {
                handleHomeClick(e);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className={styles.drawerNavNumber}>01</span>
              <span className={styles.drawerNavLabel}>Home</span>
            </Link>

            <a 
              href={isHomePage ? "#what-i-can-do" : "/#what-i-can-do"}
              className={`${styles.drawerNavLink} ${activeSection === 'what-i-can-do' ? styles.drawerNavActive : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={styles.drawerNavNumber}>02</span>
              <span className={styles.drawerNavLabel}>What I Do</span>
            </a>

            <a 
              href={isHomePage ? "#projects" : "/#projects"}
              className={`${styles.drawerNavLink} ${activeSection === 'projects' ? styles.drawerNavActive : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={styles.drawerNavNumber}>03</span>
              <span className={styles.drawerNavLabel}>Projects</span>
            </a>

            <a 
              href={isHomePage ? "#experience" : "/#experience"}
              className={`${styles.drawerNavLink} ${activeSection === 'experience' ? styles.drawerNavActive : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={styles.drawerNavNumber}>04</span>
              <span className={styles.drawerNavLabel}>Experience</span>
            </a>

            <a 
              href={isHomePage ? "#technology" : "/#technology"}
              className={`${styles.drawerNavLink} ${activeSection === 'technology' ? styles.drawerNavActive : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={styles.drawerNavNumber}>05</span>
              <span className={styles.drawerNavLabel}>Technology</span>
            </a>
          </nav>

          {/* Drawer Footer CTA */}
          <div className={styles.drawerFooter}>
            <a 
              href={isHomePage ? "#contact" : "/#contact"}
              className={styles.drawerContactBtn}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Contact Me</span>
              <ArrowUpRight size={18} />
            </a>

            <div className={styles.drawerMeta}>
              <a href="mailto:shailashs79@gmail.com" className={styles.drawerEmail}>
                shailashs79@gmail.com
              </a>
              <div className={styles.drawerSocials}>
                <a href="https://linkedin.com/in/shailash-bhadoriya" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <span>•</span>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
                <span>•</span>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
