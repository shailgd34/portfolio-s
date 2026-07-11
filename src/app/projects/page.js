'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Widgets from '@/components/Widgets/Widgets';
import Cursor from '@/components/Cursor/Cursor';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  // Database of all projects from PDF list + existing portfolio projects
  const projectsData = [
    {
      id: 'tugatrades',
      title: 'TugaTrades Platform',
      category: 'fintech',
      desc: 'Fintech trading platform mockups and high-fidelity interactive dashboard ecosystems.',
      role: 'Lead UX/UI Designer',
      timeline: '2024',
      tools: 'Figma, CSS3',
      link: 'https://www.figma.com/proto/hCYQiIZGAEmp46m7nRlyzc/tugatrades-foundation?node-id=5085-2009&starting-point-node-id=5085%3A2009&t=C61Tu6bpa8qkVllI-1',
      color: 'rgba(189, 0, 255, 0.18)',
      image: '/tugatrades.png'
    },
    {
      id: 'equuschain',
      title: 'Equus Chain',
      category: 'web3',
      desc: 'Decentralized liquidity protocols landing page with particle systems and responsive grids.',
      role: 'Frontend Architect',
      timeline: '2023',
      tools: 'HTML, CSS, GSAP',
      link: 'https://equuschain.io/',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/equuschain.png'
    },
    {
      id: 'nzl-app',
      title: 'NZL Application',
      category: 'fintech',
      desc: 'Mobile productivity portal helping users synchronize calendar logs and visual design layouts.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma, React Native',
      link: 'https://nzlapp.com/',
      color: 'rgba(242, 78, 30, 0.18)',
      image: '/nzlmobile.png'
    },
    {
      id: 'crconi-digital',
      title: 'Crconi Digital',
      category: 'creative',
      desc: 'Modern agency landing page with fluid transitions and custom spotlight cursor followers.',
      role: 'Frontend Developer',
      timeline: '2024',
      tools: 'Next.js, GSAP, Tailwind',
      link: 'https://crconidigital.com/',
      color: 'rgba(5, 80, 255, 0.18)',
      image: '/crconidigital.png'
    },
    {
      id: 'neurokaizen',
      title: 'NeuroKaizen Portal',
      category: 'creative',
      desc: 'SaaS cognitive enhancement portal featuring visual metrics and custom client dashboards.',
      role: 'Frontend UI Dev',
      timeline: '2024',
      tools: 'React, Next.js, Tailwind',
      link: 'https://portal.neurokaizen.com/',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/neurokaizen.png'
    },
    {
      id: 'freshartclub',
      title: 'Fresh Art Club',
      category: 'creative',
      desc: 'Premium artistic gallery portal and digital community built for e-commerce design curation.',
      role: 'Web Designer & Dev',
      timeline: '2023',
      tools: 'WordPress, WooCommerce',
      link: 'https://freshartclub.com/',
      color: 'rgba(255, 199, 0, 0.18)',
      image: '/freshartclub.png'
    },
    {
      id: 'entry-website',
      title: 'Entry Website Study',
      category: 'creative',
      desc: 'Minimalist creative website prototype showcasing smooth layout shifts and page entry animations.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/HQoJyqZM3mUcRDUBsayUjW/Entry-website?page-id=0%3A1&type=design&node-id=621-1093&viewport=-1462%2C1304%2C0.11&t=nwPU7KtCyUu0fJ4E-1&scaling=min-zoom&mode=design',
      color: 'rgba(255, 255, 255, 0.15)',
      image: '/crconidigital.png'
    },
    {
      id: 'angel-business',
      title: 'Angel Business Website',
      category: 'creative',
      desc: 'Professional landing page design representing investment portfolios and stakeholder directories.',
      role: 'Web Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/tAxwpXS7Vby4iJcmMrb51P/Business-Angel?type=design&node-id=111-2474&t=vJS3fxaXlXAc4cEN-1&scaling=scale-down&page-id=0%3A1&starting-point-node-id=111%3A2474&mode=design',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/corporate_web_mockup.png'
    },
    {
      id: 'mantis-art',
      title: 'Mantis Art website',
      category: 'creative',
      desc: 'Elegant showcase of digital fine art collections with grid details and artwork filters.',
      role: 'UI Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/file/Nqy54OVKWcx0DZkpqJvHf7/mantis?type=design&node-id=176%3A252&mode=design&t=gbyJrIdqQ2NHAZpk-1',
      color: 'rgba(255, 97, 246, 0.18)',
      image: '/art_gallery_mockup.png'
    },
    {
      id: 'magic-training',
      title: 'Magic Training App',
      category: 'fintech',
      desc: 'Smart mobile app workflow prototype for vehicle driving lessons and digital scheduling.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/eE4Ajty4ZpJb7WlsBgmLl7/Car-lesson?type=design&node-id=22-1796&t=s8yaHwL0dZxLXQlt-1&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=22%3A1796&mode=design',
      color: 'rgba(97, 218, 251, 0.2)',
      image: '/mobile_app_mockup.png'
    },
    {
      id: 'vaulted-art',
      title: 'Vaulted Art Website',
      category: 'creative',
      desc: 'A premium virtual gallery design displaying high-value digital asset portfolios.',
      role: 'Lead UX/UI Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/43nBYn0rFfKIfKnnyPKAIt/Art-vault-journey?type=design&node-id=5-92&t=6VDerSgFZ2G85XQF-1&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=5%3A92&mode=design',
      color: 'rgba(189, 0, 255, 0.18)',
      image: '/art_gallery_mockup.png'
    },
    {
      id: 'tupper-eats',
      title: 'Tupper Eats App',
      category: 'creative',
      desc: 'Vibrant local food marketplace application prototype with ordering menus and delivery mapping.',
      role: 'UX/UI Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/2YbLpC5APVoZRWqYBF8J35/Tuppereat?type=design&node-id=336-1132&t=kaSDkNpRo748AWyt-1&scaling=min-zoom&page-id=201%3A929&starting-point-node-id=336%3A1132&mode=design',
      color: 'rgba(255, 199, 0, 0.18)',
      image: '/food_delivery_mockup.png'
    },
    {
      id: 'slosh-ai',
      title: 'Slosh AI Website',
      category: 'web3',
      desc: 'Interactive platform showcasing automation models, visual grids, and modern developer systems.',
      role: 'Frontend Developer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/V59yvo2k5m81RgkV3FCn3T/AI-web?type=design&node-id=77-2&t=fuNT3r6Muw5d1NQq-1&scaling=scale-down&page-id=0%3A1&mode=design',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/equuschain.png'
    },
    {
      id: 'siza-send',
      title: 'Siza Send App',
      category: 'fintech',
      desc: 'Vibrant and modern multi-currency money transfer application with simple transactional grids.',
      role: 'UI/UX Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/UoS5J0criC99khTkLrLI1X/SIZA-SAND?type=design&node-id=4-62&t=pfj7WUaJun2PvNtc-1&scaling=scale-down&page-id=0%3A1&starting-point-node-id=3%3A3&show-proto-sidebar=1&mode=design',
      color: 'rgba(242, 78, 30, 0.18)',
      image: '/nzlmobile.png'
    },
    {
      id: 'pryo-app',
      title: 'Pryo App Workspace',
      category: 'fintech',
      desc: 'Premium mobile wallet layout showcasing analytics, transaction items, and user settings.',
      role: 'Lead Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/ovh5Wn0cmjFAUOZ5KSxoPC/PRYO-App?type=design&node-id=4-1180&t=mte5qrurvltnWrzE-1&scaling=scale-down&page-id=0%3A1&starting-point-node-id=4%3A1561&show-proto-sidebar=1&mode=design',
      color: 'rgba(97, 218, 251, 0.2)',
      image: '/mobile_app_mockup.png'
    },
    {
      id: 'fast-delivery',
      title: 'Fast Delivery Portal',
      category: 'creative',
      desc: 'Clean logistics dashboard tracking parcels, timelines, shipping routes, and fleet details.',
      role: 'UX/UI Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/file/hRCXJqwfF94rWag2qeCQuW/fast-delivery?type=design&node-id=0%3A1&mode=design&t=6zCQbo1MinKRrdt9-1',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/food_delivery_mockup.png'
    },
    {
      id: 'bnl-app',
      title: 'BNL Mobile Wallet',
      category: 'fintech',
      desc: 'Highly interactive mobile banking interface showing payment logs, graph visualizers, and credit card tiles.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/cP4mNj4NfTGMRGS6VFJtC7/BNL-app?type=design&node-id=4-73&t=z39TmhAFFPVprto1-1&scaling=scale-down&page-id=0%3A1&starting-point-node-id=4%3A83&show-proto-sidebar=1&mode=design',
      color: 'rgba(242, 78, 30, 0.18)',
      image: '/nzlmobile.png'
    },
    {
      id: 'trade-zone',
      title: 'Trade Zone Platform',
      category: 'fintech',
      desc: 'A full-scale trading website mockup highlighting live asset values, stock histories, and user charts.',
      role: 'UX/UI Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/qcIUHHED0cfIFzHY18DJN1/trade-zone?type=design&node-id=72-1042&t=GbrwF4SYvNn5mm8m-1&scaling=scale-down&page-id=0%3A1&starting-point-node-id=45%3A1039&mode=design',
      color: 'rgba(189, 0, 255, 0.18)',
      image: '/tugatrades.png'
    },
    {
      id: 'aldrees-petroleum',
      title: 'Aldrees Petroleum Study',
      category: 'creative',
      desc: 'Premium landing page layouts representing corporate gas distribution networks and fuel stats.',
      role: 'Lead Web Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/file/pOoDn5oaczBk9dAKRtTYcQ/Aldrees?type=design&node-id=0%3A1&mode=design&t=UJF1Gxevfjq7eNLX-1',
      color: 'rgba(255, 154, 0, 0.18)',
      image: '/corporate_web_mockup.png'
    },
    {
      id: 'car-doc',
      title: 'Car Doc Application',
      category: 'creative',
      desc: 'Mobile diagnostic assistant screens tracking vehicle health parameters and mechanics guides.',
      role: 'UI/UX Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/2Ykt29vz3RbqXhW6CbkO4B/Car_doc?page-id=0%3A1&type=design&node-id=76-1874&viewport=536%2C294%2C0.06&t=uc8Hy9ESL6qkN93C-1&scaling=scale-down&mode=design',
      color: 'rgba(97, 218, 251, 0.2)',
      image: '/mobile_app_mockup.png'
    },
    {
      id: 'lani-betting',
      title: 'Lani Betting Tips',
      category: 'fintech',
      desc: 'Clean predictive match calculator screens showcasing win outcomes and statistics dashboard cards.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/8yQuJlcOUbCD23ohUUsfxz/lani-betting-tips?page-id=0%3A1&type=design&node-id=9-322&viewport=691%2C591%2C0.12&t=NH3MS0HjRzONWRA2-1&scaling=scale-down&starting-point-node-id=9%3A343&show-proto-sidebar=1&mode=design',
      color: 'rgba(255, 199, 0, 0.18)',
      image: '/betting_tips_mockup.png'
    },
    {
      id: 'cad-academy',
      title: 'Cad Academy Web',
      category: 'creative',
      desc: 'E-learning platform interface showcasing custom lesson lists, user dashboards, and class progress tiers.',
      role: 'Lead Visual Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/Wx4H44WEvMhQwf3GxNRuQS/cad-Academy?page-id=0%3A1&type=design&node-id=5-69&viewport=287%2C641%2C0.16&t=Iq8uHpylsUR2qoZG-1&scaling=scale-down&starting-point-node-id=1%3A2&mode=design',
      color: 'rgba(0, 240, 255, 0.18)',
      image: '/corporate_web_mockup.png'
    },
    {
      id: 'caters-app',
      title: 'Caters app & web',
      category: 'creative',
      desc: 'Elegant catering reservation portal prototype featuring visual menus and user grids.',
      role: 'UI Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/file/G3n0MPp4BUKqbkfC0bcvHa/caters-app?type=design&node-id=0%3A1&mode=design&t=DwcJEyRXQMhYukx1-1',
      color: 'rgba(255, 97, 246, 0.18)',
      image: '/food_delivery_mockup.png'
    },
    {
      id: 'washen-web',
      title: 'Washen Web Services',
      category: 'creative',
      desc: 'Clean corporate website interface for a laundry provider based in UAE, showing service catalog.',
      role: 'Web Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/file/H3tB8i9sAu3Jr5AYZLFbgw/Washen.ae?type=design&node-id=0%3A1&mode=design&t=vZpxqvcRId0cqFUO-1',
      color: 'rgba(255, 255, 255, 0.18)',
      image: '/corporate_web_mockup.png'
    },
    {
      id: 'ondoepay-web',
      title: 'Ondoepay web Portal',
      category: 'fintech',
      desc: 'Dashboard layouts for a fintech merchant portal showcasing payments, payouts, and billing cards.',
      role: 'UX/UI Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/E0sOAT9gXQH0zczjpucvdk/Ondoepay-website?page-id=0%3A1&type=design&node-id=34-204&viewport=826%2C57%2C0.13&t=uCjBGKgVwG4CNbeh-1&scaling=scale-down&starting-point-node-id=34%3A204&mode=design',
      color: 'rgba(242, 78, 30, 0.18)',
      image: '/nzlmobile.png'
    },
    {
      id: 'matteolm-dating',
      title: 'Matteolm dating app',
      category: 'creative',
      desc: 'Sleek social dating application mockup showing card profiles, messaging layers, and settings grids.',
      role: 'UI/UX Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/file/kFXb06eJHXnongDHtGv3D0/Matteolm-final?type=design&node-id=0%3A1&mode=design&t=GnseS5P3302bbmZm-1',
      color: 'rgba(255, 97, 246, 0.18)',
      image: '/dating_app_mockup.png'
    },
    {
      id: 'speak-easy',
      title: 'Speak Easy Workspace',
      category: 'creative',
      desc: 'Language practice application mockups displaying progress charts, user metrics, and sound waves.',
      role: 'Product Designer',
      timeline: '2024',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/n6dt3xBPK9Eo1e24efs0Tz/Speak-Easy?page-id=0%3A1&type=design&node-id=22-5180&viewport=1085%2C501%2C0.06&t=yR7rflFCy5duQdOB-1&scaling=scale-down&starting-point-node-id=22%3A5150&mode=design',
      color: 'rgba(97, 218, 251, 0.2)',
      image: '/mobile_app_mockup.png'
    },
    {
      id: 'ij-art-bank',
      title: 'IJ Art Bank Portal',
      category: 'creative',
      desc: 'Abstract art bank and digital canvas showcase for digital painters and graphic portfolio collections.',
      role: 'UX/UI Designer',
      timeline: '2023',
      tools: 'Figma',
      link: 'https://www.figma.com/proto/RR6PYwQfDl5qkjL9UlaCJ8/IJArtbank---version-as-of-8-25-23?type=design&node-id=3067-208&t=De2Zf9hN4eJea4qC-1&scaling=min-zoom&page-id=3067%3A2&mode=design',
      color: 'rgba(189, 0, 255, 0.18)',
      image: '/art_gallery_mockup.png'
    }
  ];

  // Set document title on page mount and activate magnetic buttons
  useEffect(() => {
    document.title = 'Projects Archive | Sheelash Singh Bhadoriya';

    const ctx = gsap.context(() => {
      const magneticElements = document.querySelectorAll('.btn, [data-magnetic]');
      magneticElements.forEach((el) => {
        const handleMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
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

  // Filter projects based on selection
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  // GSAP layout animations on grid filter updates
  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.95, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out'
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filter]);

  // Card mouse tilt 3D tracker
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = -(e.clientY - centerY) * 0.06;
    const rotateY = (e.clientX - centerX) * 0.06;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.01,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  return (
    <>
      <Cursor />
      <Navbar theme="dark" toggleTheme={() => {}} activeSection="" />
      
      <main className={styles.archiveWrapper} ref={containerRef}>
        <div className={styles.meshBg}></div>
        
        <div className="container">
          {/* Return Home link */}
          <Link href="/" className={styles.backBtn} data-cursor-text="BACK">
            <ArrowLeft size={16} /> Return to Home
          </Link>

          {/* Header */}
          <header className={styles.headerBlock}>
            <span className={styles.archiveSubtitle}>Portfolio Directory</span>
            <h1 className={styles.archiveTitle}>Selected Works</h1>
            <p className={styles.archiveDesc}>
              A comprehensive archive of {projectsData.length} design interfaces, fintech platforms, Web3 landing grids, and corporate websites built for high-impact startups.
            </p>
          </header>

          {/* Filters pills navigation bar */}
          <nav className={styles.filterBar} aria-label="Project Category Filters">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'fintech', label: 'FinTech' },
              { id: 'web3', label: 'Web3 & AI' },
              { id: 'creative', label: 'Creative & WordPress' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`${styles.filterBtn} ${filter === tab.id ? styles.filterBtnActive : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 3-Column Portfolio grid */}
          <div className={styles.portfolioGrid} ref={gridRef}>
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className={styles.gridItem}>
                <article
                  id={`archive-project-${project.id}`}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={styles.projectCard}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  style={{ '--tech-color': project.color }}
                  data-cursor-text="VIEW"
                >
                  {/* Cover Image background */}
                  {project.image && (
                    <div className={styles.cardBg}>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className={styles.projectImage} 
                      />
                    </div>
                  )}

                  {/* Hover spotlight backdrop */}
                  <div className={styles.cardGlow}></div>

                  <div className={styles.cardTop}>
                    <span className={styles.categoryTag}>{project.category}</span>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDesc}>{project.desc}</p>
                  </div>

                  <div className={styles.cardBottom}>
                    {/* Specifications metadata */}
                    <div className={styles.cardSpecs}>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Role</span>
                        <span className={styles.cardSpecVal}>{project.role}</span>
                      </div>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Tools</span>
                        <span className={styles.cardSpecVal}>{project.tools.split(',')[0]}</span>
                      </div>
                      <div className={styles.cardSpecItem}>
                        <span className={styles.cardSpecLabel}>Year</span>
                        <span className={styles.cardSpecVal}>{project.timeline}</span>
                      </div>
                    </div>

                    {/* Launch Link */}
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.cardLinkBtn}
                      data-cursor-text="LAUNCH"
                    >
                      Explore Project <ExternalLink size={12} />
                    </a>
                  </div>

                </article>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <Widgets />
    </>
  );
}
