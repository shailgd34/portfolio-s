'use client';

import React from 'react';
import {
  MvHeader,
  MvLegal,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvLegal kind="terms" />
      </div>
      <MvFooter />
    </main>
  );
}
