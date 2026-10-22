'use client';

import React from 'react';
import {
  MvHeader,
  MvStartHere,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function StartHerePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvStartHere />
      </div>
      <MvFooter />
    </main>
  );
}
