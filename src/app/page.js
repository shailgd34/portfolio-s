'use client';

import React from 'react';
import {
  MvLoader,
  MvPageTrans,
  MvHeader,
  MvHero,
  MvIntro,
  MvWork,
  MvServices,
  MvProcess,
  MvKit,
  MvCredits,
  MvPress,
  MvLab,
  MvNotes,
  MvContact,
  MvCta,
  MvFooter,
  siteData,
  topHomeProjects,
  allProjects,
} from '@/components/voss';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#141210',
        color: '#F1ECE4',
        position: 'relative',
      }}
    >
      {/* Shutter blade route transition */}
      <MvPageTrans enabled={true} />

      {/* Studio Header: Logo, Timezone Clock, Navigation, Hire Me CTA */}
      <MvHeader
        links="Work:/work, About:/about, Resume:/resume, Contact:/contact"
        ctaLabel="Hire me"
        ctaLink="/contact"
        avail={siteData.avail}
      />

      {/* Photography Studio Hero: Giant Name Typography, Cutout Portrait, Light Spot, Backdrop Switcher */}
      <MvHero
        nameText={siteData.heroDisplayName}
        roleLine="Product designer|& developer"
        statement={siteData.statement}
        primary="See my work"
        primaryLink="/work"
        secondary="Download résumé"
        secondaryLink={siteData.resume}
        portrait={siteData.portrait}
        showNav={false}
      />

      {/* Philosophy and Key Impact Metrics */}
      <MvIntro />

      {/* Work Section: 35mm Contact Sheet of Selected Case Studies */}
      <section id="work">
        <MvWork
          heading="Selected *work*,|2020 – 2026."
          sheetLabel="Contact sheet · Roll 01"
          allLabel={`All ${allProjects.length} projects`}
          allLink="/work"
          ctaLabel={`All ${allProjects.length} projects`}
          ctaLink="/work"
          projects={topHomeProjects}
        />
      </section>

      {/* Services Section: Theatrical Color Gel Lens Cards */}
      <section id="services">
        <MvServices
          heading="What I *build*,|how I help."
          ctaLabel="All services"
          ctaLink="/services"
        />
      </section>

      {/* Process Section: Sprint Stages & Architecture Pipeline */}
      <section id="process">
        <MvProcess />
      </section>

      {/* Kit Section: Design Tool Tokens & UI Component Anatomy */}
      <MvKit />

      {/* Credits Section: End-Credits Rolling Career & Experience Timeline */}
      <MvCredits />

      {/* Press Section: Verified Endorsements & Client Testimonials */}
      <MvPress />

      {/* Lab Section: Creative Code & 16mm Outtakes Reel */}
      <section id="lab">
        <MvLab
          heading="Outtakes &|*experiments*."
          allLabel="All experiments"
          allLink="/lab"
        />
      </section>

      {/* Notes Section: Studio Notebook Essays & Newsletter Strip */}
      <section id="notes">
        <MvNotes
          heading="Notes from|the *studio*."
          allLabel="All notes"
          allLink="/writing"
        />
      </section>

      {/* Contact Section: Studio Booking Call Sheet & Inquiry Form */}
      <section id="contact">
        <MvContact />
      </section>

      {/* Final Clapperboard CTA */}
      <MvCta />

      {/* Studio Footer: Comprehensive Sitemap, Legal Links, Live Local Time */}
      <MvFooter />
    </main>
  );
}
