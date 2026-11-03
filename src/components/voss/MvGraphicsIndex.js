'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  FONTS,
  colorsOf,
  fontsOf,
  cssVars,
  useFonts,
  useLive,
  useReduced,
  Eyebrow,
  Head,
  CSS_BASE,
  CSS_MOTION,
  siteFontCss,
} from './scaffold';
import { postersData } from '@/data/postersData';
import { logosData } from '@/data/logosData';

const pad = (n) => String(n).padStart(2, '0');

// Authentic 35mm and 16mm camera sprocket perforation masks
const SPROCKET_35 = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='36'><rect x='8' y='6' width='16' height='22' rx='3.5' fill='%23000'/></svg>")`;
const SPROCKET_16 = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='26'><rect x='6' y='6' width='11' height='13' rx='2.5' fill='%23000'/></svg>")`;

// Vintage Projector Film Spool SVG Component
const ReelSpool = ({ size = 48, spinning = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`vtr-spool-svg ${spinning ? 'is-spinning' : ''}`}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="47" fill="#14120E" stroke="#F2923A" strokeWidth="3" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(242,146,58,0.25)" strokeWidth="1.5" />
    {/* 4 large circular film spool cutout holes */}
    <circle cx="50" cy="23" r="11" fill="#0A0908" stroke="rgba(242,146,58,0.5)" strokeWidth="2" />
    <circle cx="50" cy="77" r="11" fill="#0A0908" stroke="rgba(242,146,58,0.5)" strokeWidth="2" />
    <circle cx="23" cy="50" r="11" fill="#0A0908" stroke="rgba(242,146,58,0.5)" strokeWidth="2" />
    <circle cx="77" cy="50" r="11" fill="#0A0908" stroke="rgba(242,146,58,0.5)" strokeWidth="2" />
    {/* Diagonal smaller ventilation ports */}
    <circle cx="31" cy="31" r="5" fill="#0A0908" stroke="rgba(242,146,58,0.3)" strokeWidth="1" />
    <circle cx="69" cy="31" r="5" fill="#0A0908" stroke="rgba(242,146,58,0.3)" strokeWidth="1" />
    <circle cx="31" cy="69" r="5" fill="#0A0908" stroke="rgba(242,146,58,0.3)" strokeWidth="1" />
    <circle cx="69" cy="69" r="5" fill="#0A0908" stroke="rgba(242,146,58,0.3)" strokeWidth="1" />
    {/* Center brass spindle hub */}
    <circle cx="50" cy="50" r="14" fill="#1C1814" stroke="#F2923A" strokeWidth="3" />
    <circle cx="50" cy="50" r="5" fill="#F2923A" />
  </svg>
);

export default function MvGraphicsIndex(props = {}) {
  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();

  // Navigation & View mode states
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'posters' | 'logos'
  const [posterMode, setPosterMode] = useState('reel'); // 'reel' (35mm film strip) | 'table' (backlit light table grid)
  const [logoMode, setLogoMode] = useState('reel'); // 'reel' (16mm movie projector) | 'grid' (contact sheet)

  // Film reel animation states
  const [posterAutoPlay, setPosterAutoPlay] = useState(true);
  const [logoAutoPlay, setLogoAutoPlay] = useState(true);
  const [currentPosterFrame, setCurrentPosterFrame] = useState(0);
  const [timecode, setTimecode] = useState('00:14:28:12');
  const [filmFlicker, setFilmFlicker] = useState(true);

  // Modals for inspection
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedPosterIdx, setSelectedPosterIdx] = useState(0);
  const [posterSurface, setPosterSurface] = useState('darkroom'); // 'darkroom' | 'tungsten' | 'daylight'
  const [loupeActive, setLoupeActive] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoIdx, setSelectedLogoIdx] = useState(0);
  const [logoSurface, setLogoSurface] = useState('brand');

  const posterReelRef = useRef(null);
  const isDraggingPoster = useRef(false);
  const startXPoster = useRef(0);
  const scrollLeftPoster = useRef(0);

  // Vintage camera timecode runner
  useEffect(() => {
    let frame = 12;
    let sec = 28;
    let min = 14;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      setTimecode(`00:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPoster(null);
        setSelectedLogo(null);
      }
      if (selectedPoster) {
        if (e.key === 'ArrowRight') {
          const nextIdx = (selectedPosterIdx + 1) % postersData.length;
          setSelectedPosterIdx(nextIdx);
          setSelectedPoster(postersData[nextIdx]);
        } else if (e.key === 'ArrowLeft') {
          const prevIdx = (selectedPosterIdx - 1 + postersData.length) % postersData.length;
          setSelectedPosterIdx(prevIdx);
          setSelectedPoster(postersData[prevIdx]);
        }
      }
      if (selectedLogo) {
        if (e.key === 'ArrowRight') {
          const nextIdx = (selectedLogoIdx + 1) % logosData.length;
          setSelectedLogoIdx(nextIdx);
          setSelectedLogo(logosData[nextIdx]);
        } else if (e.key === 'ArrowLeft') {
          const prevIdx = (selectedLogoIdx - 1 + logosData.length) % logosData.length;
          setSelectedLogoIdx(prevIdx);
          setSelectedLogo(logosData[prevIdx]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPoster, selectedPosterIdx, selectedLogo, selectedLogoIdx]);

  // Poster Reel auto-advance
  useEffect(() => {
    if (!posterAutoPlay || posterMode !== 'reel') return;
    const timer = setInterval(() => {
      if (posterReelRef.current) {
        const el = posterReelRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 15) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 360, behavior: 'smooth' });
        }
      }
    }, 4200);
    return () => clearInterval(timer);
  }, [posterAutoPlay, posterMode]);

  // Track active poster frame as user scrolls
  const handlePosterScroll = () => {
    if (!posterReelRef.current) return;
    const el = posterReelRef.current;
    const itemWidth = 360;
    const idx = Math.min(
      postersData.length - 1,
      Math.max(0, Math.round(el.scrollLeft / itemWidth))
    );
    setCurrentPosterFrame(idx);
  };

  // Drag to scroll for poster reel
  const handleMouseDown = (e) => {
    isDraggingPoster.current = true;
    startXPoster.current = e.pageX - posterReelRef.current.offsetLeft;
    scrollLeftPoster.current = posterReelRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDraggingPoster.current = false;
  };
  const handleMouseUp = () => {
    isDraggingPoster.current = false;
  };
  const handleMouseMove = (e) => {
    if (!isDraggingPoster.current) return;
    e.preventDefault();
    const x = e.pageX - posterReelRef.current.offsetLeft;
    const walk = (x - startXPoster.current) * 1.5;
    posterReelRef.current.scrollLeft = scrollLeftPoster.current - walk;
  };

  const scrollPosterTo = (idx) => {
    if (posterReelRef.current) {
      const target = posterReelRef.current.children[idx + 1]; // +1 for leader frame
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
    setCurrentPosterFrame(idx);
  };

  const openPoster = (poster, idx) => {
    setSelectedPoster(poster);
    setSelectedPosterIdx(idx);
    setPosterSurface('darkroom');
    setLoupeActive(false);
  };

  const openLogo = (logo, idx) => {
    setSelectedLogo(logo);
    setSelectedLogoIdx(idx);
    setLogoSurface('brand');
  };

  // Duplicate logos for seamless infinite marquee loop
  const infiniteLogos = [...logosData, ...logosData];

  return (
    <div
      className={`vtr-root ${filmFlicker ? 'vtr-flicker-active' : ''}`}
      style={{
        ...cssVars(c),
        ...B,
        minHeight: '100vh',
        background: '#0B0A09',
        color: '#F1ECE4',
        position: 'relative',
        paddingBottom: '120px',
        overflowX: 'clip',
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style
        dangerouslySetInnerHTML={{
          __html: CSS_BASE + CSS_MOTION + siteFontCss(props) + `
            /* ==========================================================================
               VINTAGE CAMERA HUD & REEL STYLING
               ========================================================================== */

            .vtr-wrap {
              max-width: 1440px;
              margin: 0 auto;
              padding: 120px 24px 30px;
            }
            @media (max-width: 768px) {
              .vtr-wrap {
                padding: 95px 16px 20px;
              }
            }

            /* Retro Camera Viewfinder Bar */
            .vtr-viewfinder {
              background: linear-gradient(180deg, #181512 0%, #0E0D0B 100%);
              border: 1px solid rgba(242, 146, 58, 0.28);
              border-radius: 12px;
              padding: 14px 20px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 40px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
              position: relative;
            }
            .vtr-hud-left {
              display: flex;
              align-items: center;
              gap: 18px;
              font-family: monospace;
              font-size: 12px;
              letter-spacing: 0.1em;
            }
            .vtr-rec-pill {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(220, 38, 38, 0.15);
              border: 1px solid rgba(220, 38, 38, 0.4);
              color: #EF4444;
              padding: 4px 10px;
              border-radius: 999px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .vtr-rec-dot {
              width: 8px;
              height: 8px;
              background: #EF4444;
              border-radius: 50%;
              animation: vtrRecPulse 1.2s infinite ease-in-out;
              box-shadow: 0 0 10px #EF4444;
            }
            @keyframes vtrRecPulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.25; transform: scale(0.85); }
            }

            .vtr-timecode {
              color: #F2923A;
              font-weight: 700;
              font-size: 13px;
              background: #000;
              padding: 3px 8px;
              border-radius: 4px;
              border: 1px solid rgba(242, 146, 58, 0.3);
            }
            .vtr-specs-badge {
              color: rgba(241, 236, 228, 0.6);
              display: none;
            }
            @media (min-width: 900px) {
              .vtr-specs-badge {
                display: block;
              }
            }

            .vtr-hud-right {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .vtr-hud-toggle-btn {
              background: rgba(241, 236, 228, 0.06);
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: rgba(241, 236, 228, 0.7);
              font-family: monospace;
              font-size: 11px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .vtr-hud-toggle-btn:hover {
              color: #F1ECE4;
              border-color: #F2923A;
            }
            .vtr-hud-toggle-btn.is-active {
              background: rgba(242, 146, 58, 0.18);
              border-color: #F2923A;
              color: #F2923A;
              font-weight: 700;
            }

            /* Category Filter Tabs */
            .vtr-nav-tabs {
              display: flex;
              gap: 12px;
              margin: 32px 0 44px;
              border-bottom: 1px solid rgba(241, 236, 228, 0.1);
              padding-bottom: 16px;
              overflow-x: auto;
            }
            .vtr-tab {
              background: transparent;
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: rgba(241, 236, 228, 0.7);
              font-family: inherit;
              font-size: 13px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              padding: 8px 20px;
              border-radius: 999px;
              cursor: pointer;
              transition: all 0.2s ease;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .vtr-tab:hover {
              color: #F1ECE4;
              border-color: rgba(242, 146, 58, 0.4);
            }
            .vtr-tab.is-active {
              background: #F2923A;
              color: #0E0D0C;
              border-color: #F2923A;
              font-weight: 700;
            }
            .vtr-tab-count {
              font-family: monospace;
              font-size: 11px;
              padding: 2px 7px;
              border-radius: 999px;
              background: rgba(0, 0, 0, 0.25);
            }
            .vtr-tab.is-active .vtr-tab-count {
              background: rgba(0, 0, 0, 0.2);
              color: #0E0D0C;
            }

            /* ==========================================================================
               SECTION: 35MM VINTAGE POSTER FILM REEL
               ========================================================================== */
            .vtr-section-hdr {
              display: flex;
              flex-wrap: wrap;
              align-items: flex-end;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 24px;
              padding-bottom: 14px;
              border-bottom: 1px solid rgba(242, 146, 58, 0.25);
            }
            .vtr-sec-title-wrap {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .vtr-sec-title {
              font-size: clamp(24px, 2.5vw, 34px);
              font-weight: 700;
              margin: 0;
              color: #F1ECE4;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .vtr-sec-roll-badge {
              font-family: monospace;
              font-size: 12px;
              color: #F2923A;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            .vtr-view-toggle-bar {
              display: flex;
              gap: 8px;
            }
            .vtr-view-btn {
              background: rgba(241, 236, 228, 0.05);
              border: 1px solid rgba(241, 236, 228, 0.12);
              color: rgba(241, 236, 228, 0.7);
              font-family: monospace;
              font-size: 11px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .vtr-view-btn:hover {
              color: #F1ECE4;
              border-color: #F2923A;
            }
            .vtr-view-btn.is-active {
              background: rgba(242, 146, 58, 0.16);
              border-color: #F2923A;
              color: #F2923A;
              font-weight: 700;
            }

            /* Spinning Spool Animation */
            @keyframes spinReel {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .vtr-spool-svg.is-spinning {
              animation: spinReel 14s linear infinite;
            }

            /* 35mm Film Canister Track Container */
            .vtr-35mm-reel-box {
              position: relative;
              background: #070605;
              border: 2px solid #1C1915;
              border-radius: 16px;
              padding: 30px 0 24px;
              margin-bottom: 70px;
              box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), inset 0 0 50px rgba(0, 0, 0, 0.8);
              overflow: hidden;
            }
            /* Real 35mm Camera Sprocket Perforations Top & Bottom */
            .vtr-35mm-reel-box::before,
            .vtr-35mm-reel-box::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              height: 36px;
              z-index: 5;
              pointer-events: none;
              background: #14120E;
              -webkit-mask: ${SPROCKET_35} 0 0/34px 36px repeat-x;
              mask: ${SPROCKET_35} 0 0/34px 36px repeat-x;
              box-shadow: 0 2px 10px rgba(0,0,0,0.8);
            }
            .vtr-35mm-reel-box::before {
              top: 0;
            }
            .vtr-35mm-reel-box::after {
              bottom: 58px; /* sits right above transport bar */
            }

            /* Vintage Xenon Projector Lamp Flicker */
            @keyframes vtrXenonFlicker {
              0%, 100% { filter: brightness(1) contrast(1.01); }
              20% { filter: brightness(1.03) contrast(1.03); }
              40% { filter: brightness(0.98) contrast(1.01); }
              60% { filter: brightness(1.02) contrast(1.02); }
              80% { filter: brightness(0.99) contrast(1); }
            }
            .vtr-flicker-active .vtr-35mm-reel-box,
            .vtr-flicker-active .vtr-16mm-projector-box {
              animation: vtrXenonFlicker 3s infinite steps(24);
            }

            /* Film Edge Code Strip (Kodak Eastman 5222 style) */
            .vtr-35mm-edge-text {
              position: absolute;
              left: 20px;
              right: 20px;
              z-index: 6;
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.18em;
              color: #F2923A;
              opacity: 0.75;
              display: flex;
              justify-content: space-between;
              pointer-events: none;
              text-transform: uppercase;
            }
            .vtr-35mm-edge-text.is-top {
              top: 38px;
            }
            .vtr-35mm-edge-text.is-bottom {
              bottom: 96px;
            }

            /* Scrollable Track */
            .vtr-35mm-track {
              display: flex;
              gap: 28px;
              padding: 42px 32px 36px;
              overflow-x: auto;
              scroll-behavior: smooth;
              cursor: grab;
              user-select: none;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .vtr-35mm-track::-webkit-scrollbar {
              display: none;
            }
            .vtr-35mm-track:active {
              cursor: grabbing;
            }

            /* Countdown Leader Cell */
            .vtr-leader-cell {
              flex: 0 0 220px;
              background: #0E0D0B;
              border: 1px dashed rgba(242, 146, 58, 0.4);
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 24px 16px;
              text-align: center;
              position: relative;
            }
            .vtr-leader-target {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 2px solid rgba(242, 146, 58, 0.5);
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 14px;
            }
            .vtr-leader-target::before {
              content: "";
              position: absolute;
              inset: 12px;
              border-radius: 50%;
              border: 1px solid rgba(242, 146, 58, 0.3);
            }
            .vtr-leader-target::after {
              content: "";
              position: absolute;
              width: 100%;
              height: 1px;
              background: rgba(242, 146, 58, 0.4);
            }
            .vtr-leader-number {
              font-family: inherit;
              font-size: 42px;
              font-weight: 800;
              color: #F2923A;
              line-height: 1;
              z-index: 2;
            }

            /* Individual 35mm Poster Negative Frame - NAME ONLY (NO EXTRA CLUTTER) */
            .vtr-poster-frame {
              flex: 0 0 350px;
              background: #050505;
              border: 1px solid rgba(241, 236, 228, 0.12);
              border-radius: 10px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              position: relative;
              transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s, box-shadow 0.3s;
              cursor: pointer;
            }
            @media (max-width: 640px) {
              .vtr-poster-frame {
                flex: 0 0 290px;
              }
            }
            .vtr-poster-frame:hover {
              transform: translateY(-8px) scale(1.02);
              border-color: rgba(242, 146, 58, 0.8);
              box-shadow: 0 20px 45px rgba(0, 0, 0, 0.9), 0 0 24px rgba(242, 146, 58, 0.25);
            }
            .vtr-poster-frame.is-center {
              border-color: rgba(242, 146, 58, 0.5);
            }

            .vtr-frame-header {
              background: #14120F;
              border-bottom: 1px solid rgba(241, 236, 228, 0.08);
              padding: 8px 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-family: monospace;
              font-size: 11px;
              color: rgba(241, 236, 228, 0.6);
              letter-spacing: 0.08em;
            }
            .vtr-frame-id {
              color: #F2923A;
              font-weight: 700;
            }

            .vtr-poster-stage {
              position: relative;
              background: #000;
              min-height: 440px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 14px;
              overflow: hidden;
            }
            .vtr-poster-img {
              width: 100%;
              height: auto;
              max-height: 460px;
              object-fit: contain;
              border-radius: 4px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
              transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .vtr-poster-frame:hover .vtr-poster-img {
              transform: scale(1.03);
            }

            /* Vintage Lens Flare & Light Leak Overlay */
            .vtr-light-leak {
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at 10% 20%, rgba(242, 146, 58, 0.22) 0%, transparent 60%),
                          radial-gradient(circle at 90% 80%, rgba(239, 68, 68, 0.16) 0%, transparent 50%);
              mix-blend-mode: screen;
              opacity: 0.35;
              pointer-events: none;
              transition: opacity 0.3s;
            }
            .vtr-poster-frame:hover .vtr-light-leak {
              opacity: 0.85;
            }

            /* Retro Loupe Magnifier Hover Prompt */
            .vtr-loupe-hover {
              position: absolute;
              inset: 0;
              background: rgba(10, 9, 8, 0.65);
              backdrop-filter: blur(2px);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.25s ease;
            }
            .vtr-poster-frame:hover .vtr-loupe-hover {
              opacity: 1;
            }
            .vtr-loupe-tag {
              background: #F2923A;
              color: #0E0D0C;
              padding: 9px 18px;
              border-radius: 999px;
              font-size: 11.5px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 8px 24px rgba(242, 146, 58, 0.4);
            }

            /* POSTER FOOTER - CLEAN NAME ONLY AS REQUESTED */
            .vtr-frame-footer-clean {
              padding: 14px 16px;
              background: #0E0D0B;
              border-top: 1px solid rgba(241, 236, 228, 0.08);
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
            }
            .vtr-poster-title-only {
              font-size: 16px;
              font-weight: 700;
              color: #F1ECE4;
              margin: 0;
              line-height: 1.3;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            /* Transport Playback Bar */
            .vtr-transport-bar {
              background: #14120F;
              border-top: 1px solid rgba(241, 236, 228, 0.1);
              padding: 12px 24px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              position: relative;
              z-index: 7;
            }
            .vtr-transport-controls {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .vtr-ctrl-btn {
              background: rgba(241, 236, 228, 0.07);
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: #F1ECE4;
              padding: 8px 14px;
              border-radius: 6px;
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .vtr-ctrl-btn:hover {
              background: rgba(242, 146, 58, 0.2);
              border-color: #F2923A;
              color: #F2923A;
            }
            .vtr-frame-stepper {
              display: flex;
              gap: 6px;
              overflow-x: auto;
            }
            .vtr-step-dot {
              width: 32px;
              height: 28px;
              background: #0E0D0B;
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: rgba(241, 236, 228, 0.6);
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            }
            .vtr-step-dot:hover {
              border-color: #F2923A;
              color: #F1ECE4;
            }
            .vtr-step-dot.is-active {
              background: #F2923A;
              border-color: #F2923A;
              color: #0E0D0C;
            }

            /* Light Table Mode - CLEAN NAME ONLY */
            .vtr-light-table-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
              gap: 28px;
              margin-bottom: 70px;
            }
            .vtr-slide-mount {
              background: #171512;
              border: 2px solid #2B2620;
              border-radius: 12px;
              padding: 16px;
              position: relative;
              box-shadow: 0 16px 36px rgba(0,0,0,0.6);
              cursor: pointer;
              transition: transform 0.25s, border-color 0.25s;
            }
            .vtr-slide-mount:hover {
              transform: translateY(-6px);
              border-color: #F2923A;
            }
            .vtr-grease-pencil {
              position: absolute;
              top: 8px;
              right: 14px;
              font-family: monospace;
              font-size: 11px;
              color: #EF4444;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              border: 1px solid rgba(239, 68, 68, 0.4);
              padding: 2px 6px;
              border-radius: 4px;
              transform: rotate(-3deg);
            }
            .vtr-slide-aperture {
              background: #000;
              border-radius: 6px;
              padding: 12px;
              min-height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 12px;
              box-shadow: inset 0 0 20px rgba(0,0,0,0.9);
            }
            .vtr-slide-aperture img {
              max-width: 100%;
              max-height: 420px;
              object-fit: contain;
              border-radius: 3px;
            }
            .vtr-slide-title-only {
              font-size: 17px;
              font-weight: 700;
              color: #F1ECE4;
              margin: 4px 0 0;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            /* ==========================================================================
               SECTION: 16MM MOVIE CAMERA BRAND LOGO REEL (ANIMATED MARQUEE PROJECTION)
               ========================================================================== */
            .vtr-16mm-projector-box {
              position: relative;
              background: #090807;
              border: 2px solid #1C1915;
              border-radius: 16px;
              padding: 28px 0 24px;
              margin-bottom: 70px;
              box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95);
              overflow: hidden;
            }
            /* 16mm Sprocket Holes */
            .vtr-16mm-projector-box::before,
            .vtr-16mm-projector-box::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              height: 26px;
              z-index: 5;
              pointer-events: none;
              background: #14120E;
              -webkit-mask: ${SPROCKET_16} 0 0/24px 26px repeat-x;
              mask: ${SPROCKET_16} 0 0/24px 26px repeat-x;
            }
            .vtr-16mm-projector-box::before {
              top: 0;
            }
            .vtr-16mm-projector-box::after {
              bottom: 54px;
            }

            /* Projector Gate Center Light Beam */
            .vtr-projector-gate-beam {
              position: absolute;
              top: 0;
              bottom: 54px;
              left: 50%;
              width: 2px;
              background: linear-gradient(180deg, transparent, rgba(242, 146, 58, 0.8) 20%, rgba(255, 241, 218, 0.9) 50%, rgba(242, 146, 58, 0.8) 80%, transparent);
              z-index: 8;
              pointer-events: none;
              box-shadow: 0 0 25px rgba(242, 146, 58, 0.8);
            }

            /* Continuous Infinite Gliding 16mm Movie Marquee */
            @keyframes vtrReelMarquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .vtr-16mm-marquee-track {
              display: flex;
              gap: 20px;
              width: max-content;
              padding: 26px 20px;
              animation: vtrReelMarquee 50s linear infinite;
              will-change: transform;
            }
            .vtr-16mm-marquee-track.is-paused,
            .vtr-16mm-marquee-track:hover {
              animation-play-state: paused;
            }

            .vtr-16mm-frame {
              flex: 0 0 240px;
              background: #11100E;
              border: 1px solid rgba(241, 236, 228, 0.1);
              border-radius: 8px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              cursor: pointer;
              transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
            }
            .vtr-16mm-frame:hover {
              transform: translateY(-6px) scale(1.03);
              border-color: #F2923A;
              box-shadow: 0 14px 30px rgba(0,0,0,0.8), 0 0 20px rgba(242, 146, 58, 0.2);
            }

            .vtr-16mm-stage {
              height: 165px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              position: relative;
              background: #080808;
            }
            .vtr-16mm-img {
              max-width: 80%;
              max-height: 80%;
              object-fit: contain;
              filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
              transition: transform 0.3s;
            }
            .vtr-16mm-frame:hover .vtr-16mm-img {
              transform: scale(1.08);
            }

            .vtr-16mm-info {
              padding: 10px 14px;
              background: #141210;
              border-top: 1px solid rgba(241, 236, 228, 0.08);
            }
            .vtr-16mm-title-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
            }
            .vtr-16mm-name {
              font-size: 14px;
              font-weight: 700;
              color: #F1ECE4;
              margin: 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .vtr-16mm-tag {
              font-family: monospace;
              font-size: 9.5px;
              font-weight: 700;
              padding: 2px 5px;
              border-radius: 3px;
              letter-spacing: 0.06em;
              white-space: nowrap;
            }

            /* Logos Contact Sheet Proof Grid */
            .vtr-logos-proof-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
              gap: 18px;
              margin-bottom: 70px;
            }
            @media (max-width: 640px) {
              .vtr-logos-proof-grid {
                grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
                gap: 12px;
              }
            }

            /* ==========================================================================
               DARKROOM ENLARGER & LOUPE INSPECTION MODAL
               ========================================================================== */
            .vtr-darkroom-overlay {
              position: fixed;
              inset: 0;
              background: rgba(8, 7, 6, 0.92);
              backdrop-filter: blur(14px);
              z-index: 99999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
              overflow-y: auto;
            }
            .vtr-darkroom-enlarger {
              background: #161412;
              border: 2px solid rgba(242, 146, 58, 0.4);
              border-radius: 16px;
              max-width: 1080px;
              width: 100%;
              max-height: 92vh;
              overflow-y: auto;
              box-shadow: 0 30px 90px rgba(0, 0, 0, 0.95), 0 0 40px rgba(242, 146, 58, 0.2);
              position: relative;
              display: flex;
              flex-direction: column;
            }
            .vtr-enlarger-header {
              background: #1E1B18;
              border-bottom: 1px solid rgba(241, 236, 228, 0.1);
              padding: 12px 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-family: monospace;
              font-size: 12px;
              color: rgba(241, 236, 228, 0.7);
            }
            .vtr-enlarger-close-btn {
              background: rgba(241, 236, 228, 0.1);
              border: none;
              color: #F1ECE4;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
            }
            .vtr-enlarger-close-btn:hover {
              background: #EF4444;
              color: #FFF;
            }

            @media (min-width: 880px) {
              .vtr-enlarger-body {
                display: grid;
                grid-template-columns: 1.25fr 1fr;
              }
            }
            .vtr-enlarger-stage {
              background: #0A0908;
              padding: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              min-height: 420px;
              border-bottom: 1px solid rgba(241, 236, 228, 0.1);
              transition: background 0.3s;
            }
            @media (min-width: 880px) {
              .vtr-enlarger-stage {
                border-bottom: none;
                border-right: 1px solid rgba(241, 236, 228, 0.1);
              }
            }
            .vtr-enlarger-stage.is-darkroom {
              background: #090807;
            }
            .vtr-enlarger-stage.is-tungsten {
              background: #211B14;
            }
            .vtr-enlarger-stage.is-daylight {
              background: #FAF8F5;
            }
            .vtr-enlarger-stage img {
              max-width: 100%;
              max-height: 68vh;
              object-fit: contain;
              border-radius: 6px;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
              transition: transform 0.3s ease;
            }
            .vtr-enlarger-stage.is-loupe-zoom img {
              transform: scale(1.4);
              cursor: zoom-out;
            }

            .vtr-enlarger-sidebar {
              padding: 32px;
              display: flex;
              flex-direction: column;
            }
            .vtr-light-switch-bar {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 24px;
            }
            .vtr-lamp-btn {
              padding: 5px 12px;
              font-family: monospace;
              font-size: 11px;
              background: transparent;
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: rgba(241, 236, 228, 0.7);
              border-radius: 6px;
              cursor: pointer;
            }
            .vtr-lamp-btn.is-active {
              background: rgba(242, 146, 58, 0.2);
              border-color: #F2923A;
              color: #F2923A;
              font-weight: 700;
            }
            .vtr-modal-nav-row {
              display: flex;
              gap: 12px;
              margin-top: 24px;
              padding-top: 20px;
              border-top: 1px solid rgba(241, 236, 228, 0.1);
            }
            .vtr-modal-nav-btn {
              flex: 1;
              background: rgba(241, 236, 228, 0.06);
              border: 1px solid rgba(241, 236, 228, 0.15);
              color: #F1ECE4;
              padding: 10px;
              border-radius: 8px;
              font-family: inherit;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            }
            .vtr-modal-nav-btn:hover {
              background: rgba(242, 146, 58, 0.18);
              border-color: #F2923A;
              color: #F2923A;
            }
          `
        }}
      />

      <div className="vtr-wrap">
        {/* Retro Camera Viewfinder HUD */}
        <div className="vtr-viewfinder" aria-label="Camera Viewfinder HUD">
          <div className="vtr-hud-left">
            <span className="vtr-rec-pill">
              <span className="vtr-rec-dot" />
              <span>REC</span>
            </span>
            <span className="vtr-timecode">{timecode}</span>
            <span className="vtr-specs-badge">24 FPS · 1/50 SEC · f/2.8 · ISO 400TX · 35MM ANA-PRIME</span>
          </div>

          <div className="vtr-hud-right">
            <button
              className={`vtr-hud-toggle-btn ${filmFlicker ? 'is-active' : ''}`}
              onClick={() => setFilmFlicker(!filmFlicker)}
              title="Toggle vintage film flicker & grain simulation"
            >
              <span>🎞️</span>
              <span>{filmFlicker ? 'VINTAGE FLICKER ON' : 'FLICKER OFF'}</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <header>
          <Eyebrow text="ROLL 08 — VINTAGE 35MM & 16MM CAMERA VAULT" M={M} />
          <Head
            text="Cinematic posters & *vector marks*."
            D={D}
            size="clamp(38px, 4.6vw, 66px)"
            lh={0.96}
            style={{ fontWeight: 760, fontStretch: '115%', marginBottom: '16px' }}
          />
          <p
            style={{
              fontSize: 'clamp(16px, 1.25vw, 19px)',
              lineHeight: 1.6,
              color: 'rgba(241, 236, 228, 0.75)',
              maxWidth: '720px',
              margin: '0 0 32px',
            }}
          >
            Presented in authentic vintage 35mm film canister reels and 16mm projection gates. Commercial advertising posters, FMCG packaging die-lines, and 30 vector insignias.
          </p>
        </header>

        {/* Category Switcher Tabs */}
        <div className="vtr-nav-tabs" role="tablist">
          <button
            className={`vtr-tab ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('all')}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            <span>All Vault Artifacts</span>
            <span className="vtr-tab-count">{postersData.length + logosData.length}</span>
          </button>
          <button
            className={`vtr-tab ${activeTab === 'posters' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('posters')}
            role="tab"
            aria-selected={activeTab === 'posters'}
          >
            <span>35mm Posters & Packaging</span>
            <span className="vtr-tab-count">{postersData.length}</span>
          </button>
          <button
            className={`vtr-tab ${activeTab === 'logos' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('logos')}
            role="tab"
            aria-selected={activeTab === 'logos'}
          >
            <span>16mm Brand Identities</span>
            <span className="vtr-tab-count">{logosData.length}</span>
          </button>
        </div>

        {/* ====================================================================
            SECTION 1: 35MM POSTERS & PACKAGING (VINTAGE CANISTER REEL)
            ==================================================================== */}
        {(activeTab === 'all' || activeTab === 'posters') && (
          <section id="posters-vault">
            <div className="vtr-section-hdr">
              <div className="vtr-sec-title-wrap">
                <ReelSpool size={38} spinning={posterAutoPlay && posterMode === 'reel'} />
                <h2 className="vtr-sec-title">
                  <span>Posters & Packaging</span>
                  <span style={{ fontSize: '15px', color: '#F2923A', fontWeight: 400 }}>
                    ({postersData.length} Frames)
                  </span>
                </h2>
                <span className="vtr-sec-roll-badge">ROLL 08-A · 35MM SAFETY FILM</span>
              </div>

              {/* View toggle */}
              <div className="vtr-view-toggle-bar">
                <button
                  className={`vtr-view-btn ${posterMode === 'reel' ? 'is-active' : ''}`}
                  onClick={() => setPosterMode('reel')}
                >
                  <span>🎞️ 35mm Canister Reel</span>
                </button>
                <button
                  className={`vtr-view-btn ${posterMode === 'table' ? 'is-active' : ''}`}
                  onClick={() => setPosterMode('table')}
                >
                  <span>💡 Light Table Grid</span>
                </button>
              </div>
            </div>

            {/* 35MM REEL PRESENTATION */}
            {posterMode === 'reel' ? (
              <div className="vtr-35mm-reel-box">
                {/* Edge Kodachrome codes */}
                <div className="vtr-35mm-edge-text is-top">
                  <span>EASTMAN 5222</span>
                  <span>SAFETY FILM</span>
                  <span>35MM EXPOSURE</span>
                  <span>ROLL SB-08</span>
                </div>
                <div className="vtr-35mm-edge-text is-bottom">
                  <span>▸▸ KODAK 400TX</span>
                  <span>FRAME 01 ◂▸ 08</span>
                  <span>ISO 400</span>
                  <span>SHEELASH STUDIO</span>
                </div>

                {/* Film Track */}
                <div
                  ref={posterReelRef}
                  className="vtr-35mm-track"
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onScroll={handlePosterScroll}
                >
                  {/* Countdown Leader Frame */}
                  <div className="vtr-leader-cell" aria-hidden="true">
                    <div className="vtr-leader-target">
                      <span className="vtr-leader-number">3</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F2923A', letterSpacing: '0.1em' }}>
                      START LEADER
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(241,236,228,0.5)', marginTop: '4px' }}>
                      35MM · 8 FRAMES
                    </span>
                  </div>

                  {/* 8 Poster Negative Frames - CLEAN NAME ONLY AS REQUESTED */}
                  {postersData.map((poster, idx) => (
                    <article
                      key={poster.id}
                      className={`vtr-poster-frame ${currentPosterFrame === idx ? 'is-center' : ''}`}
                      onClick={() => openPoster(poster, idx)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openPoster(poster, idx)}
                      aria-label={`Inspect ${poster.title}`}
                    >
                      <div className="vtr-frame-header">
                        <span className="vtr-frame-id">FRAME {pad(idx + 1)}</span>
                        <span>{poster.year}</span>
                      </div>

                      <div className="vtr-poster-stage">
                        <img
                          src={poster.image}
                          alt={poster.title}
                          className="vtr-poster-img"
                          loading="lazy"
                        />
                        <div className="vtr-light-leak" />
                        <div className="vtr-loupe-hover">
                          <span className="vtr-loupe-tag">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              <line x1="11" y1="8" x2="11" y2="14" />
                              <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                            <span>Inspect Loupe</span>
                          </span>
                        </div>
                      </div>

                      {/* CLEAN FOOTER - NAME ONLY */}
                      <div className="vtr-frame-footer-clean">
                        <h3 className="vtr-poster-title-only" title={poster.title}>
                          {poster.title}
                        </h3>
                        <span style={{ color: '#F2923A', fontSize: '13px' }}>↗</span>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Transport Controls Bar */}
                <div className="vtr-transport-bar">
                  <div className="vtr-transport-controls">
                    <button
                      className="vtr-ctrl-btn"
                      onClick={() => {
                        const prev = Math.max(0, currentPosterFrame - 1);
                        scrollPosterTo(prev);
                      }}
                      title="Step back one frame"
                    >
                      <span>◄ PREV</span>
                    </button>
                    <button
                      className="vtr-ctrl-btn"
                      onClick={() => setPosterAutoPlay(!posterAutoPlay)}
                      title="Auto advance reel"
                    >
                      <span>{posterAutoPlay ? '⏸ PAUSE REEL' : '▶ AUTO GLIDE'}</span>
                    </button>
                    <button
                      className="vtr-ctrl-btn"
                      onClick={() => {
                        const next = Math.min(postersData.length - 1, currentPosterFrame + 1);
                        scrollPosterTo(next);
                      }}
                      title="Step forward one frame"
                    >
                      <span>NEXT ►</span>
                    </button>
                  </div>

                  {/* Frame Stepper Numbers */}
                  <div className="vtr-frame-stepper">
                    {postersData.map((_, i) => (
                      <button
                        key={i}
                        className={`vtr-step-dot ${currentPosterFrame === i ? 'is-active' : ''}`}
                        onClick={() => scrollPosterTo(i)}
                      >
                        {pad(i + 1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* LIGHT TABLE GLASS GRID PRESENTATION - CLEAN NAME ONLY */
              <div className="vtr-light-table-grid">
                {postersData.map((poster, idx) => (
                  <article
                    key={poster.id}
                    className="vtr-slide-mount"
                    onClick={() => openPoster(poster, idx)}
                  >
                    <span className="vtr-grease-pencil">#{pad(idx + 1)}</span>
                    <div className="vtr-slide-aperture">
                      <img src={poster.image} alt={poster.title} loading="lazy" />
                    </div>
                    <h3 className="vtr-slide-title-only" title={poster.title}>
                      {poster.title}
                    </h3>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ====================================================================
            SECTION 2: 16MM MOVIE CAMERA BRAND LOGO REEL (ANIMATED MARQUEE PROJECTION)
            ==================================================================== */}
        {(activeTab === 'all' || activeTab === 'logos') && (
          <section id="logos-vault">
            <div className="vtr-section-hdr">
              <div className="vtr-sec-title-wrap">
                <ReelSpool size={38} spinning={logoAutoPlay && logoMode === 'reel'} />
                <h2 className="vtr-sec-title">
                  <span>Brand Identities & Logomarks</span>
                  <span style={{ fontSize: '15px', color: '#F2923A', fontWeight: 400 }}>
                    ({logosData.length} Insignias)
                  </span>
                </h2>
                <span className="vtr-sec-roll-badge">ROLL 08-B · 16MM MOVIE REEL</span>
              </div>

              {/* View toggle */}
              <div className="vtr-view-toggle-bar">
                <button
                  className={`vtr-view-btn ${logoMode === 'reel' ? 'is-active' : ''}`}
                  onClick={() => setLogoMode('reel')}
                >
                  <span>🎞️ 16mm Projector Reel</span>
                </button>
                <button
                  className={`vtr-view-btn ${logoMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setLogoMode('grid')}
                >
                  <span>📋 Contact Proof Sheet</span>
                </button>
              </div>
            </div>

            {/* 16MM PROJECTOR REEL - CONTINUOUS ANIMATED GLIDE */}
            {logoMode === 'reel' ? (
              <div className="vtr-16mm-projector-box">
                <div className="vtr-projector-gate-beam" title="Center Projection Gate" />

                {/* Animated Marquee Reel */}
                <div className={`vtr-16mm-marquee-track ${!logoAutoPlay ? 'is-paused' : ''}`}>
                  {infiniteLogos.map((logo, idx) => (
                    <article
                      key={`${logo.id}-${idx}`}
                      className="vtr-16mm-frame"
                      onClick={() => openLogo(logo, idx % logosData.length)}
                    >
                      <div
                        className="vtr-16mm-stage"
                        style={{
                          background: logo.bgColor || '#0E0D0C',
                        }}
                      >
                        <img
                          src={logo.image}
                          alt={logo.title}
                          className="vtr-16mm-img"
                          loading="lazy"
                        />
                      </div>

                      <div className="vtr-16mm-info">
                        <div className="vtr-16mm-title-row">
                          <h3 className="vtr-16mm-name">{logo.title}</h3>
                          <span
                            className="vtr-16mm-tag"
                            style={{
                              background: `${logo.accentColor || '#F2923A'}20`,
                              color: logo.accentColor || '#F2923A',
                              border: `1px solid ${logo.accentColor || '#F2923A'}40`,
                            }}
                          >
                            {logo.tagText || 'LOGO'}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Transport Bar for 16mm Logo Reel */}
                <div className="vtr-transport-bar">
                  <div className="vtr-transport-controls">
                    <button
                      className="vtr-ctrl-btn"
                      onClick={() => setLogoAutoPlay(!logoAutoPlay)}
                      title="Pause or resume the continuous 16mm projection reel"
                    >
                      <span>{logoAutoPlay ? '⏸ PAUSE PROJECTOR' : '▶ RUN PROJECTOR'}</span>
                    </button>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(241,236,228,0.5)', marginLeft: '8px' }}>
                      HOVER ANY FRAME TO INSPECT
                    </span>
                  </div>

                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F2923A' }}>
                    16MM FILM CONVEYOR · 30 MARKS
                  </span>
                </div>
              </div>
            ) : (
              /* LOGOS PROOF CONTACT SHEET GRID */
              <div className="vtr-logos-proof-grid">
                {logosData.map((logo, idx) => (
                  <article
                    key={logo.id}
                    className="vtr-16mm-frame"
                    onClick={() => openLogo(logo, idx)}
                    style={{ flex: 'none' }}
                  >
                    <div
                      className="vtr-16mm-stage"
                      style={{
                        background: logo.bgColor || '#0E0D0C',
                        height: '160px',
                      }}
                    >
                      <img
                        src={logo.image}
                        alt={logo.title}
                        className="vtr-16mm-img"
                        loading="lazy"
                      />
                    </div>

                    <div className="vtr-16mm-info">
                      <div className="vtr-16mm-title-row">
                        <h3 className="vtr-16mm-name">{logo.title}</h3>
                        <span
                          className="vtr-16mm-tag"
                          style={{
                            background: `${logo.accentColor || '#F2923A'}20`,
                            color: logo.accentColor || '#F2923A',
                            border: `1px solid ${logo.accentColor || '#F2923A'}40`,
                          }}
                        >
                          {logo.tagText || 'MARK'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ====================================================================
          VINTAGE DARKROOM ENLARGER & LOUPE LIGHTBOX (POSTERS)
          ==================================================================== */}
      {selectedPoster && (
        <div
          className="vtr-darkroom-overlay"
          onClick={() => setSelectedPoster(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPoster.title}
        >
          <div
            className="vtr-darkroom-enlarger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vtr-enlarger-header">
              <span>DARKROOM ENLARGER // 35MM SLIDE DOSSIER #{pad(selectedPosterIdx + 1)}</span>
              <button
                className="vtr-enlarger-close-btn"
                onClick={() => setSelectedPoster(null)}
                aria-label="Close enlarger"
              >
                ✕
              </button>
            </div>

            <div className="vtr-enlarger-body">
              {/* Media Stage */}
              <div
                className={`vtr-enlarger-stage is-${posterSurface} ${loupeActive ? 'is-loupe-zoom' : ''}`}
                onClick={() => setLoupeActive(!loupeActive)}
                title="Click image to toggle 1.4x loupe magnification"
              >
                <img
                  src={selectedPoster.image}
                  alt={selectedPoster.title}
                />
              </div>

              {/* Sidebar Specifications */}
              <div className="vtr-enlarger-sidebar">
                {/* Darkroom Lamp Surface Toggle */}
                <div className="vtr-light-switch-bar">
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(241,236,228,0.5)', marginRight: '4px' }}>
                    ILLUMINATION:
                  </span>
                  <button
                    className={`vtr-lamp-btn ${posterSurface === 'darkroom' ? 'is-active' : ''}`}
                    onClick={() => setPosterSurface('darkroom')}
                  >
                    Darkroom
                  </button>
                  <button
                    className={`vtr-lamp-btn ${posterSurface === 'tungsten' ? 'is-active' : ''}`}
                    onClick={() => setPosterSurface('tungsten')}
                  >
                    Tungsten 3200K
                  </button>
                  <button
                    className={`vtr-lamp-btn ${posterSurface === 'daylight' ? 'is-active' : ''}`}
                    onClick={() => setPosterSurface('daylight')}
                  >
                    Daylight 5600K
                  </button>
                </div>

                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#F2923A',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  {selectedPoster.category} · {selectedPoster.year}
                </span>

                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 10px', color: '#F1ECE4' }}>
                  {selectedPoster.title}
                </h2>

                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(241,236,228,0.8)', margin: '0 0 20px' }}>
                  {selectedPoster.desc}
                </p>

                {/* Specs Docket */}
                <div
                  style={{
                    background: 'rgba(241,236,228,0.03)',
                    border: '1px solid rgba(241,236,228,0.08)',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '12.5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(241,236,228,0.5)', fontFamily: 'monospace' }}>CLIENT:</span>
                    <span style={{ fontWeight: 600 }}>{selectedPoster.client}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(241,236,228,0.5)', fontFamily: 'monospace' }}>DIMENSIONS:</span>
                    <span style={{ fontFamily: 'monospace' }}>{selectedPoster.dimensions}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(241,236,228,0.5)', fontFamily: 'monospace' }}>PRINT FORMAT:</span>
                    <span>{selectedPoster.format}</span>
                  </div>
                </div>

                {/* Deliverables */}
                {selectedPoster.deliverables && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4
                      style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: 'rgba(241,236,228,0.5)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        margin: '0 0 8px',
                      }}
                    >
                      Production Deliverables:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedPoster.deliverables.map((d, i) => (
                        <span key={i} className="vtr-mini-tag" style={{ background: 'rgba(242,146,58,0.1)', color: '#F2923A', borderColor: 'rgba(242,146,58,0.2)' }}>
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="vtr-modal-nav-row">
                  <button
                    className="vtr-modal-nav-btn"
                    onClick={() => {
                      const prev = (selectedPosterIdx - 1 + postersData.length) % postersData.length;
                      setSelectedPosterIdx(prev);
                      setSelectedPoster(postersData[prev]);
                    }}
                  >
                    <span>◄ Previous Frame</span>
                  </button>
                  <button
                    className="vtr-modal-nav-btn"
                    onClick={() => {
                      const next = (selectedPosterIdx + 1) % postersData.length;
                      setSelectedPosterIdx(next);
                      setSelectedPoster(postersData[next]);
                    }}
                  >
                    <span>Next Frame ►</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VINTAGE LOGOMARK ENLARGER LIGHTBOX (LOGOS)
          ==================================================================== */}
      {selectedLogo && (
        <div
          className="vtr-darkroom-overlay"
          onClick={() => setSelectedLogo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedLogo.title}
        >
          <div
            className="vtr-darkroom-enlarger"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '880px' }}
          >
            <div className="vtr-enlarger-header">
              <span>16MM VECTOR SPEC // INSIGNIA #{pad(selectedLogoIdx + 1)}</span>
              <button
                className="vtr-enlarger-close-btn"
                onClick={() => setSelectedLogo(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="vtr-enlarger-body" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* Logo Stage */}
              <div
                className="vtr-enlarger-stage"
                style={{
                  background: logoSurface === 'brand' ? (selectedLogo.bgColor || '#0E0D0C') : '#FFFFFF',
                  minHeight: '340px',
                }}
              >
                <img
                  src={selectedLogo.image}
                  alt={selectedLogo.title}
                  style={{ maxHeight: '220px', maxWidth: '85%' }}
                />
              </div>

              {/* Sidebar */}
              <div className="vtr-enlarger-sidebar">
                <div className="vtr-light-switch-bar">
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(241,236,228,0.5)', marginRight: '4px' }}>
                    STAGE SURFACE:
                  </span>
                  <button
                    className={`vtr-lamp-btn ${logoSurface === 'brand' ? 'is-active' : ''}`}
                    onClick={() => setLogoSurface('brand')}
                  >
                    Brand Tone
                  </button>
                  <button
                    className={`vtr-lamp-btn ${logoSurface === 'white' ? 'is-active' : ''}`}
                    onClick={() => setLogoSurface('white')}
                  >
                    Pure White
                  </button>
                </div>

                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: selectedLogo.accentColor || '#F2923A',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  {selectedLogo.category} · {selectedLogo.year}
                </span>

                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 10px', color: '#F1ECE4' }}>
                  {selectedLogo.title}
                </h2>

                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(241,236,228,0.8)', margin: '0 0 18px' }}>
                  {selectedLogo.desc}
                </p>

                <div
                  style={{
                    background: 'rgba(241,236,228,0.03)',
                    border: '1px solid rgba(241,236,228,0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12.5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(241,236,228,0.5)', fontFamily: 'monospace' }}>CLIENT:</span>
                    <span style={{ fontWeight: 600 }}>{selectedLogo.client}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(241,236,228,0.5)', fontFamily: 'monospace' }}>SECTOR:</span>
                    <span>{selectedLogo.industry}</span>
                  </div>
                </div>

                {selectedLogo.deliverables && (
                  <div>
                    <h4
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'monospace',
                        color: 'rgba(241,236,228,0.5)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        margin: '0 0 8px',
                      }}
                    >
                      Vector Deliverables:
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedLogo.deliverables.map((d, i) => (
                        <span key={i} className="vtr-mini-tag" style={{ background: 'rgba(242,146,58,0.1)', color: '#F2923A', borderColor: 'rgba(242,146,58,0.2)' }}>
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="vtr-modal-nav-row">
                  <button
                    className="vtr-modal-nav-btn"
                    onClick={() => {
                      const prev = (selectedLogoIdx - 1 + logosData.length) % logosData.length;
                      setSelectedLogoIdx(prev);
                      setSelectedLogo(logosData[prev]);
                    }}
                  >
                    <span>◄ Previous Mark</span>
                  </button>
                  <button
                    className="vtr-modal-nav-btn"
                    onClick={() => {
                      const next = (selectedLogoIdx + 1) % logosData.length;
                      setSelectedLogoIdx(next);
                      setSelectedLogo(logosData[next]);
                    }}
                  >
                    <span>Next Mark ►</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
