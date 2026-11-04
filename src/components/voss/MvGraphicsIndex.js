'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FONTS,
  colorsOf,
  fontsOf,
  cssVars,
  useFonts,
  useLive,
  useReduced,
  useOn,
  Eyebrow,
  Head,
  CSS_BASE,
  CSS_MOTION,
  siteFontCss,
} from './scaffold';
import { postersData } from '@/data/postersData';
import { logosData } from '@/data/logosData';

const pad = (n) => String(n).padStart(2, '0');

// Authentic sprocket perforation masks from Voss film system
const SPROCKET_35 = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='30'><rect x='7' y='8' width='12' height='14' rx='3'/></svg>")`;

// Primary theme tokens exactly matching Hire Me button & Header logo
const THEME_ACCENT = '#FF5B2E';
const THEME_ACCENT_HOVER = '#FF6B35';
const THEME_BG = '#141210';
const THEME_FILM = '#0E0D0C';
const THEME_TEXT = '#F1ECE4';
const THEME_MUTED = 'rgba(241, 236, 228, 0.65)';
const THEME_BORDER = 'rgba(241, 236, 228, 0.12)';

export default function MvGraphicsIndex(props = {}) {
  const c = colorsOf(props);
  const { D, B, M } = fontsOf(props);
  useFonts();
  const live = useLive();
  const rm = useReduced();

  const rootRef = useRef(null);
  const on = useOn(rootRef, live, rm, 0.05);

  const [activeTab, setActiveTab] = useState('all');

  /* Inspection Modals */
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedPosterIdx, setSelectedPosterIdx] = useState(0);
  const [posterSurface, setPosterSurface] = useState('dark');
  const [loupeActive, setLoupeActive] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoIdx, setSelectedLogoIdx] = useState(0);
  const [logoSurface, setLogoSurface] = useState('dark');

  /* Keyboard Navigation for Modals */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPoster(null);
        setSelectedLogo(null);
      }
      if (selectedPoster) {
        if (e.key === 'ArrowRight') {
          const next = (selectedPosterIdx + 1) % postersData.length;
          setSelectedPosterIdx(next);
          setSelectedPoster(postersData[next]);
        }
        if (e.key === 'ArrowLeft') {
          const prev = (selectedPosterIdx - 1 + postersData.length) % postersData.length;
          setSelectedPosterIdx(prev);
          setSelectedPoster(postersData[prev]);
        }
      }
      if (selectedLogo) {
        if (e.key === 'ArrowRight') {
          const next = (selectedLogoIdx + 1) % logosData.length;
          setSelectedLogoIdx(next);
          setSelectedLogo(logosData[next]);
        }
        if (e.key === 'ArrowLeft') {
          const prev = (selectedLogoIdx - 1 + logosData.length) % logosData.length;
          setSelectedLogoIdx(prev);
          setSelectedLogo(logosData[prev]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPoster, selectedPosterIdx, selectedLogo, selectedLogoIdx]);

  const CSS = `
    .mvg-wrap {
      max-width: 1400px;
      margin: 0 auto;
      padding: 120px 32px 100px;
    }
    @media (max-width: 768px) {
      .mvg-wrap { padding: 96px 20px 60px; }
    }

    /* ── Header ── */
    .mvg-hero {
      margin-bottom: 48px;
    }
    .mvg-hero-desc {
      font-size: clamp(15px, 1.2vw, 17px);
      line-height: 1.6;
      color: ${THEME_MUTED};
      max-width: 680px;
      margin: 14px 0 0;
    }

    /* ── Navigation Tabs ── */
    .mvg-tabs {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid ${THEME_BORDER};
      padding-bottom: 20px;
      margin-bottom: 56px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .mvg-tabs::-webkit-scrollbar { display: none; }
    .mvg-tab {
      appearance: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
      padding: 10px 16px;
      border-radius: 10px;
      background: transparent;
      border: 1px solid rgba(241, 236, 228, 0.18);
      color: ${THEME_TEXT};
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.2s;
      white-space: nowrap;
    }
    .mvg-tab:hover {
      border-color: rgba(255, 91, 46, 0.6);
      background: rgba(255, 91, 46, 0.08);
      color: #FFFFFF;
    }
    .mvg-tab.is-active {
      background: ${THEME_ACCENT};
      color: #0E0D0C;
      border-color: ${THEME_ACCENT};
      font-weight: 750;
      box-shadow: 0 4px 18px rgba(255, 91, 46, 0.35);
    }
    .mvg-tab-badge {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 11px;
      line-height: 1;
      padding: 2px 7px;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }
    .mvg-tab.is-active .mvg-tab-badge {
      background: rgba(14, 13, 12, 0.22);
      color: #0E0D0C;
      font-weight: 700;
    }
    .mvg-tab:not(.is-active) .mvg-tab-badge {
      background: rgba(255, 91, 46, 0.14);
      color: ${THEME_ACCENT};
    }

    /* ── Section Header ── */
    .mvg-sec-hdr {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }
    .mvg-sec-title {
      font-size: clamp(22px, 2.2vw, 30px);
      font-weight: 760;
      color: ${THEME_TEXT};
      margin: 0;
      letter-spacing: -0.02em;
    }
    .mvg-roll-spec {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: ${THEME_ACCENT};
      background: rgba(255, 91, 46, 0.08);
      border: 1px solid rgba(255, 91, 46, 0.28);
      padding: 5px 12px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* ── POSTER GRID ── */
    .mvg-poster-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 26px;
      margin-bottom: 80px;
    }
    @media (max-width: 640px) {
      .mvg-poster-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .mvg-poster-card {
      background: ${THEME_FILM};
      border: 1px solid ${THEME_BORDER};
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s, box-shadow 0.25s;
      display: flex;
      flex-direction: column;
    }
    .mvg-poster-card:hover {
      transform: translateY(-6px);
      border-color: rgba(255, 91, 46, 0.65);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 91, 46, 0.2);
    }

    /* Film strip frame edge bar */
    .mvg-poster-strip-bar {
      height: 24px;
      background: #090807;
      border-bottom: 1px solid rgba(241, 236, 228, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10px;
      color: rgba(241, 236, 228, 0.5);
      letter-spacing: 0.1em;
    }
    .mvg-poster-strip-bar span b {
      color: ${THEME_ACCENT};
      font-weight: 700;
    }

    .mvg-poster-stage {
      background: #000;
      aspect-ratio: 3/4;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .mvg-poster-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .mvg-poster-card:hover .mvg-poster-img {
      transform: scale(1.04);
    }

    /* Hover inspection cue */
    .mvg-poster-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(14, 13, 12, 0.88) 100%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: flex-end;
      padding: 16px;
    }
    .mvg-poster-card:hover .mvg-poster-overlay {
      opacity: 1;
    }
    .mvg-poster-loupe-tag {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10px;
      font-weight: 700;
      color: ${THEME_ACCENT};
      background: rgba(14, 13, 12, 0.92);
      border: 1px solid rgba(255, 91, 46, 0.45);
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    /* Card footer — Title only */
    .mvg-poster-footer {
      padding: 14px 16px;
      background: #111009;
      border-top: 1px solid rgba(241, 236, 228, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .mvg-poster-title {
      font-size: 14px;
      font-weight: 700;
      color: ${THEME_TEXT};
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }
    .mvg-card-arrow {
      color: ${THEME_ACCENT};
      font-size: 14px;
      flex-shrink: 0;
      transition: transform 0.2s;
    }
    .mvg-poster-card:hover .mvg-card-arrow {
      transform: translate(2px, -2px);
    }

    /* ── DIVIDER ── */
    .mvg-divider {
      border: none;
      border-top: 1px solid ${THEME_BORDER};
      margin: 70px 0 60px;
    }

    /* ── VINTAGE CAMERA & VIDEOGRAPHY FILM REEL LOGO GRID ── */
    .mvg-logo-reel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 22px;
      margin-bottom: 80px;
    }
    @media (max-width: 640px) {
      .mvg-logo-reel-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 14px;
      }
    }

    /* Individual Film Reel Negative Cell */
    .mvg-reel-cell {
      position: relative;
      background: ${THEME_FILM};
      border: 1px solid ${THEME_BORDER};
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s, box-shadow 0.25s;
    }
    .mvg-reel-cell:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 91, 46, 0.65);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 91, 46, 0.2);
    }

    /* Top and bottom continuous camera reel sprocket bars */
    .mvg-reel-sprocket {
      position: relative;
      height: 22px;
      background: #080706;
      border-bottom: 1px solid rgba(241, 236, 228, 0.05);
      overflow: hidden;
    }
    .mvg-reel-sprocket.is-bottom {
      border-bottom: none;
      border-top: 1px solid rgba(241, 236, 228, 0.05);
    }
    .mvg-reel-sprocket::before {
      content: "";
      position: absolute;
      inset: 0;
      background: #14120E;
      -webkit-mask: ${SPROCKET_35} 0 0/22px 24px repeat-x;
      mask: ${SPROCKET_35} 0 0/22px 24px repeat-x;
      pointer-events: none;
    }
    .mvg-reel-sprocket-text {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: rgba(255, 91, 46, 0.85);
      text-transform: uppercase;
      z-index: 2;
    }
    .mvg-reel-sprocket.is-bottom .mvg-reel-sprocket-text {
      right: auto;
      left: 8px;
    }

    /* 35mm Frame Negative Canvas */
    .mvg-reel-stage {
      position: relative;
      height: 160px;
      background: #060605;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
    }
    .mvg-reel-stage::after {
      content: "";
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.85);
      pointer-events: none;
    }
    .mvg-reel-logo-img {
      max-width: 82%;
      max-height: 82%;
      object-fit: contain;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
      transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
      z-index: 2;
    }
    .mvg-reel-cell:hover .mvg-reel-logo-img {
      transform: scale(1.08);
    }

    /* Light leak on frame hover */
    .mvg-reel-leak {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 10% 20%, rgba(255, 91, 46, 0.22) 0%, transparent 60%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      z-index: 3;
    }
    .mvg-reel-cell:hover .mvg-reel-leak {
      opacity: 1;
    }

    /* Footer label strip */
    .mvg-reel-info {
      padding: 10px 14px;
      background: #111009;
      border-top: 1px solid rgba(241, 236, 228, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .mvg-reel-name {
      font-size: 13px;
      font-weight: 700;
      color: ${THEME_TEXT};
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mvg-reel-tag {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      background: rgba(255, 91, 46, 0.12);
      border: 1px solid rgba(255, 91, 46, 0.28);
      color: ${THEME_ACCENT};
      white-space: nowrap;
      flex-shrink: 0;
      letter-spacing: 0.06em;
    }

    /* ── DARKROOM MODAL (INSPECTION DOSSIER) ── */
    .mvg-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 9, 8, 0.92);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    }
    .mvg-modal {
      background: #161412;
      border: 1.5px solid rgba(255, 91, 46, 0.4);
      border-radius: 14px;
      max-width: 1000px;
      width: 100%;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 91, 46, 0.15);
      display: flex;
      flex-direction: column;
    }
    .mvg-modal-head {
      background: #1C1916;
      border-bottom: 1px solid ${THEME_BORDER};
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 11px;
      color: rgba(241, 236, 228, 0.65);
      letter-spacing: 0.08em;
    }
    .mvg-modal-close {
      background: rgba(241, 236, 228, 0.08);
      border: none;
      color: ${THEME_TEXT};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .mvg-modal-close:hover {
      background: #EF4444;
      color: #FFF;
    }

    @media (min-width: 860px) {
      .mvg-modal-body {
        display: grid;
        grid-template-columns: 1.25fr 1fr;
      }
    }
    .mvg-modal-stage {
      background: #080807;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      min-height: 380px;
      position: relative;
      border-bottom: 1px solid ${THEME_BORDER};
    }
    @media (min-width: 860px) {
      .mvg-modal-stage {
        border-bottom: none;
        border-right: 1px solid ${THEME_BORDER};
      }
    }
    .mvg-modal-stage img {
      max-width: 100%;
      max-height: 64vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
      transition: transform 0.3s;
    }
    .mvg-modal-stage.is-zoomed img {
      transform: scale(1.4);
      cursor: zoom-out;
    }

    .mvg-modal-side {
      padding: 28px;
      display: flex;
      flex-direction: column;
    }
    .mvg-surface-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 20px;
    }
    .mvg-surf-label {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10px;
      color: rgba(241, 236, 228, 0.4);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-right: 4px;
    }
    .mvg-surf-btn {
      padding: 4px 10px;
      border: 1px solid ${THEME_BORDER};
      background: transparent;
      color: rgba(241, 236, 228, 0.7);
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.18s;
    }
    .mvg-surf-btn.is-active {
      background: rgba(255, 91, 46, 0.2);
      border-color: ${THEME_ACCENT};
      color: ${THEME_ACCENT};
      font-weight: 700;
    }

    .mvg-modal-eyebrow {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10.5px;
      color: ${THEME_ACCENT};
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .mvg-modal-title {
      font-size: 22px;
      font-weight: 750;
      color: ${THEME_TEXT};
      margin: 0 0 10px;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }
    .mvg-modal-desc {
      font-size: 13.5px;
      line-height: 1.6;
      color: ${THEME_MUTED};
      margin: 0 0 20px;
    }

    .mvg-modal-meta-box {
      background: rgba(241, 236, 228, 0.03);
      border: 1px solid rgba(241, 236, 228, 0.07);
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
    }
    .mvg-meta-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .mvg-meta-key {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 10px;
      color: rgba(241, 236, 228, 0.4);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .mvg-meta-val {
      font-weight: 600;
      color: ${THEME_TEXT};
      text-align: right;
    }

    .mvg-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
    }
    .mvg-tag-item {
      font-family: var(--mv-font-m, 'Chivo Mono'), monospace;
      font-size: 9.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255, 91, 46, 0.1);
      border: 1px solid rgba(255, 91, 46, 0.25);
      color: ${THEME_ACCENT};
    }

    .mvg-modal-nav {
      display: flex;
      gap: 10px;
      margin-top: auto;
      padding-top: 18px;
      border-top: 1px solid rgba(241, 236, 228, 0.07);
    }
    .mvg-nav-btn {
      flex: 1;
      padding: 10px;
      background: rgba(241, 236, 228, 0.05);
      border: 1px solid rgba(241, 236, 228, 0.12);
      color: ${THEME_TEXT};
      border-radius: 6px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.18s;
    }
    .mvg-nav-btn:hover {
      background: rgba(255, 91, 46, 0.18);
      border-color: ${THEME_ACCENT};
      color: ${THEME_ACCENT};
    }
  `;

  return (
    <div
      ref={rootRef}
      className="mv mv-sec mv-dark"
      style={{
        ...cssVars(c),
        ...B,
        '--mv-brass': THEME_ACCENT,
        '--mv-acc': THEME_ACCENT,
        '--mv-acc-d': THEME_ACCENT,
        '--mv-acc-lg': THEME_ACCENT,
        '--mv-hl': THEME_ACCENT,
        minHeight: '100vh',
        background: THEME_BG,
        color: THEME_TEXT,
        position: 'relative',
        overflowX: 'clip',
      }}
    >
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS_BASE + CSS_MOTION + siteFontCss(props) + CSS }} />

      <div className="mvg-wrap">
        {/* ── Page Header ── */}
        <header className="mvg-hero">
          <Eyebrow text="ROLL 08 — GRAPHIC DESIGN VAULT" on={on} M={M} />
          <Head
            text="Cinematic posters & *brand marks*."
            on={on}
            D={D}
            size="clamp(38px, 4.4vw, 64px)"
            lh={0.96}
            style={{ fontWeight: 760, fontStretch: '115%', marginBottom: '0' }}
          />
          <p className="mvg-hero-desc">
            Commercial advertising posters, FMCG product packaging, and {logosData.length}+ brand identities engineered as vector insignia reels.
          </p>
        </header>

        {/* ── Filter Tabs ── */}
        <div className="mvg-tabs" role="tablist">
          {[
            { id: 'all', label: 'All Artifacts', count: postersData.length + logosData.length },
            { id: 'posters', label: 'Posters & Packaging', count: postersData.length },
            { id: 'logos', label: 'Brand Identities', count: logosData.length },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`mvg-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="mvg-tab-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1: POSTERS & PACKAGING (GRID)
            ═══════════════════════════════════════════════════════ */}
        {(activeTab === 'all' || activeTab === 'posters') && (
          <section id="posters">
            <div className="mvg-sec-hdr">
              <h2 className="mvg-sec-title">Posters & Packaging</h2>
              <span className="mvg-roll-spec">ROLL 08-A · 35MM PRINT EXPOSURE</span>
            </div>

            <div className="mvg-poster-grid">
              {postersData.map((poster, idx) => (
                <article
                  key={poster.id}
                  className="mvg-poster-card"
                  onClick={() => {
                    setSelectedPoster(poster);
                    setSelectedPosterIdx(idx);
                    setPosterSurface('dark');
                    setLoupeActive(false);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedPoster(poster);
                      setSelectedPosterIdx(idx);
                      setPosterSurface('dark');
                    }
                  }}
                  aria-label={`View ${poster.title}`}
                >
                  {/* Film strip edge bar */}
                  <div className="mvg-poster-strip-bar">
                    <span>FRAME <b>{pad(idx + 1)}</b></span>
                    <span>{poster.year}</span>
                  </div>

                  {/* Stage Image */}
                  <div className="mvg-poster-stage">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="mvg-poster-img"
                      loading="lazy"
                    />
                    <div className="mvg-poster-overlay">
                      <span className="mvg-poster-loupe-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Inspect Loupe
                      </span>
                    </div>
                  </div>

                  {/* Card footer — Name only */}
                  <div className="mvg-poster-footer">
                    <h3 className="mvg-poster-title" title={poster.title}>
                      {poster.title}
                    </h3>
                    <span className="mvg-card-arrow">↗</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Divider between categories */}
        {activeTab === 'all' && <hr className="mvg-divider" />}

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: BRAND IDENTITIES (VINTAGE CAMERA REEL GRID)
            ═══════════════════════════════════════════════════════ */}
        {(activeTab === 'all' || activeTab === 'logos') && (
          <section id="logos">
            <div className="mvg-sec-hdr">
              <h2 className="mvg-sec-title">Brand Identities</h2>
              <span className="mvg-roll-spec">ROLL 08-B · 35MM NEGATIVE STRIP · {logosData.length} MARKS</span>
            </div>

            <div className="mvg-logo-reel-grid">
              {logosData.map((logo, idx) => (
                <article
                  key={logo.id}
                  className="mvg-reel-cell"
                  onClick={() => {
                    setSelectedLogo(logo);
                    setSelectedLogoIdx(idx);
                    setLogoSurface('dark');
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedLogo(logo);
                      setSelectedLogoIdx(idx);
                      setLogoSurface('dark');
                    }
                  }}
                  aria-label={`View brand mark ${logo.title}`}
                >
                  {/* Top camera film reel sprocket perforations */}
                  <div className="mvg-reel-sprocket">
                    <span className="mvg-reel-sprocket-text">
                      {pad(idx + 1)}A ◂ SB-400
                    </span>
                  </div>

                  {/* Negative Film Stage */}
                  <div className="mvg-reel-stage">
                    <div className="mvg-reel-leak" />
                    <img
                      src={logo.image}
                      alt={logo.title}
                      className="mvg-reel-logo-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom camera film reel sprocket perforations */}
                  <div className="mvg-reel-sprocket is-bottom">
                    <span className="mvg-reel-sprocket-text">
                      SAFETY FILM · 2025
                    </span>
                  </div>

                  {/* Cell Info Footer */}
                  <div className="mvg-reel-info">
                    <h3 className="mvg-reel-name" title={logo.title}>
                      {logo.title}
                    </h3>
                    <span className="mvg-reel-tag">
                      {logo.tagText || 'VECTOR'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          POSTER INSPECTION MODAL
          ═══════════════════════════════════════════════════════ */}
      {selectedPoster && (
        <div
          className="mvg-overlay"
          onClick={() => setSelectedPoster(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mvg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mvg-modal-head">
              <span>
                35MM PRINT // FRAME {pad(selectedPosterIdx + 1)} OF {pad(postersData.length)} · {selectedPoster.format || 'PRINT POSTER'}
              </span>
              <button
                type="button"
                className="mvg-modal-close"
                onClick={() => setSelectedPoster(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mvg-modal-body">
              <div
                className={`mvg-modal-stage ${loupeActive ? 'is-zoomed' : ''}`}
                style={{
                  background: posterSurface === 'light' ? '#FAF8F5' : posterSurface === 'warm' ? '#1D1712' : '#080807',
                }}
                onClick={() => setLoupeActive(!loupeActive)}
              >
                <img src={selectedPoster.image} alt={selectedPoster.title} />
              </div>

              <div className="mvg-modal-side">
                <div className="mvg-surface-bar">
                  <span className="mvg-surf-label">Surface:</span>
                  {[
                    ['dark', 'Darkroom'],
                    ['warm', 'Tungsten'],
                    ['light', 'Daylight'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`mvg-surf-btn ${posterSurface === key ? 'is-active' : ''}`}
                      onClick={() => setPosterSurface(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mvg-modal-eyebrow">
                  {selectedPoster.category} · {selectedPoster.year}
                </div>
                <h3 className="mvg-modal-title">{selectedPoster.title}</h3>
                <p className="mvg-modal-desc">{selectedPoster.desc}</p>

                <div className="mvg-modal-meta-box">
                  {[
                    ['CLIENT', selectedPoster.client],
                    ['INDUSTRY', selectedPoster.industry],
                    ['DIMENSIONS', selectedPoster.dimensions],
                    ['PRINT FORMAT', selectedPoster.format],
                  ].map(([k, v]) => v && (
                    <div key={k} className="mvg-meta-row">
                      <span className="mvg-meta-key">{k}</span>
                      <span className="mvg-meta-val">{v}</span>
                    </div>
                  ))}
                </div>

                {selectedPoster.tags && (
                  <div className="mvg-tags">
                    {selectedPoster.tags.map((tag) => (
                      <span key={tag} className="mvg-tag-item">{tag}</span>
                    ))}
                  </div>
                )}

                {selectedPoster.deliverables && (
                  <div style={{ marginBottom: '18px' }}>
                    <span className="mvg-meta-key" style={{ display: 'block', marginBottom: '8px' }}>
                      DELIVERABLES:
                    </span>
                    <div className="mvg-tags">
                      {selectedPoster.deliverables.map((d, i) => (
                        <span key={i} className="mvg-tag-item">✓ {d}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mvg-modal-nav">
                  <button
                    type="button"
                    className="mvg-nav-btn"
                    onClick={() => {
                      const prev = (selectedPosterIdx - 1 + postersData.length) % postersData.length;
                      setSelectedPosterIdx(prev);
                      setSelectedPoster(postersData[prev]);
                    }}
                  >
                    ◄ Prev Frame
                  </button>
                  <button
                    type="button"
                    className="mvg-nav-btn"
                    onClick={() => {
                      const next = (selectedPosterIdx + 1) % postersData.length;
                      setSelectedPosterIdx(next);
                      setSelectedPoster(postersData[next]);
                    }}
                  >
                    Next Frame ►
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          LOGO INSPECTION MODAL
          ═══════════════════════════════════════════════════════ */}
      {selectedLogo && (
        <div
          className="mvg-overlay"
          onClick={() => setSelectedLogo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mvg-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px' }}>
            <div className="mvg-modal-head">
              <span>
                35MM VECTOR SPEC // MARK {pad(selectedLogoIdx + 1)} OF {pad(logosData.length)} · {selectedLogo.category}
              </span>
              <button
                type="button"
                className="mvg-modal-close"
                onClick={() => setSelectedLogo(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mvg-modal-body" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
              <div
                className="mvg-modal-stage"
                style={{
                  background: logoSurface === 'light' ? '#FFFFFF' : logoSurface === 'brand' ? (selectedLogo.bgColor || '#080807') : '#080807',
                  minHeight: '320px',
                }}
              >
                <img
                  src={selectedLogo.image}
                  alt={selectedLogo.title}
                  style={{ maxHeight: '210px', maxWidth: '85%' }}
                />
              </div>

              <div className="mvg-modal-side">
                <div className="mvg-surface-bar">
                  <span className="mvg-surf-label">Surface:</span>
                  {[
                    ['dark', 'Dark'],
                    ['light', 'White'],
                    ['brand', 'Brand'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`mvg-surf-btn ${logoSurface === key ? 'is-active' : ''}`}
                      onClick={() => setLogoSurface(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mvg-modal-eyebrow">
                  {selectedLogo.category} · {selectedLogo.year}
                </div>
                <h3 className="mvg-modal-title">{selectedLogo.title}</h3>
                <p className="mvg-modal-desc">{selectedLogo.desc}</p>

                <div className="mvg-modal-meta-box">
                  {[
                    ['CLIENT', selectedLogo.client],
                    ['SECTOR', selectedLogo.industry],
                  ].map(([k, v]) => v && (
                    <div key={k} className="mvg-meta-row">
                      <span className="mvg-meta-key">{k}</span>
                      <span className="mvg-meta-val">{v}</span>
                    </div>
                  ))}
                </div>

                {selectedLogo.deliverables && (
                  <div style={{ marginBottom: '18px' }}>
                    <span className="mvg-meta-key" style={{ display: 'block', marginBottom: '8px' }}>
                      DELIVERABLES:
                    </span>
                    <div className="mvg-tags">
                      {selectedLogo.deliverables.map((d, i) => (
                        <span key={i} className="mvg-tag-item">✓ {d}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mvg-modal-nav">
                  <button
                    type="button"
                    className="mvg-nav-btn"
                    onClick={() => {
                      const prev = (selectedLogoIdx - 1 + logosData.length) % logosData.length;
                      setSelectedLogoIdx(prev);
                      setSelectedLogo(logosData[prev]);
                    }}
                  >
                    ◄ Prev Mark
                  </button>
                  <button
                    type="button"
                    className="mvg-nav-btn"
                    onClick={() => {
                      const next = (selectedLogoIdx + 1) % logosData.length;
                      setSelectedLogoIdx(next);
                      setSelectedLogo(logosData[next]);
                    }}
                  >
                    Next Mark ►
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
