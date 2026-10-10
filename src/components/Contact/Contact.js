'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '9d3157b3-3c20-49f9-976d-11cc49545740';

    try {
      const formData = new FormData();
      formData.append('access_key', accessKey);
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('service', formState.service || 'General Inquiry');
      formData.append('message', formState.message);
      formData.append('from_name', `${formState.name} (Portfolio)`);
      formData.append('subject', `New Client Inquiry from ${formState.name} (${formState.service || 'Design'})`);

      // Direct Web3Forms submission to shailashs79@gmail.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Direct dispatch could not complete. Click below to send directly to shailashs79@gmail.com:');
      }
    } catch (err) {
      setError('Connection interrupted. Click below to send pre-filled message directly via email:');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      {/* Floating Ambient Lime Dot at Top Left */}
      <div className={styles.ambientDot} aria-hidden="true" />

      <div className="container">
        <div className={styles.contactGrid}>
          
          {/* Left Column: Portrait Card with overlapping lime "Hi" badge */}
          <div className={styles.leftCol}>
            <div className={styles.portraitCard}>
              <Image
                src="/Professional Indian Corporate Headshot.png"
                alt="Shailash Singh Bhadoriya"
                width={420}
                height={540}
                priority
                className={styles.portraitImg}
              />
              
              {/* Overlapping Lime Badge matching Hero and user screenshot */}
              <div className={styles.hiBadge}>
                <span className={styles.hiText}>Hi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Subtitle & Interactive Form */}
          <div className={styles.rightCol}>
            <div className={styles.headerArea}>
              <h2 className={styles.mainTitle}>LET'S WORK TOGETHER</h2>
              <p className={styles.subtitle}>
                Let's build something impactful together—whether it's your brand, your website, or your next big idea.
              </p>
            </div>

            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>MESSAGE RECEIVED!</h3>
                <p className={styles.successText}>
                  Thank you, <strong>{formState.name}</strong>. Your message has been sent directly to{' '}
                  <a href="mailto:shailashs79@gmail.com" className={styles.emailHighlight}>
                    shailashs79@gmail.com
                  </a>
                  . I will get back to you within 24 hours.
                </p>
                <div className={styles.successActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', service: '', message: '' });
                    }}
                    className={styles.resetBtn}
                  >
                    Send Another Inquiry
                  </button>
                  <a
                    href={`mailto:shailashs79@gmail.com?subject=Direct Inquiry from ${encodeURIComponent(formState.name)}&body=${encodeURIComponent(formState.message)}`}
                    className={styles.directMailBtn}
                  >
                    Open in Mail App ↗
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                
                {/* Row 1: Name & Email side-by-side */}
                <div className={styles.rowTwoCols}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-name" className={styles.fieldLabel}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Smith"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-email" className={styles.fieldLabel}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="johnsmith@gmail.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className={styles.textInput}
                    />
                  </div>
                </div>

                {/* Row 2: Service Needed ? Dropdown */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-service" className={styles.fieldLabel}>
                    Service Needed ?
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="contact-service"
                      name="service"
                      required
                      value={formState.service}
                      onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      className={styles.selectInput}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Web Design & Frontend Development">Web Design & Frontend Development</option>
                      <option value="SaaS & Enterprise Dashboard Design">SaaS & Enterprise Dashboard Design</option>
                      <option value="Brand Identity & Graphic Design">Brand Identity & Graphic Design</option>
                      <option value="Mobile App Design (iOS / Android)">Mobile App Design (iOS / Android)</option>
                    </select>
                    <div className={styles.selectArrow} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 3: What Can I Help You... Textarea */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-message" className={styles.fieldLabel}>
                    What Can I Help You...
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Hello, I'd like to enquire about..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className={styles.textareaInput}
                  />
                </div>

                {/* Error Banner with 1-Click Direct Email Fallback */}
                {error && (
                  <div className={styles.errorBanner}>
                    <p className={styles.errorMsg}>{error}</p>
                    <a
                      href={`mailto:shailashs79@gmail.com?subject=Portfolio Inquiry (${encodeURIComponent(formState.service || 'General')}) from ${encodeURIComponent(formState.name || 'New Client')}&body=${encodeURIComponent('Hi Shailash,\n\n' + formState.message + '\n\n---\nName: ' + formState.name + '\nEmail: ' + formState.email + '\nService: ' + formState.service)}`}
                      className={styles.errorMailtoBtn}
                    >
                      Send Pre-filled Email to shailashs79@gmail.com ↗
                    </a>
                  </div>
                )}

                {/* Submit Row: Pill with green toggle switch + SUBMIT */}
                <div className={styles.submitRow}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    {/* Green Toggle Switch Indicator matching screenshot */}
                    <span className={styles.toggleSwitch} aria-hidden="true">
                      <span className={styles.toggleKnob}></span>
                    </span>
                    <span className={styles.submitText}>
                      {loading ? 'SENDING...' : 'SUBMIT'}
                    </span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
