'use client';

import React from 'react';
import Link from 'next/link';
import {
  MvHeader,
  MvWorkIndex,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function WorkPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader links="Home:/, Work:/work, Graphics:/graphics, About:/about, Resume:/resume, Contact:/contact" />
      <MvWorkIndex />

      {/* Direct cross-link to Graphic Elements (Posters & Logos) */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(242,146,58,0.08) 0%, rgba(20,18,16,0.6) 100%)',
            border: '1px solid rgba(242,146,58,0.25)',
            borderRadius: '16px',
            padding: '36px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#F2923A',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              ROLL 08 — VISUAL ARTIFACTS
            </span>
            <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, margin: '0 0 8px', color: '#F1ECE4' }}>
              Explore Posters, Packaging & Brand Logos
            </h3>
            <p style={{ margin: 0, color: 'rgba(241,236,228,0.7)', fontSize: '15px', maxWidth: '620px' }}>
              Dedicated gallery for commercial advertising posters, FMCG product packaging labels, and 30+ vector brand marks.
            </p>
          </div>
          <Link
            href="/graphics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: '#F2923A',
              color: '#0E0D0C',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              borderRadius: '999px',
              textDecoration: 'none',
              transition: 'transform 0.2s, background 0.2s',
            }}
          >
            <span>View Graphic Elements</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <MvCta />
      <MvFooter pages="Work:/work, Graphics:/graphics, About:/about, Resume:/resume, Contact:/contact" />
    </main>
  );
}
