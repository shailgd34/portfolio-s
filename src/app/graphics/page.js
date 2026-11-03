'use client';

import React from 'react';
import {
  MvHeader,
  MvGraphicsIndex,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function GraphicsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader links="Home:/, Work:/work, Graphics:/graphics, About:/about, Resume:/resume, Contact:/contact" />
      <MvGraphicsIndex />
      <MvCta
        heading="Need custom brand identity|or commercial print?"
        action="Get in touch"
        actionLink="/contact"
      />
      <MvFooter pages="Work:/work, Graphics:/graphics, About:/about, Resume:/resume, Contact:/contact" />
    </main>
  );
}

