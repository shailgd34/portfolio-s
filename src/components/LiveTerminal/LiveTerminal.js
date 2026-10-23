'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Terminal, Clock, Activity, ArrowUpRight, FolderGit2, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import styles from './LiveTerminal.module.css';

export default function LiveTerminal() {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'overview', 'contact'
  const [currentTime, setCurrentTime] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('Ready for interaction. Select command or project docket below.');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Live real-time clock ticking for Indore, India (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setCurrentTime(timeStr);
      } catch (e) {
        setCurrentTime('12:00:00 AM');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('shailashs79@gmail.com');
      setCopiedEmail(true);
      setTerminalOutput('Copied direct email [shailashs79@gmail.com] to clipboard.');
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const recentDeploys = [
    {
      id: '7sens',
      log: 'DEPLOY // 01',
      title: '7Sens Luxury Brand',
      category: 'Creative Agency',
      image: '/portfolio/7Sens/mainone.png',
      impact: 'High-Impact Brand & Web Architecture',
      link: 'https://7sens-frontend.vercel.app/',
      isLive: true,
    },
    {
      id: 'carat-club',
      log: 'DEPLOY // 02',
      title: 'Carat Club 3D Luxury',
      category: 'E-Commerce 3D',
      image: '/portfolio/Carat Club/mainone.png',
      impact: 'Interactive 3D Three.js Configurator',
      link: 'https://carat-club.vercel.app/',
      isLive: true,
    },
    {
      id: 'neuro-kaizen',
      log: 'DEPLOY // 03',
      title: 'NeuroKaizen AI Portal',
      category: 'AI SaaS Platform',
      image: '/portfolio/Neuro Kaizen/mainone.png',
      impact: 'B2B Analytics & AI Workflow System',
      link: 'https://portal.neurokaizen.com/',
      isLive: true,
    },
    {
      id: 'fuel-cab',
      log: 'DEPLOY // 04',
      title: 'Fuel Cab Booking',
      category: 'Mobile Application',
      image: '/portfolio/Fuel Cab/mainone.png',
      impact: 'Real-Time Dispatch & Driver UI',
      link: 'https://www.figma.com/@sheelash',
      isLive: false,
    },
  ];

  return (
    <section className={styles.terminalSection} aria-label="Live Telemetry and Projects Terminal">
      <div className="container">
        <div className={styles.terminalWindow}>

          {/* Retro Window Titlebar */}
          <div className={styles.titlebar}>
            <div className={styles.trafficLights}>
              <span className={styles.trafficDot} />
              <span className={styles.trafficDot} />
              <span className={styles.trafficDot} />
            </div>

            <div className={styles.terminalTitle}>
              <Terminal size={14} className={styles.termIcon} />
              <span>TELEMETRY_TERMINAL.EXE // SHAILASH_S_DOSSIER</span>
            </div>

            <div className={styles.liveClockBadge}>
              <Clock size={13} />
              <span>INDORE (UTC+5:30): {currentTime || 'SYNCING...'}</span>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className={styles.telemetryBar}>
            <div className={styles.telemetryItem}>
              <span className={styles.pulseDot} />
              <span className={styles.telemetryLabel}>SYSTEM STATUS:</span>
              <strong className={styles.telemetryVal}>ONLINE & ACCEPTING CLIENTS</strong>
            </div>

            <div className={styles.telemetryDivider}>|</div>

            <div className={styles.telemetryItem}>
              <Activity size={13} className={styles.orangeIcon} />
              <span className={styles.telemetryLabel}>PIPELINE:</span>
              <strong className={styles.telemetryVal}>2 SLOTS OPEN FOR 2026</strong>
            </div>

            <div className={styles.telemetryDivider}>|</div>

            <div className={styles.telemetryItem}>
              <span className={styles.telemetryLabel}>AVG RESPONSE:</span>
              <strong className={styles.telemetryVal}>&lt; 2 HOURS</strong>
            </div>
          </div>

          {/* Interactive Command Tabs */}
          <div className={styles.commandTabs}>
            <button
              type="button"
              className={`${styles.cmdTab} ${activeTab === 'projects' ? styles.cmdTabActive : ''}`}
              onClick={() => {
                setActiveTab('projects');
                setTerminalOutput('Displaying verified recent production deploys and flagship systems.');
              }}
            >
              <FolderGit2 size={13} />
              <span>[ 01 // RECENT DEPLOYS ]</span>
              <span className={styles.tabBadge}>4 WORKS</span>
            </button>

            <button
              type="button"
              className={`${styles.cmdTab} ${activeTab === 'overview' ? styles.cmdTabActive : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setTerminalOutput('Querying engineer capabilities, stack telemetry, and verification credentials.');
              }}
            >
              <span>[ 02 // CAPABILITIES & STACK ]</span>
            </button>

            <button
              type="button"
              className={`${styles.cmdTab} ${activeTab === 'contact' ? styles.cmdTabActive : ''}`}
              onClick={() => {
                setActiveTab('contact');
                setTerminalOutput('Direct communication channels open: WhatsApp, Email & Discovery booking.');
              }}
            >
              <MessageSquare size={13} />
              <span>[ 03 // DISPATCH INQUIRY ]</span>
            </button>
          </div>

          {/* Terminal Dynamic Content Body */}
          <div className={styles.terminalBody}>

            {/* TAB 1: RECENT DEPLOYS (VISITORS CAN IMMEDIATELY SEE PROJECTS!) */}
            {activeTab === 'projects' && (
              <div className={styles.projectsTabPane}>
                <div className={styles.paneHeader}>
                  <div className={styles.paneTitleGroup}>
                    <ChevronRight size={16} className={styles.promptArrow} />
                    <span className={styles.promptCmd}>cat /verified_releases/flagship_works.json</span>
                  </div>
                  <Link href="/projects" className={styles.exploreAllLink}>
                    <span>VIEW COMPLETE REPOSITORY (50+)</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div className={styles.deploysGrid}>
                  {recentDeploys.map((proj) => (
                    <article key={proj.id} className={styles.deployCard}>
                      <div className={styles.deployImgWrapper}>
                        <Image
                          src={encodeURI(proj.image)}
                          alt={proj.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className={styles.deployImg}
                        />
                        <div className={styles.deployOverlay} />
                        <span className={styles.deployTag}>
                          {proj.isLive ? 'LIVE PLATFORM ↗' : 'FIGMA PROTOTYPE ↗'}
                        </span>
                      </div>

                      <div className={styles.deployMeta}>
                        <div className={styles.deployTopRow}>
                          <span className={styles.deployLog}>{proj.log}</span>
                          <span className={styles.deployCat}>{proj.category}</span>
                        </div>
                        <h4 className={styles.deployTitle}>{proj.title}</h4>
                        <p className={styles.deployImpact}>{proj.impact}</p>

                        <div className={styles.deployActions}>
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.deployLaunchBtn}
                          >
                            <span>LAUNCH SYSTEM</span>
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CAPABILITIES & STACK */}
            {activeTab === 'overview' && (
              <div className={styles.overviewPane}>
                <div className={styles.paneHeader}>
                  <div className={styles.paneTitleGroup}>
                    <ChevronRight size={16} className={styles.promptArrow} />
                    <span className={styles.promptCmd}>shailash --capabilities --verbose</span>
                  </div>
                </div>

                <div className={styles.docketSpecsGrid}>
                  <div className={styles.specBox}>
                    <span className={styles.specLabel}>[ CORE SPECIALIZATION ]</span>
                    <h5 className={styles.specHeading}>ENTERPRISE PRODUCT DESIGN & UX</h5>
                    <p className={styles.specBody}>
                      Engineered for high user retention, seamless dashboard workflows, and conversion-focused customer journeys.
                    </p>
                    <ul className={styles.specList}>
                      <li>• End-to-End SaaS & FinTech Dashboards</li>
                      <li>• Mobile Application Design (iOS / Android / Flutter)</li>
                      <li>• Design System Governance & Token Systems</li>
                    </ul>
                  </div>

                  <div className={styles.specBox}>
                    <span className={styles.specLabel}>[ PRODUCTION TOOLCHAIN ]</span>
                    <h5 className={styles.specHeading}>DESIGN & FRONTEND ARSENAL</h5>
                    <p className={styles.specBody}>
                      Pixel-fidelity design paired with clean component architecture and rapid prototyping.
                    </p>
                    <div className={styles.techPillCloud}>
                      <span>Figma</span>
                      <span>Next.js 15</span>
                      <span>React</span>
                      <span>Tailwind CSS</span>
                      <span>TypeScript</span>
                      <span>Design Systems</span>
                      <span>Web3 / FinTech</span>
                    </div>
                  </div>

                  <div className={styles.specBox}>
                    <span className={styles.specLabel}>[ TRACK RECORD AUDIT ]</span>
                    <h5 className={styles.specHeading}>VERIFIED DELIVERABLES</h5>
                    <div className={styles.statsDocketRow}>
                      <div className={styles.statCell}>
                        <span className={styles.statNum}>50+</span>
                        <span className={styles.statName}>Projects Shipped</span>
                      </div>
                      <div className={styles.statCell}>
                        <span className={styles.statNum}>6</span>
                        <span className={styles.statName}>Years Practice</span>
                      </div>
                      <div className={styles.statCell}>
                        <span className={styles.statNum}>100%</span>
                        <span className={styles.statName}>On-Time Dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTACT & DISPATCH */}
            {activeTab === 'contact' && (
              <div className={styles.contactPane}>
                <div className={styles.paneHeader}>
                  <div className={styles.paneTitleGroup}>
                    <ChevronRight size={16} className={styles.promptArrow} />
                    <span className={styles.promptCmd}>connect --instant --direct</span>
                  </div>
                </div>

                <div className={styles.contactCardsGrid}>
                  <div className={styles.contactBox}>
                    <span className={styles.contactDocketTag}>[ DIRECT FAST-TRACK ]</span>
                    <h5 className={styles.contactBoxTitle}>WHATSAPP CHAT</h5>
                    <p className={styles.contactBoxDesc}>
                      Instant direct communication for project scopes, budget discussions, or hiring inquiries.
                    </p>
                    <a
                      href="https://wa.me/919516372235"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactActionBtn}
                    >
                      <span>CHAT ON WHATSAPP (+91 95163 72235)</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>

                  <div className={styles.contactBox}>
                    <span className={styles.contactDocketTag}>[ ASYNC DISPATCH ]</span>
                    <h5 className={styles.contactBoxTitle}>OFFICIAL INBOX</h5>
                    <p className={styles.contactBoxDesc}>
                      Send detailed RFPs, project briefs, NDA documents, or full-time opportunities.
                    </p>
                    <div className={styles.emailActionRow}>
                      <a href="mailto:shailashs79@gmail.com" className={styles.contactActionBtn}>
                        <span>SEND EMAIL</span>
                        <ArrowUpRight size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className={styles.copyEmailBtn}
                      >
                        {copiedEmail ? <CheckCircle2 size={14} color="#FF6B35" /> : 'COPY'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Terminal Console Status Footer */}
          <div className={styles.consoleFooter}>
            <span className={styles.consolePrompt}>shailash@portfolio:~$</span>
            <span className={styles.consoleText}>{terminalOutput}</span>
            <span className={styles.blinkingCursor}>█</span>
          </div>

        </div>
      </div>
    </section>
  );
}
