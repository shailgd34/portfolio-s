'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  MvHeader,
  MvCase,
  MvCta,
  MvFooter,
  MvPageTrans,
} from '@/components/voss';

export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : '';

  return (
    <main style={{ minHeight: '100vh', background: '#141210', color: '#F1ECE4' }}>
      <MvPageTrans />
      <MvHeader />
      <MvCase slug={slug} />
      <MvCta />
      <MvFooter />
    </main>
  );
}
