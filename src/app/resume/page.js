'use client';

import React from 'react';
import {
  MvHeader,
  MvResume,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function ResumePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvResume />
      <MvCta />
      <MvFooter />
    </main>
  );
}
