'use client';

import React from 'react';
import {
  MvHeader,
  MvWritingList,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function WritingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvWritingList />
      </div>
      <MvCta />
      <MvFooter />
    </main>
  );
}
