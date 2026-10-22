'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  MvHeader,
  MvPost,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : '';

  return (
    <main style={{ minHeight: '100vh', background: '#F1ECE4', color: '#141210' }}>
      <MvPageTrans />
      <MvHeader />
      <div style={{ paddingTop: 72 }}>
        <MvPost slug={slug} />
      </div>
      <MvCta />
      <MvFooter />
    </main>
  );
}
