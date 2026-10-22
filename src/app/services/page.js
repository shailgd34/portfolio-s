'use client';

import React from 'react';
import {
  MvHeader,
  MvPageHero,
  MvServiceGrid,
  MvService,
  MvProcess,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function ServicesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvPageHero
        object="gel"
        ground="paper"
        eyebrow="CAPABILITIES — What I build"
        title="From *concept*|to production code."
        lead="Fullstack product design, UI/UX architecture, scalable Figma design systems, and resilient Next.js React engineering."
        slateScene="Services"
      />
      <MvServiceGrid />
      <MvProcess />
      <MvCta />
      <MvFooter />
    </main>
  );
}
