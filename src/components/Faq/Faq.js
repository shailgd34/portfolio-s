'use client';

import { useState } from 'react';
import styles from './Faq.module.css';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What services do you offer?',
      a: 'I specialize in Product Design (UI/UX), Next.js Frontend Development, Design Systems architecture, and Creative Web Experiences for startups, SaaS companies, and digital agencies.'
    },
    {
      q: 'What is your typical project timeline?',
      a: 'A standard website or UI design project typically takes between 2 to 4 weeks, depending on complexity, scope, and number of screens. I provide clear milestone schedules before starting.'
    },
    {
      q: 'Do you handle both design and frontend development?',
      a: 'Yes! I bridge the gap between design and development. You get pixel-perfect UI designs built directly into high-performance, responsive React / Next.js code without losing detail.'
    },
    {
      q: 'How do we get started on a project together?',
      a: 'Simply fill out the contact form below or email shailashs79@gmail.com with your project goals and timeline. I will reach out within 24 hours to schedule an intro call.'
    },
    {
      q: 'What software and tools do you use?',
      a: 'My primary toolstack includes Figma, Framer, Next.js 14, React, JavaScript, CSS Modules, GSAP, Tailwind CSS, Git, and Vercel.'
    },
    {
      q: 'What are your pricing models for project work?',
      a: 'I work on fixed project-based pricing or weekly retainer models based on the required scope, complexity, and turnaround speed.'
    }
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <div className="container">
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.subHeaderTag}>ANSWERS & QUESTIONS</span>
            <h2 className={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</h2>
          </div>
          <span className={styles.countBadge}>(06 FAQS)</span>
        </div>

        {/* FAQ Accordion List */}
        <div className={styles.faqList}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.faqCard} ${isOpen ? styles.faqOpen : ''}`}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div className={styles.faqHeader}>
                  <h3 className={styles.faqQuestion}>
                    <span className={styles.faqNum}>0{idx + 1}.</span> {faq.q}
                  </h3>
                  <button className={styles.toggleBtn} aria-label="Toggle answer">
                    {isOpen ? '−' : '+'}
                  </button>
                </div>

                {isOpen && (
                  <div className={styles.faqBody}>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
