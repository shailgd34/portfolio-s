'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import WhatICanDo from '@/components/WhatICanDo/WhatICanDo';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Projects';
import Experience from '@/components/Experience/Experience';
import Skills from '@/components/Skills/Skills';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import ScrollTextEffect from '@/components/ScrollTextEffect/ScrollTextEffect';
import FloatingActions from '@/components/FloatingActions/FloatingActions';

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');

  // Sync theme attribute to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Active section scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'what-i-can-do', 'about', 'projects', 'experience', 'technology', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} activeSection={activeSection} />
      <main>
        <Hero theme={theme} toggleTheme={toggleTheme} />
        <WhatICanDo />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <FloatingActions />
      <ScrollTextEffect />
    </>
  );
}
