'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Maximize2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Film
} from 'lucide-react';
import { projectsData } from '@/data/projectsData';
import styles from './ProjectShowcase.module.css';

const SLIDE_DURATION = 3800; // 3.8 seconds auto-scroll per slide

export default function ProjectShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [isChangingSlide, setIsChangingSlide] = useState(false);

  const imageFrameRef = useRef(null);
  const progressTimerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter valid projects with images
  const validProjects = useMemo(() => {
    return (projectsData || []).filter((p) => p.image && typeof p.image === 'string');
  }, []);

  const activeProject = validProjects[currentIndex] || validProjects[0];

  // Listen for global custom events to open visual gallery
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimerProgress(0);
    };
    window.addEventListener('open-visual-gallery', handleOpen);
    window.addEventListener('open-project-showcase', handleOpen);
    return () => {
      window.removeEventListener('open-visual-gallery', handleOpen);
      window.removeEventListener('open-project-showcase', handleOpen);
    };
  }, []);

  // Slide navigation with mechanical projector transition cue
  const goToSlide = useCallback((index) => {
    setIsChangingSlide(true);
    setTimerProgress(0);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsChangingSlide(false);
    }, 280);
  }, []);

  const handleNext = useCallback(() => {
    if (validProjects.length === 0) return;
    goToSlide((currentIndex + 1) % validProjects.length);
  }, [currentIndex, validProjects.length, goToSlide]);

  const handlePrev = useCallback(() => {
    if (validProjects.length === 0) return;
    goToSlide((currentIndex - 1 + validProjects.length) % validProjects.length);
  }, [currentIndex, validProjects.length, goToSlide]);

  // Auto-advance slide with hover-stop & pause controls
  useEffect(() => {
    if (!isOpen || isPaused || isHovering || lightboxOpen || validProjects.length <= 1) {
      return;
    }

    const intervalStep = 30; // 30ms step for fluid hairline gauge
    const progressStep = (intervalStep / SLIDE_DURATION) * 100;

    progressTimerRef.current = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressStep;
      });
    }, intervalStep);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isOpen, isPaused, isHovering, lightboxOpen, validProjects.length, handleNext]);

  // Lock body scrolling when modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    }

    return () => {
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        else setIsOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxOpen, handleNext, handlePrev]);

  // Mouse move handler for 3D tilt, specular sheen & focus reticle
  const handleMouseMove = (e) => {
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const x = clientX / rect.width - 0.5; // -0.5 to 0.5
    const y = clientY / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y, clientX: Math.round(clientX), clientY: Math.round(clientY) });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0, y: 0, clientX: 0, clientY: 0 });
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
  };

  return (
    <>
      {/* ===================================================================
          1. STICKY TRIGGER BUTTON (Docked on Right Screen Edge)
          =================================================================== */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setTimerProgress(0);
        }}
        className={styles.stickyShowcaseBtn}
        aria-label="Open Visual Gallery Album"
        title="Open Running 35mm Project Album"
      >
        <span className={styles.iconWrapper}>
          <Film size={15} strokeWidth={2.2} />
          <span className={styles.badge50}>60+</span>
        </span>
        <span className={styles.labelWrapper}>
          <span className={styles.labelText}>GALLERY REEL</span>
          <ArrowUpRight size={13} />
        </span>
      </button>

      {/* ===================================================================
          2. FULLSCREEN RUNNING RETRO IMAGE ALBUM
          =================================================================== */}
      {isOpen && activeProject && (
        <div
          className={styles.showcaseModal}
          role="dialog"
          aria-modal="true"
          aria-label="35mm Visual Project Album"
        >
          <div className={styles.modalTexture} aria-hidden="true" />

          {/* Minimal Top Header Bar */}
          <header className={styles.minimalTopBar}>
            {/* Left: Vintage Album Stamp */}
            <div className={styles.topStampGroup}>
              <span className={styles.topStampBadge}>[ VOSS 35mm · ARCHIVAL REEL ]</span>
              <span className={styles.topTotalCounter}>
                EXP. {String(currentIndex + 1).padStart(2, '0')} / {validProjects.length}
              </span>
            </div>

            {/* Right: Auto/Pause Status, Play/Pause & Close Button */}
            <div className={styles.topActionsGroup}>
              {/* Auto-Scroll / Hover-Stop Status Pill */}
              <div
                className={`${styles.statusBadge} ${isHovering ? styles.statusHoverPaused : isPaused ? styles.statusManualPaused : styles.statusRunning}`}
                title={isHovering ? 'Auto-scroll halted on mouse hover' : isPaused ? 'Auto-scroll paused manually' : 'Auto-advancing album'}
              >
                <span className={isHovering || isPaused ? styles.statusPausedDot : styles.statusRunningDot} />
                <span>
                  {isHovering
                    ? 'HOVER STOP ⏸'
                    : isPaused
                    ? 'PAUSED ⏸'
                    : 'RUNNING ▶'}
                </span>
              </div>

              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className={styles.iconActionBtn}
                aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                title="Pause / Resume (Spacebar)"
              >
                {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                <span className={styles.btnLabelDesktop}>{isPaused ? 'PLAY' : 'PAUSE'}</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label="Close visual gallery"
                title="Close Album (Esc)"
              >
                <span>CLOSE</span>
                <span className={styles.escKeyHelp}> [ESC]</span>
                <X size={14} />
              </button>
            </div>
          </header>

          {/* =================================================================
              3. CENTERSTAGE: BIG CINEMATIC IMAGE WITH BOTTOM-LEFT OVERLAY
              ================================================================= */}
          <main className={styles.bigAlbumStage}>
            <div className={styles.perspectiveWrap}>
              
              {/* Big Image Frame with 3D Tilt & Specular Light */}
              <div
                ref={imageFrameRef}
                className={`${styles.bigImageFrame} ${isChangingSlide ? styles.shutterAnimation : ''}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* The Hero Big Image */}
                <Image
                  key={activeProject.id || currentIndex}
                  src={encodeURI(activeProject.image)}
                  alt={activeProject.title || activeProject.name || 'Visual Gallery Project'}
                  fill
                  sizes="100vw"
                  className={styles.bigHeroImage}
                  priority
                />

                {/* Specular Lens Glare & Prismatic Sheen (Follows Mouse Cursor!) */}
                <div
                  className={styles.mouseSheenOverlay}
                  style={{
                    background: isHovering
                      ? `radial-gradient(circle 350px at ${mousePos.clientX}px ${mousePos.clientY}px, rgba(255, 255, 255, 0.28) 0%, rgba(255, 91, 46, 0.18) 32%, rgba(34, 195, 238, 0.1) 62%, transparent 80%)`
                      : 'none',
                  }}
                  aria-hidden="true"
                />

                {/* Subtle Analog Projector Lens Scanlines & Edge Vignette */}
                <div className={styles.lensVignette} aria-hidden="true" />

                {/* 4 Corner Viewfinder Reticle Brackets */}
                <span className={`${styles.cornerReticle} ${styles.reticleTL}`} aria-hidden="true" />
                <span className={`${styles.cornerReticle} ${styles.reticleTR}`} aria-hidden="true" />
                <span className={`${styles.cornerReticle} ${styles.reticleBL}`} aria-hidden="true" />
                <span className={`${styles.cornerReticle} ${styles.reticleBR}`} aria-hidden="true" />

                {/* Interactive Reticle Target Cursor (Tracks Mouse in Frame) */}
                {isHovering && (
                  <div
                    className={styles.reticleCursor}
                    style={{
                      left: `${mousePos.clientX}px`,
                      top: `${mousePos.clientY}px`,
                    }}
                    aria-hidden="true"
                  >
                    <span className={styles.reticleCircle} />
                    <span className={styles.reticleCrossH} />
                    <span className={styles.reticleCrossV} />
                  </div>
                )}

                {/* Live Optical Coordinates Telemetry HUD */}
                <div className={styles.coordBadge} aria-hidden="true">
                  <span>FRAME {String(currentIndex + 1).padStart(2, '0')}</span>
                  <span>·</span>
                  <span>f/2.8 · 1/125</span>
                </div>

                {/* Left & Right Fast Arrow Navigation Paddle Zones */}
                <button
                  type="button"
                  className={`${styles.imagePaddle} ${styles.paddleLeft}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous image"
                  title="Previous Image (← Arrow)"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  type="button"
                  className={`${styles.imagePaddle} ${styles.paddleRight}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next image"
                  title="Next Image (→ Arrow)"
                >
                  <ChevronRight size={28} />
                </button>

                {/* =========================================================
                    CONTENT OVERLAY ON IMAGE: BOTTOM-LEFT SIDE
                    ========================================================= */}
                <div
                  className={styles.bottomLeftOverlay}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.overlayIndexRow}>
                    <span className={styles.overlayIndexBadge}>
                      TAKE {String(currentIndex + 1).padStart(2, '0')} / {validProjects.length}
                    </span>
                    {activeProject.category && (
                      <span className={styles.overlayCategoryTag}>
                        {activeProject.category}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.overlayProjectTitle}>
                    {activeProject.title || activeProject.name}
                  </h3>

                  {(activeProject.description || activeProject.desc) && (
                    <p className={styles.overlayProjectDesc}>
                      {activeProject.description || activeProject.desc}
                    </p>
                  )}

                  <div className={styles.overlayBtnRow}>
                    <Link
                      href={`/work/${activeProject.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={styles.overlayCaseBtn}
                      title="Open full UX research case study"
                    >
                      <span>EXPLORE CASE STUDY</span>
                      <ArrowUpRight size={14} />
                    </Link>

                    {(activeProject.link || activeProject.figmaLink || activeProject.liveLink) && (
                      <a
                        href={activeProject.link || activeProject.liveLink || activeProject.figmaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.overlayLiveBtn}
                        title="Open live project / prototype"
                      >
                        <span>VISIT SPEC ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* =========================================================
                    BOTTOM-RIGHT CONTROLS OVERLAY (PREV, NEXT, ZOOM)
                    ========================================================= */}
                <div
                  className={styles.bottomRightOverlay}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={styles.overlayNavBtn}
                    aria-label="Previous slide"
                    title="Previous Slide (← Arrow)"
                  >
                    <ChevronLeft size={15} />
                    <span>PREV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className={styles.overlayNavBtn}
                    aria-label="Next slide"
                    title="Next Slide (→ Arrow)"
                  >
                    <span>NEXT</span>
                    <ChevronRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className={styles.overlayZoomBtn}
                    aria-label="Fullscreen view"
                    title="Fullscreen zoom"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>

                {/* Auto-Advance Hairline Retro Timer Track docked to bottom of frame */}
                <div
                  className={styles.frameTimerTrack}
                  title={isHovering ? 'Paused on hover' : 'Auto-advancing album'}
                  aria-hidden="true"
                >
                  <div
                    className={styles.frameTimerFill}
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ===================================================================
          4. FULLSCREEN HIGH-RES LIGHTBOX MODAL
          =================================================================== */}
      {lightboxOpen && activeProject && (
        <div className={styles.lightboxBackdrop} onClick={() => setLightboxOpen(false)}>
          <div
            className={styles.lightboxCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="High Resolution Inspection"
          >
            {/* Lightbox Header */}
            <div className={styles.lightboxHeader}>
              <span>
                [{String(currentIndex + 1).padStart(2, '0')} / {validProjects.length}] •{' '}
                {activeProject.title || activeProject.name}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className={styles.closeLightboxIconBtn}
                aria-label="Close inspection lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lightbox Big Image */}
            <div className={styles.lightboxImageArea}>
              <Image
                src={encodeURI(activeProject.image)}
                alt={activeProject.title || activeProject.name}
                fill
                sizes="100vw"
                className={styles.lightboxImg}
                priority
              />
            </div>

            {/* Lightbox Footer & Controls */}
            <div className={styles.lightboxFooter}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                  {activeProject.title || activeProject.name}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#7C7267' }}>
                  {activeProject.category}
                </span>
              </div>

              <div className={styles.lightboxNavBtns}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.lightboxNavBtn}
                  aria-label="Previous project"
                >
                  <ChevronLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> PREV
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.lightboxNavBtn}
                  aria-label="Next project"
                >
                  NEXT <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </button>

                {(activeProject.link || activeProject.figmaLink || activeProject.liveLink) && (
                  <a
                    href={activeProject.link || activeProject.liveLink || activeProject.figmaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.lightboxNavBtn}
                    style={{ background: '#FF6B35', color: '#181512', textDecoration: 'none' }}
                  >
                    <span>OPEN LIVE</span>
                    <ArrowUpRight size={13} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '3px' }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
