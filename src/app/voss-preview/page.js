'use client';

import React, { useState } from 'react';
import {
  MvSmooth,
  MvHeader,
  MvHero,
  MvIntro,
  MvAbout,
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
  MvWorkIndex,
  MvCase,
  MvServiceGrid,
  MvService,
  MvLabIndex,
  MvLabItem,
  MvWritingList,
  MvPost,
  MvResume,
  MvUses,
  MvPageHero,
  MvLegal,
  MvStartHere,
  MvLoader,
  MvPageTrans,
  siteData,
} from '@/components/voss';

const TABS = [
  { id: 'home', label: 'Studio Home', icon: '🎬' },
  { id: 'work', label: 'Work Light Table', icon: '🎞️' },
  { id: 'case', label: 'Case Study', icon: '📁' },
  { id: 'services', label: 'Service Gels', icon: '✨' },
  { id: 'lab', label: '16mm Lab Screening', icon: '📽️' },
  { id: 'writing', label: 'Studio Notebook', icon: '✒️' },
  { id: 'resume', label: 'Résumé & Gear', icon: '📐' },
  { id: 'hero-playground', label: 'Page Hero Objects', icon: '💡' },
  { id: 'guide', label: 'Call Sheet Guide', icon: '📋' },
];

export default function VossPreviewPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [heroObject, setHeroObject] = useState('slate');
  const [heroGround, setHeroGround] = useState('paper');

  return (
    <main style={{ minHeight: '100vh', background: '#141210', position: 'relative' }}>
      <MvSmooth />
      <MvLoader enabled={false} once={false} />
      <MvPageTrans enabled={false} />

      {/* Floating Studio Nav Pill at Top */}
      <nav
        style={{
          position: 'fixed',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9990,
          background: 'rgba(23, 19, 17, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 30,
          padding: '6px 8px',
          display: 'flex',
          gap: 6,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
          maxWidth: '96vw',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
        aria-label="Studio View Switcher"
      >
        {TABS.map((tab) => {
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: isAct ? '#FF5B2E' : 'transparent',
                color: isAct ? '#141210' : 'rgba(255, 255, 255, 0.75)',
                fontWeight: isAct ? 600 : 500,
                fontSize: 12.5,
                letterSpacing: '0.04em',
                padding: '7px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Header present on all primary views */}
      <MvHeader
        links="Work:#work, About:#about, Services:#services, Process:#process, Lab:#lab, Notes:#notes, Contact:#contact"
        ctaLabel="Hire me"
        ctaLink="#contact"
      />

      {/* VIEW: HOME */}
      {activeTab === 'home' && (
        <>
          <MvHero
            nameText={siteData.heroDisplayName}
            roleLine="Product designer|& developer"
            statement={siteData.statement}
            primary="See my work"
            primaryLink="#work"
            secondary="Download résumé"
            secondaryLink={siteData.resume}
          />
          <MvIntro />
          <div id="about">
            <MvAbout />
          </div>
          <div id="work">
            <MvWork />
          </div>
          <div id="services">
            <MvServices />
          </div>
          <div id="process">
            <MvProcess />
          </div>
          <MvKit />
          <MvCredits />
          <MvPress />
          <div id="lab">
            <MvLab />
          </div>
          <div id="notes">
            <MvNotes />
          </div>
          <div id="contact">
            <MvContact />
          </div>
          <MvCta />
          <MvFooter />
        </>
      )}

      {/* VIEW: WORK LIGHT TABLE */}
      {activeTab === 'work' && (
        <div style={{ paddingTop: 80 }}>
          <MvWorkIndex />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: CASE STUDY */}
      {activeTab === 'case' && (
        <div style={{ paddingTop: 80 }}>
          <MvCase />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: SERVICES */}
      {activeTab === 'services' && (
        <div style={{ paddingTop: 80 }}>
          <MvServiceGrid />
          <MvService />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: 16MM LAB */}
      {activeTab === 'lab' && (
        <div style={{ paddingTop: 80 }}>
          <MvLabIndex />
          <MvLabItem />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: WRITING & NOTEBOOK */}
      {activeTab === 'writing' && (
        <div style={{ paddingTop: 80 }}>
          <MvWritingList />
          <MvPost />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: RESUME & GEAR */}
      {activeTab === 'resume' && (
        <div style={{ paddingTop: 80 }}>
          <MvResume />
          <MvUses />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: HERO OBJECTS PLAYGROUND */}
      {activeTab === 'hero-playground' && (
        <div style={{ paddingTop: 100 }}>
          <div
            style={{
              maxWidth: 800,
              margin: '0 auto 30px',
              padding: '16px 24px',
              background: '#231D19',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              color: '#F1ECE4',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: 14, letterSpacing: '0.06em' }}>
                STUDIO HERO OBJECT CONTROLS
              </b>
              <span style={{ fontSize: 12, color: '#857B70' }}>
                Test physics, clapping slate, film strip, gel filters, and fresnel lamp spotlight.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['slate', 'strip', 'gel', 'lamp', 'none'].map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setHeroObject(obj)}
                  style={{
                    background: heroObject === obj ? '#FF5B2E' : 'rgba(255,255,255,0.08)',
                    color: heroObject === obj ? '#141210' : '#FFFFFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {obj}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setHeroGround(heroGround === 'paper' ? 'dark' : 'paper')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Ground: {heroGround}
              </button>
            </div>
          </div>
          <MvPageHero object={heroObject} ground={heroGround} />
          <MvCta />
          <MvFooter />
        </div>
      )}

      {/* VIEW: OWNER CALL SHEET & LEGAL */}
      {activeTab === 'guide' && (
        <div style={{ paddingTop: 80 }}>
          <MvStartHere />
          <MvLegal />
          <MvFooter />
        </div>
      )}
    </main>
  );
}
