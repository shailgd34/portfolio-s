'use client';

import React from 'react';
import {
  MvHeader,
  MvContact,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvContact />
      <MvFooter />
    </main>
  );
}
