'use client';

import React from 'react';
import {
  MvHeader,
  MvLegal,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvLegal kind="privacy" />
      </div>
      <MvFooter />
    </main>
  );
}
