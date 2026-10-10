'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import MegaMenu from '@/components/MegaMenu/MegaMenu';
import styles from './Navbar.module.css';

export default function Navbar({ activeSection = 'hero' }) {
  // isFullMenu is true at top or when scrolling up; false when scrolling down into other sections
  const [isFullMenu, setIsFullMenu] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
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
          <>
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
                    if (window.innerWidth < 1024) {
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

            <a 
              href={isHomePage ? "#contact" : "/#contact"} 
              className={styles.contactPillBtn}
            >
              Contact
            </a>
          </>
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
    </header>
  );
}
