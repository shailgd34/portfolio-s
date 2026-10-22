'use client';

import React from 'react';
import {
  MvHeader,
  MvUses,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function UsesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvUses />
      </div>
      <MvCta />
      <MvFooter />
    </main>
  );
}
