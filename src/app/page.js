'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Bento from '@/components/Bento/Bento';
import HowIWork from '@/components/HowIWork/HowIWork';
import Skills from '@/components/Skills/Skills';
import Projects from '@/components/Projects/Projects';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import Widgets from '@/components/Widgets/Widgets';
import Cursor from '@/components/Cursor/Cursor';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Section observer to highlight active navigation link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'how-i-work', 'skills', 'projects', 'contact'];
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

  // Cinematic reveals and magnetic buttons
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Magnetic hover trigger logic
      const magneticElements = document.querySelectorAll('.btn, [data-magnetic]');
      magneticElements.forEach((el) => {
        const handleMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.35,
            ease: 'power2.out'
          });
        };
        const handleLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
          });
        };
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);
        el._magnetMove = handleMove;
        el._magnetLeave = handleLeave;
      });

      // 2. Cinematic section entry reveals
      const sections = document.querySelectorAll('section:not(#hero):not(#how-i-work)');
      sections.forEach((sec) => {
        gsap.fromTo(sec,
          { opacity: 0, y: 60, scale: 0.98, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    return () => {
      ctx.revert();
      const magneticElements = document.querySelectorAll('.btn, [data-magnetic]');
      magneticElements.forEach((el) => {
        if (el._magnetMove) {
          el.removeEventListener('mousemove', el._magnetMove);
          el.removeEventListener('mouseleave', el._magnetLeave);
        }
      });
    };
  }, []);

  return (
    <>
      <Cursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} activeSection={activeSection} />
      <main>
        <Hero />
        <Bento />
        <HowIWork />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Widgets />
    </>
  );
}
