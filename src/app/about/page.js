'use client';

import React from 'react';
import {
  MvHeader,
  MvAbout,
  MvCredits,
  MvPress,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvAbout />
      <MvCredits />
      <MvPress />
      <MvCta />
      <MvFooter />
    </main>
  );
}
