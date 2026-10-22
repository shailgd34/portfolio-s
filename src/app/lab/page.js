'use client';

import React from 'react';
import {
  MvHeader,
  MvPageHero,
  MvLabIndex,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function LabPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvPageHero
        object="strip"
        ground="dark"
        eyebrow="EXPERIMENTS — 16mm Creative Lab"
        title="Outtakes, *shaders*,|& creative code."
        lead="Interactive side experiments, experimental UI components, generative physics, and raw creative prototypes."
        slateScene="Lab"
      />
      <MvLabIndex />
      <MvCta />
      <MvFooter />
    </main>
  );
}
