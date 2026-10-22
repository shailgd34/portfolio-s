'use client';

import React from 'react';
import {
  MvHeader,
  MvWorkIndex,
  MvLogoReel,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function WorkPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvWorkIndex />
      <MvLogoReel />
      <MvCta />
      <MvFooter />
    </main>
  );
}
