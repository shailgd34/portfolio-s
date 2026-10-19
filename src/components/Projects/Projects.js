'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import TechBadge from '@/components/TechBadge/TechBadge';
import styles from './Projects.module.css';

/**
 * 20 Flagship Curated Projects rotating in the top hero showcase
 * with a 10-second smooth sequential auto-cycle (no repeat until full cycle).
 */
const heroCaseStudies = [
  {
    num: '01',
    category: 'SAAS PLATFORM',
    title: 'NEURO KAIZEN™',
    desc: 'AI cognitive assessment platform tracking mental habits and daily productivity.',
    role: 'UX/UI DESIGNER & DEVELOPER',
    techList: ['Figma', 'Next.js', 'React', 'CSS3'],
    badgeText: 'LIVE PLATFORM',
    slug: 'neuro-kaizen',
    image: '/portfolio/Neuro Kaizen/mainone.png',
    tapedQuote: 'Better Decisions. A Healthier You.',
    liveUrl: 'https://portal.neurokaizen.com/',
    isFigma: false,
    etchingType: 'brain',
  },
  {
    num: '02',
    category: 'FINTECH & SAAS',
    title: 'TUGATRADES',
    desc: 'Multi-asset trading platform making investing accessible with live telemetry.',
    role: 'UX/UI DESIGNER & DEVELOPER',
    techList: ['Figma', 'React', 'TypeScript', 'CSS3'],
    badgeText: 'LIVE PRODUCT',
    slug: 'tuga-trades',
    image: '/tugatraders.png',
    tapedQuote: 'Smarter Trading. Brighter Opportunities.',
    liveUrl: 'https://www.figma.com/proto/hCYQiIZGAEmp46m7nRlyzc/tugatrades-foundation?node-id=5085-2009&p=f&viewport=-412%2C208%2C0.02&t=9akSWHKlVZ5Zo9je-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5085%3A2009&show-proto-sidebar=1&page-id=1014%3A2',
    isFigma: false,
    etchingType: 'chart',
  },
  {
    num: '03',
    category: 'ART & MARKETPLACE',
    title: 'FRESH ART CLUB',
    desc: 'Art marketplace connecting collectors and independent creators with global artwork.',
    role: 'UX/UI DESIGNER & DEVELOPER',
    techList: ['WordPress', 'Figma', 'CSS3'],
    badgeText: 'LIVE PRODUCT',
    slug: 'fresh-art-club',
    image: '/portfolio/fresh art club/mainone.png',
    tapedQuote: 'Art Connects People.',
    liveUrl: 'https://freshartclub.com',
    isFigma: false,
    etchingType: 'statue',
  },
  {
    num: '04',
    category: 'DISCOVERY & LUXURY',
    title: 'SEDUCTIVE SEEKER',
    desc: 'Luxury lifestyle discovery app and exclusive membership portal with bespoke curation.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Discovery UI', 'Design Systems', 'Web App'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'seductive-seeker',
    image: '/seductiveOne.png',
    tapedQuote: 'Curated Luxury & Discovery.',
    liveUrl: 'https://www.figma.com/proto/NZc8NlQXXgQpO5VxYs73uN/Seductive-Seeker?node-id=59-1055',
    isFigma: true,
    etchingType: 'paw',
  },
  {
    num: '05',
    category: 'FLEET & ENTERPRISE',
    title: 'GMKC LOGISTICS',
    desc: 'Enterprise fleet dashboard managing 1,200+ domestic freight routes with live telemetry.',
    role: 'LEAD PRODUCT DESIGNER',
    techList: ['Figma', 'Next.js', 'Telemetry', 'TypeScript', 'CSS3'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'gmkc-logistics-website',
    image: '/gmkc.png',
    tapedQuote: 'High-Throughput Fleet Telemetry.',
    liveUrl: 'https://www.figma.com/proto/TGl9atluHX9NJfJE8DrP3M/GMKC-logistic?node-id=32-646',
    isFigma: true,
    etchingType: 'building',
  },
  {
    num: '06',
    category: 'WEB APPLICATION',
    title: 'PETCARE',
    desc: 'Veterinary and pet wellness portal for easy appointment booking and health records.',
    role: 'UX/UI DESIGNER & DEVELOPER',
    techList: ['Figma', 'Mobile UI', 'Discovery UI', 'React'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'petcare-website',
    image: '/petcare.png',
    tapedQuote: 'Happy Pets. Happier People.',
    liveUrl: 'https://www.figma.com/proto/rdlVN0i2cn1WEagwKhowNo/petcare-website?node-id=3-3',
    isFigma: true,
    etchingType: 'paw',
  },
  {
    num: '07',
    category: 'FINE ART & FINTECH',
    title: 'IJ ART BANK',
    desc: 'Fine art investment platform with multi-asset appraisal and provenance verification.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Financial UI', 'Art Investment', 'Design System'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'ij-art-bank',
    image: '/ijart.png',
    tapedQuote: 'High-Net-Worth Art Valuation.',
    liveUrl: 'https://www.figma.com/proto/XMlLSoMBMLj6LAOVFSg3Uc/Ij-art-bank?node-id=1-1227',
    isFigma: true,
    etchingType: 'statue',
  },
  {
    num: '08',
    category: 'MOBILE LOGISTICS',
    title: 'RUNNER',
    desc: 'On-demand urban courier dispatch app with route optimization and live rider tracking.',
    role: 'MOBILE UX/UI ARCHITECT',
    techList: ['Figma', 'Mobile App', 'Logistics UI', 'React Native'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'runner',
    image: '/portfolio/Runner/mainone.png',
    tapedQuote: 'Instant Urban Errand Dispatch.',
    liveUrl: 'https://www.figma.com/proto/q4zxLjSNWo97ulUvFxzJAr/Runner-Project?node-id=2-79055',
    isFigma: true,
    etchingType: 'chart',
  },
  {
    num: '09',
    category: 'COMMUNITY & DEVOTION',
    title: 'SIDDHACHALAM',
    desc: 'Spiritual community portal and event calendar uniting thousands of global devotees.',
    role: 'LEAD UI/UX DESIGNER',
    techList: ['Figma', 'Mobile App', 'Web Design', 'Design Systems'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'siddhachalam-web-app',
    image: '/siddhachalam.png',
    tapedQuote: 'Community Ecosystem & Devotion.',
    liveUrl: 'https://www.figma.com/proto/9sN6eklujFsLmEEdufFlBG/Siddhachalam-App?node-id=0-1',
    isFigma: true,
    etchingType: 'building',
  },
  {
    num: '10',
    category: 'COMMUNITY PORTAL',
    title: 'ACTIVE COMMUNITIES',
    desc: 'Civic engagement network empowering neighborhoods to organize local mutual aid.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Civic Tech', 'Community Portal', 'Design System'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'active-communities',
    image: '/activecommunities.png',
    tapedQuote: 'Connected Neighborhoods.',
    liveUrl: 'https://www.figma.com/proto/9xqemBMObUymVXpNQ5YRKG/Active-communities?node-id=0-1',
    isFigma: true,
    etchingType: 'brain',
  },
  {
    num: '11',
    category: 'PROPTECH & SAAS',
    title: 'ZAWAYA PROPERTY',
    desc: 'Real estate operating system managing 4,800+ Dubai commercial and rental units.',
    role: 'SENIOR PRODUCT DESIGNER',
    techList: ['Figma', 'PropTech UI', 'Dashboard', 'Design System'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'zawaya-property',
    image: '/zawaya.png',
    tapedQuote: 'Commercial Leasing Telemetry.',
    liveUrl: 'https://www.figma.com/proto/ixx6DnvXC9peFOQfS6h8bT/Zawaya-Property-Management?node-id=1-2981',
    isFigma: true,
    etchingType: 'building',
  },
  {
    num: '12',
    category: 'E-COMMERCE & SUPPLY',
    title: 'STOCKMATE',
    desc: 'B2B warehouse platform synchronizing 150,000+ SKUs across retail marketplaces.',
    role: 'LEAD PRODUCT DESIGNER',
    techList: ['Figma', 'Web Design', 'Industrial CMS', 'Data Architecture'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'stockmate-ecommerce-stock',
    image: '/stockmate.png',
    tapedQuote: 'Barcode Optimization Engine.',
    liveUrl: 'https://www.figma.com/proto/8Mikb4NU5QOnXiJaJIJSmG/Stockmate-website?node-id=3-291',
    isFigma: true,
    etchingType: 'chart',
  },
  {
    num: '13',
    category: 'CREATIVE & LUXURY',
    title: '7SENS AGENCY',
    desc: 'Futuristic digital showcase for a Parisian luxury branding atelier and agency.',
    role: 'UX/UI DESIGNER & DEVELOPER',
    techList: ['React', 'Next.js', 'Vercel', 'Figma', 'GSAP'],
    badgeText: 'LIVE PLATFORM',
    slug: '7sens',
    image: '/portfolio/7Sens/mainone.png',
    tapedQuote: 'Parisian Sensory Luxury.',
    liveUrl: 'https://7sens-frontend.vercel.app/',
    isFigma: false,
    etchingType: 'statue',
  },
  {
    num: '14',
    category: 'PHOTO SHARING & MEDIA',
    title: 'IPIXIT APP',
    desc: 'High-resolution photo sharing community and professional creator portfolio engine.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Adobe CC', 'Media UI', 'Prototyping'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'ipixit-photo-sharing-app',
    image: '/ipixitapp.png',
    tapedQuote: 'Visual Storytelling Platform.',
    liveUrl: 'https://www.figma.com/proto/NJvBaf5NvsDpUsefVO0pEK/Ipixit-V2?node-id=2248-8913',
    isFigma: true,
    etchingType: 'brain',
  },
  {
    num: '15',
    category: 'FINTECH & REMITTANCE',
    title: 'SIZA SEND APP',
    desc: 'Cross-border peer-to-peer mobile remittance and multi-currency digital wallet app.',
    role: 'MOBILE UI/UX DESIGNER',
    techList: ['Figma', 'Mobile Payment', 'FinTech UI', 'Security UX'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'siza-send',
    image: '/sizasend.png',
    tapedQuote: 'Cross-Border Remittance.',
    liveUrl: 'https://www.figma.com/proto/UoS5J0criC99khTkLrLI1X/SIZA-SAND?node-id=41-1331',
    isFigma: true,
    etchingType: 'chart',
  },
  {
    num: '16',
    category: 'FINTECH & SAAS',
    title: 'FINANCE APP',
    desc: 'SaaS wealth governance dashboard unifying cash-flow projections and expense tracking.',
    role: 'FIGMA WEB DESIGNER',
    techList: ['Figma', 'FinTech UI', 'Dashboard', 'Analytics'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'useful-finance-management-saas-platform',
    image: '/finapp.png',
    tapedQuote: 'Precision Wealth Dashboard.',
    liveUrl: 'http://figma.com/proto/c7ObeDfrIpjzCUS501Ay4d/finance-web-project?node-id=1-6249',
    isFigma: true,
    etchingType: 'chart',
  },
  {
    num: '17',
    category: 'RENTAL & UTILITY',
    title: 'KIRO APP',
    desc: 'Utility equipment and fleet rental booking mobile platform with digital keys.',
    role: 'MOBILE UI/UX DESIGNER',
    techList: ['Figma', 'Mobile UI', 'Fleet Booking', 'Prototyping'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'kiro-app',
    image: '/kiroapp.png',
    tapedQuote: 'Smart Vehicle Reservations.',
    liveUrl: 'https://www.figma.com/proto/rhVqziKU9O9pz4h08aDJhi/Kiro-App?node-id=6-26',
    isFigma: true,
    etchingType: 'building',
  },
  {
    num: '18',
    category: 'LOGISTICS & FLEET',
    title: 'FAST DELIVERY',
    desc: 'Last-mile logistics dispatch engine with waypoint route optimization and scanning.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Logistics', 'Web UI', 'Prototyping'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'fast-delivery',
    image: '/fastdelivery.png',
    tapedQuote: 'On-Demand Route Optimization.',
    liveUrl: 'https://www.figma.com/proto/hRCXJqwfF94rWag2qeCQuW/fast-delivery?node-id=8-15',
    isFigma: true,
    etchingType: 'building',
  },
  {
    num: '19',
    category: 'SOCIAL & MOBILE',
    title: 'MATTEOLM DATING',
    desc: 'Intentional relationship mobile app pairing matchmaking algorithms with verified IDs.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Social App UI', 'Mobile UX', 'Micro-interactions'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'matteolm-dating',
    image: '/matteolm.png',
    tapedQuote: 'Intentional Social Matching.',
    liveUrl: 'https://www.figma.com/proto/kFXb06eJHXnongDHtGv3D0/Matteolm-final?node-id=1-5332',
    isFigma: true,
    etchingType: 'paw',
  },
  {
    num: '20',
    category: 'FINTECH TRADING',
    title: 'TRADE ZONE WEB',
    desc: 'Browser trading terminal delivering real-time market depth and rapid order routing.',
    role: 'UX/UI DESIGNER',
    techList: ['Figma', 'Trading Desk', 'Data Architecture', 'Responsive UI'],
    badgeText: 'FIGMA PROTOTYPE',
    slug: 'trade-zone-web',
    image: '/tradezoneweb.png',
    tapedQuote: 'High-Frequency Trading Desk.',
    liveUrl: 'https://www.figma.com/proto/qcIUHHED0cfIFzHY18DJN1/trade-zone?node-id=567-5774',
    isFigma: true,
    etchingType: 'chart',
  },
];

export default function Projects() {
  const [batchIndex, setBatchIndex] = useState(0); // 0 to 4 (5 batches, 4 projects each = 20 total)
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const TOTAL_BATCHES = 5; // 20 projects / 4 per batch = 5 batches

  // Auto-cycle the 5 batches (4 projects at a time) every 10 seconds without repeat
  useEffect(() => {
    if (isHeroPaused) return;

    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % TOTAL_BATCHES);
        setIsFading(false);
      }, 300);
    }, 10000);

    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const handlePrevBatch = () => {
    setIsFading(true);
    setTimeout(() => {
      setBatchIndex((prev) => (prev === 0 ? TOTAL_BATCHES - 1 : prev - 1));
      setIsFading(false);
    }, 200);
  };

  const handleNextBatch = () => {
    setIsFading(true);
    setTimeout(() => {
      setBatchIndex((prev) => (prev + 1) % TOTAL_BATCHES);
      setIsFading(false);
    }, 200);
  };

  // 1 top hero project + 3 bottom cards for active batch (1+3 = 4 projects)
  const currentHero = heroCaseStudies[batchIndex * 4];
  const currentBottomCards = heroCaseStudies.slice(batchIndex * 4 + 1, batchIndex * 4 + 4);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">

        {/* ====================================================================
            RETRO NEWSPAPER BROADSHEET CONTAINER
            Framed with authentic ink black borders, corner registration marks,
            and vintage newspaper running masthead.
            ==================================================================== */}
        <div className={styles.newspaperBroadsheet}>

          {/* Corner Registration Crosshairs */}
          <span className={`${styles.cornerCross} ${styles.cornerTL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.cornerTR}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.cornerBL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.cornerBR}`}>+</span>

          {/* Running Masthead */}
          <header className={styles.newspaperRunningHeader}>
            <span className={styles.runningHeaderLeft}>PORTFOLIO ARCHIVE</span>
            <span className={styles.runningHeaderCenter}>
              PRODUCT DESIGN &times; UX ARCHITECTURE &times; FRONTEND SYSTEMS
            </span>
            <span className={styles.runningHeaderRight}>EST. 2024&ndash;2026</span>
          </header>

          <div className={styles.newspaperRuleDouble} />

          {/* ==================================================================
              TOP ROW (2 COLUMNS): LEFT SIDE TEXT + RIGHT SIDE HERO PROJECT
              1 Top Project with Bottom Overlay Text (No Description)
              ================================================================== */}
          <div className={styles.editorialTopGrid}>

            {/* LEFT SIDE: SELECTED WORK EDITORIAL TEXT */}
            <div className={styles.selectedWorkCol}>
              <div className={styles.selectedWorkTitleGroup}>
                <h3 className={styles.selectedWorkDisplayTitle}>
                  <span>SELECTED</span>
                  <span>WORK</span>
                </h3>
                <div className={styles.selectedWorkOrangeSlash} />
              </div>

              <div className={styles.selectedWorkManifesto}>
                <h4 className={styles.selectedWorkSubhead}>
                  DIGITAL PRODUCTS &bull; REAL PROBLEMS &bull; MEANINGFUL SOLUTIONS.
                </h4>
                <p className={styles.selectedWorkParagraph}>
                  A collection of product design projects I&apos;ve worked on &mdash; from SaaS platforms to marketplaces. Each project solves a real user need with thoughtful design.
                </p>
              </div>

              <div className={styles.selectedWorkStampBox}>
                <div className={styles.wireframeGlobeStamp}>
                  <svg className={styles.wireframeSphereSvg} viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="46" stroke="#181512" strokeWidth="2.5" />
                    <ellipse cx="50" cy="50" rx="46" ry="20" stroke="#181512" strokeWidth="1.8" />
                    <ellipse cx="50" cy="50" rx="20" ry="46" stroke="#181512" strokeWidth="1.8" />
                    <line x1="4" y1="50" x2="96" y2="50" stroke="#181512" strokeWidth="1.8" />
                    <line x1="50" y1="4" x2="50" y2="96" stroke="#181512" strokeWidth="1.8" />
                  </svg>
                </div>
                <div className={styles.rubberStampImpact}>
                  <span>GOOD DESIGN CREATES REAL IMPACT.</span>
                </div>
              </div>

              {/* Button linking to all projects repository */}
              <Link href="/projects" className={styles.selectedWorkAllProjectsBtn}>
                <span>VIEW ALL PROJECTS</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* RIGHT SIDE: 1 PROJECT WITH BOTTOM OVERLAY TEXT */}
            <div
              className={styles.featuredHeroCol}
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
            >
              <article className={styles.featuredHeroCard}>

                {/* Header Docket with [ 01 / 20 ] and 10s Timer */}
                <div className={styles.featuredHeroHeader}>
                  <Link
                    href={`/projects/${currentHero.slug}`}
                    className={styles.heroDocketPill}
                    aria-label={`Open case study for ${currentHero.title}`}
                  >
                    <span className={styles.heroDocketNumber}>[ {currentHero.num} / 20 ]</span>
                    <span className={styles.heroDocketLabel}>FEATURED CASE STUDY</span>
                  </Link>

                  {/* Tactile 10s Carousel Batch Controls & Counter */}
                  <div className={styles.heroCarouselControls}>
                    <button
                      type="button"
                      onClick={handlePrevBatch}
                      className={styles.heroNavBtn}
                      aria-label="Previous Project Set"
                      title="Previous project set"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <span className={styles.heroPagingCounter}>SET {batchIndex + 1} OF 5</span>

                    <button
                      type="button"
                      onClick={handleNextBatch}
                      className={styles.heroNavBtn}
                      aria-label="Next Project Set"
                      title="Next project set"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <span className={styles.heroCategoryTag}>{currentHero.category}</span>

                  {/* 10-Second Timer Track and Animated Countdown Bar */}
                  <div className={styles.heroTimerTrack}>
                    <div
                      key={batchIndex}
                      className={`${styles.heroTimerBar} ${isHeroPaused ? styles.heroTimerPaused : ''}`}
                    />
                  </div>
                </div>

                {/* Full-Bleed Image Frame with Bottom Overlay (NO DESCRIPTION) */}
                <div className={styles.heroFullBleedFrame}>
                  <Link
                    href={`/projects/${currentHero.slug}`}
                    className={styles.heroImgBackdropLink}
                    aria-label={`Open case study for ${currentHero.title}`}
                  >
                    <div className={styles.heroImgBackdrop}>
                      <Image
                        key={currentHero.image}
                        src={currentHero.image}
                        alt={`${currentHero.title} Platform Preview`}
                        fill
                        priority
                        sizes="(max-width: 1280px) 100vw, 850px"
                        className={`${styles.heroFullImg} ${isFading ? styles.heroImgFading : ''}`}
                      />
                    </div>
                  </Link>

                  {/* Taped Quote Note (Pinned at Top-Left) */}
                  <Link
                    href={`/projects/${currentHero.slug}`}
                    className={styles.tapedPaperScrapQuote}
                    aria-label={`View ${currentHero.title} case study`}
                  >
                    <div className={styles.paperTapeTop} />
                    <p className={styles.quoteText}>
                      &ldquo;{currentHero.tapedQuote}&rdquo;
                    </p>
                  </Link>

                  {/* Dynamic Decorative Etching SVG in corner */}
                  <div className={styles.heroEtchingDeco} aria-hidden="true">
                    {currentHero.etchingType === 'brain' && (
                      <svg className={styles.etchingSvg} viewBox="0 0 100 100" fill="none">
                        <path d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C52 85 54 84 55 82 C55 80 54 78 54 75 C54 65 65 60 70 60 C80 60 85 55 85 45 C85 28 70 15 50 15 Z" stroke="#FF6B35" strokeWidth="1.8" strokeDasharray="3 2" />
                        <path d="M35 35 Q45 25 55 35 T75 35" stroke="#FF6B35" strokeWidth="1.4" />
                        <path d="M25 50 Q40 40 50 52 T75 48" stroke="#FF6B35" strokeWidth="1.4" />
                        <path d="M30 65 Q45 55 58 68 T70 65" stroke="#FF6B35" strokeWidth="1.4" />
                      </svg>
                    )}
                    {currentHero.etchingType === 'chart' && (
                      <svg className={styles.etchingSvg} viewBox="0 0 100 100" fill="none">
                        <line x1="10" y1="85" x2="90" y2="85" stroke="#FF6B35" strokeWidth="2" />
                        <line x1="10" y1="15" x2="10" y2="85" stroke="#FF6B35" strokeWidth="2" />
                        <rect x="22" y="45" width="8" height="30" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="26" y1="35" x2="26" y2="80" stroke="#FF6B35" strokeWidth="1.5" />
                        <rect x="42" y="30" width="8" height="35" fill="#FF6B35" fillOpacity="0.3" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="46" y1="20" x2="46" y2="70" stroke="#FF6B35" strokeWidth="1.5" />
                        <rect x="62" y="20" width="8" height="40" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="66" y1="10" x2="66" y2="75" stroke="#FF6B35" strokeWidth="1.5" />
                        <path d="M12 70 L30 50 L50 60 L75 25 L88 35" stroke="#FF6B35" strokeWidth="2" strokeDasharray="3 2" />
                      </svg>
                    )}
                    {currentHero.etchingType === 'statue' && (
                      <svg className={styles.etchingSvg} viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="35" r="20" stroke="#FF6B35" strokeWidth="1.8" strokeDasharray="4 2" />
                        <path d="M35 30 Q50 20 65 30" stroke="#FF6B35" strokeWidth="1.5" />
                        <path d="M42 38 Q50 38 52 45" stroke="#FF6B35" strokeWidth="1.5" />
                        <path d="M45 49 Q50 51 55 49" stroke="#FF6B35" strokeWidth="1.5" />
                        <path d="M28 65 C28 55 38 52 50 52 C62 52 72 55 72 65 L78 90 H22 Z" stroke="#FF6B35" strokeWidth="1.8" />
                      </svg>
                    )}
                    {currentHero.etchingType === 'building' && (
                      <svg className={styles.etchingSvg} viewBox="0 0 80 80" fill="none">
                        <polygon points="40,10 10,30 70,30" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="16" y1="30" x2="16" y2="70" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="32" y1="30" x2="32" y2="70" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="48" y1="30" x2="48" y2="70" stroke="#FF6B35" strokeWidth="1.5" />
                        <line x1="64" y1="30" x2="64" y2="70" stroke="#FF6B35" strokeWidth="1.5" />
                        <rect x="8" y="70" width="64" height="6" stroke="#FF6B35" strokeWidth="1.5" />
                      </svg>
                    )}
                    {currentHero.etchingType === 'paw' && (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="#FF6B35">
                        <circle cx="8" cy="7" r="2" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="5" cy="12" r="1.8" />
                        <circle cx="19" cy="12" r="1.8" />
                        <path d="M12 11 C9 11 7 13 8 16 C9 18 11 19 12 19 C13 19 15 18 16 16 C17 13 15 11 12 11 Z" />
                      </svg>
                    )}
                  </div>

                  {/* TEXT ON OVERLAY ON IMAGE BOTTOM SIDE (NO DESCRIPTION AS REQUESTED) */}
                  <div className={`${styles.heroBottomOverlay} ${isFading ? styles.heroOverlayFading : ''}`}>
                    <div className={styles.heroOverlayLeft}>
                      <div className={styles.heroRoleLabel}>{currentHero.role}</div>
                      <Link href={`/projects/${currentHero.slug}`} className={styles.heroProjectNameLink}>
                        <h3 className={styles.heroProjectName}>{currentHero.title}</h3>
                      </Link>
                      <div className={styles.heroTechRow}>
                        {currentHero.techList.map((tag, tIdx) => (
                          <TechBadge key={tIdx} name={tag} />
                        ))}
                      </div>
                    </div>

                    <div className={styles.heroOverlayRight}>
                      <div className={styles.heroLivePlate}>
                        [ &#8599; {currentHero.badgeText} ]
                      </div>
                      <div className={styles.heroActionBtnsRow}>
                        <Link href={`/projects/${currentHero.slug}`} className={styles.primaryActionBtn}>
                          <span>EXPLORE CASE STUDY</span>
                          <ArrowRight size={13} />
                        </Link>
                        {currentHero.liveUrl && (
                          <a
                            href={currentHero.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.secondaryActionBtn}
                          >
                            <span>{currentHero.isFigma ? 'FIGMA \u2197' : 'LIVE \u2197'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </article>
            </div>

          </div>

          <div className={styles.newspaperRuleDouble} />

          {/* ==================================================================
              BOTTOM ROW: 3 EDITORIAL PROJECT CARDS OF CURRENT BATCH
              Formatted to match User's Image 2 specification
              ================================================================== */}
          <div className={styles.editorialBottomCardsGrid}>
            {currentBottomCards.map((card) => (
              <article key={card.title} className={styles.editorialBottomCard}>                {/* Header Docket */}
                <Link
                  href={`/projects/${card.slug}`}
                  className={styles.cardHeaderDocketLink}
                  aria-label={`Open case study for ${card.title}`}
                >
                  <div className={styles.cardHeaderDocket}>
                    <span className={styles.docketNumberPill}>[ {card.num} / 20 ]</span>
                    <span className={styles.docketCategoryPill}>{card.category}</span>
                  </div>
                </Link>

                {/* Collaged Media Preview Frame */}
                <Link
                  href={`/projects/${card.slug}`}
                  className={styles.bottomCardCollagedFrameLink}
                  aria-label={`Open case study for ${card.title}`}
                >
                  <div className={styles.bottomCardCollagedFrame}>
                    <div className={styles.bottomCardLaptopWrap}>
                      <Image
                        src={card.image}
                        alt={`${card.title} Platform Preview`}
                        fill
                        sizes="(max-width: 990px) 100vw, 380px"
                        className={`${styles.bottomCardImg} ${isFading ? styles.heroImgFading : ''}`}
                      />
                    </div>

                    {/* Taped Quote Note */}
                    <div className={styles.tapedCardQuote}>
                      <div className={styles.tapedCardTape} />
                      <span>&ldquo;{card.tapedQuote}&rdquo;</span>
                    </div>

                    {/* Dynamic Decorative Etchings & Stamps */}
                    {card.etchingType === 'building' && (
                      <div className={styles.buildingEtchingDeco} aria-hidden="true">
                        <svg className={styles.miniEtchingSvg} viewBox="0 0 80 80" fill="none">
                          <polygon points="40,10 10,30 70,30" stroke="#181512" strokeWidth="1.5" />
                          <line x1="16" y1="30" x2="16" y2="70" stroke="#181512" strokeWidth="1.5" />
                          <line x1="32" y1="30" x2="32" y2="70" stroke="#181512" strokeWidth="1.5" />
                          <line x1="48" y1="30" x2="48" y2="70" stroke="#181512" strokeWidth="1.5" />
                          <line x1="64" y1="30" x2="64" y2="70" stroke="#181512" strokeWidth="1.5" />
                          <rect x="8" y="70" width="64" height="6" stroke="#181512" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {card.etchingType === 'statue' && (
                      <div className={styles.statueEtchingDeco} aria-hidden="true">
                        <svg className={styles.miniEtchingSvg} viewBox="0 0 80 80" fill="none">
                          <circle cx="35" cy="25" r="14" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="3 2" />
                          <path d="M25 22 Q35 15 45 22" stroke="#FF6B35" strokeWidth="1.2" />
                          <path d="M20 50 C20 40 28 36 35 36 C42 36 50 40 50 50 L54 70 H16 Z" stroke="#FF6B35" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {card.etchingType === 'paw' && (
                      <div className={styles.pawPrintsDeco} aria-hidden="true">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="#181512">
                          <circle cx="8" cy="7" r="2" />
                          <circle cx="16" cy="7" r="2" />
                          <circle cx="5" cy="12" r="1.8" />
                          <circle cx="19" cy="12" r="1.8" />
                          <path d="M12 11 C9 11 7 13 8 16 C9 18 11 19 12 19 C13 19 15 18 16 16 C17 13 15 11 12 11 Z" />
                        </svg>
                      </div>
                    )}

                    {card.etchingType === 'chart' && (
                      <div className={styles.buildingEtchingDeco} aria-hidden="true">
                        <svg className={styles.miniEtchingSvg} viewBox="0 0 100 100" fill="none">
                          <line x1="15" y1="80" x2="85" y2="80" stroke="#181512" strokeWidth="2" />
                          <line x1="15" y1="20" x2="15" y2="80" stroke="#181512" strokeWidth="2" />
                          <rect x="25" y="45" width="10" height="35" stroke="#181512" strokeWidth="1.5" />
                          <rect x="45" y="30" width="10" height="50" fill="#FF6B35" fillOpacity="0.4" stroke="#181512" strokeWidth="1.5" />
                          <rect x="65" y="20" width="10" height="60" stroke="#181512" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {card.etchingType === 'brain' && (
                      <div className={styles.statueEtchingDeco} aria-hidden="true">
                        <svg className={styles.miniEtchingSvg} viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="30" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="3 2" />
                          <path d="M30 45 Q50 30 70 45" stroke="#181512" strokeWidth="1.5" />
                          <path d="M30 55 Q50 70 70 55" stroke="#181512" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Card Details Body Matching Image 2 */}
                <div className={styles.bottomCardDetails}>

                  {/* Title in Vibrant Orange */}
                  <Link href={`/projects/${card.slug}`} className={styles.bottomCardTitleLink}>
                    <h4 className={styles.bottomCardTitle}>{card.title}</h4>
                  </Link>

                  {/* Monospace / Typewriter Description */}
                  <p className={styles.bottomCardDesc}>{card.desc}</p>

                  {/* Role Subheading */}
                  <div className={styles.bottomCardRole}>{card.role}</div>

                  {/* Tech Icon Badges */}
                  <div className={styles.bottomCardTechRow}>
                    {card.techList.map((techName, tIdx) => (
                      <TechBadge key={tIdx} name={techName} />
                    ))}
                  </div>

                  {/* Floating Live Product Badge & Dual Action Buttons */}
                  <div className={styles.bottomCardActionContainer}>
                    <div className={styles.bottomCardPlateWrapper}>
                      <div className={styles.bottomCardLivePlate}>
                        [ &#8599; {card.badgeText} ]
                      </div>
                    </div>

                    <div className={styles.bottomCardActionsRow}>
                      <Link href={`/projects/${card.slug}`} className={styles.primaryActionBtn}>
                        <span>EXPLORE CASE STUDY</span>
                        <ArrowRight size={13} />
                      </Link>

                      {card.liveUrl && (
                        <a
                          href={card.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.secondaryActionBtn}
                        >
                          <span>{card.isFigma ? 'FIGMA \u2197' : 'LIVE \u2197'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>

        </div>

        {/* ====================================================================
            LOOKING FOR MORE CASE STUDIES? BANNER BAR
            Placed cleanly right after the feature section, inviting visitors
            to explore all 50+ projects in the complete repository archive.
            ==================================================================== */}
        <div className={styles.bottomArchiveBar}>
          <div className={styles.archiveTextGroup}>
            <span className={styles.archivePrompt}>LOOKING FOR MORE CASE STUDIES?</span>
            <span className={styles.archiveCount}>
              Explore over 50+ live websites, fintech platforms, mobile prototypes, and design systems.
            </span>
          </div>

          <Link href="/projects" className={styles.bottomArchiveCta}>
            <span>OPEN COMPLETE REPOSITORY</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
