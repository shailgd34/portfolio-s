'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  MvHeader,
  MvLabItem,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function LabDetailPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : '';

  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvLabItem slug={slug} />
      </div>
      <MvCta />
      <MvFooter />
    </main>
  );
}
