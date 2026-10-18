'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
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
      <div className="container">

        {/* Top Header Bar */}
        <div className={styles.contactTopMetaBar}>
          <div className={styles.metaLeft}>
            <span className={styles.metaCategoryTag}>[ 07 // CONTACT ]</span>
            <span className={styles.metaClassification}>• GET IN TOUCH</span>
          </div>
          <div className={styles.metaRight}>
            <span className={styles.metaSlaTag}>REPLY WITHIN 24 HOURS</span>
          </div>
        </div>

        <div className={styles.newspaperDoubleRule} />

        <div className={styles.contactGrid}>

          {/* Left Column: Simple & Clean Retro Typography */}
          <div className={styles.leftCol}>
            <div className={styles.retroTextDossier}>

              {/* Dossier Header */}
              <div className={styles.docketHeaderBar}>
                <div className={styles.docketChipGroup}>
                  <span className={styles.docketChipSquare} />
                  <span className={styles.docketCode}>CONTACT // SSB</span>
                </div>
                <div className={styles.statusIndicator}>
                  <span className={styles.livePulseDot} />
                  <span className={styles.statusLabel}>AVAILABLE NOW</span>
                </div>
              </div>

              {/* Big Retro Title */}
              <div className={styles.editorialTitleBlock}>
                <h3 className={styles.giantDisplayTitle}>
                  <span>LET&apos;S</span>
                  <span className={styles.titleLineTwo}>TALK.</span>
                </h3>
                <div className={styles.orangeTapeSlash} aria-hidden="true" />
              </div>

              {/* Simple Text */}
              <div className={styles.editorialSubheadGroup}>
                <h4 className={styles.manifestoHeadline}>
                  HAVE A PROJECT?
                </h4>
                <p className={styles.editorialBodyCopy}>
                  I design websites, mobile apps, and brand identities. Send a message and let&apos;s talk.
                </p>
              </div>

              {/* Simple Details Table */}
              <div className={styles.docketLedger}>
                <div className={styles.ledgerRow}>
                  <span className={styles.ledgerKey}>NAME</span>
                  <span className={styles.ledgerVal}>SHEELASH S. BHADORIYA</span>
                </div>
                <div className={styles.ledgerRow}>
                  <span className={styles.ledgerKey}>ROLE</span>
                  <span className={styles.ledgerVal}>PRODUCT &amp; UI/UX DESIGNER</span>
                </div>
                <div className={styles.ledgerRow}>
                  <span className={styles.ledgerKey}>LOCATION</span>
                  <span className={styles.ledgerVal}>INDORE, INDIA</span>
                </div>
                <div className={styles.ledgerRow}>
                  <span className={styles.ledgerKey}>RESPONSE</span>
                  <span className={styles.ledgerVal} style={{ color: '#FF6B35' }}>WITHIN 24 HOURS</span>
                </div>
              </div>

              {/* Direct Contact Buttons */}
              <div className={styles.directContactChips}>
                <a href="mailto:shailashs79@gmail.com" className={styles.contactChip}>
                  <Mail size={14} className={styles.chipIcon} />
                  <span>shailashs79@gmail.com</span>
                </a>
                <a href="tel:+919516372235" className={styles.contactChip}>
                  <Phone size={14} className={styles.chipIcon} />
                  <span>+91 9516372235</span>
                </a>
              </div>

              {/* Bottom Graphic Row */}
              <div className={styles.editorialGlobeStampRow}>
                <div className={styles.globeGraphicWrap}>
                  <svg className={styles.retroGlobeSvg} viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="46" stroke="#181512" strokeWidth="1.5" strokeDasharray="3 3" />
                    <ellipse cx="50" cy="50" rx="46" ry="22" stroke="#181512" strokeWidth="1.2" />
                    <ellipse cx="50" cy="50" rx="22" ry="46" stroke="#181512" strokeWidth="1.2" />
                    <line x1="50" y1="4" x2="50" y2="96" stroke="#181512" strokeWidth="1.2" />
                    <line x1="4" y1="50" x2="96" y2="50" stroke="#181512" strokeWidth="1.2" />
                  </svg>
                  <span className={styles.globeLabel}>WORLDWIDE</span>
                </div>

                <div className={styles.rotogravureBadge}>
                  <span className={styles.badgeLine1}>DESIGN</span>
                  <span className={styles.badgeLine2}>BUILD</span>
                  <span className={styles.badgeLine3}>ITERATE</span>
                  <span className={styles.badgeLine4}>DELIVER ★</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Clean & Simple Contact Form */}
          <div className={styles.rightCol}>
            <div className={styles.requisitionDocket}>

              {/* Form Header */}
              <div className={styles.formHeaderArea}>
                <div className={styles.formClassificationTag}>
                  <span>[ CONTACT FORM ]</span>
                </div>
                <h2 className={styles.mainTitle}>SEND A MESSAGE</h2>
                <p className={styles.subtitle}>
                  Fill out the form or email me directly at{' '}
                  <a href="mailto:shailashs79@gmail.com" style={{ color: '#FF6B35', fontWeight: 700 }}>
                    shailashs79@gmail.com
                  </a>
                  .
                </p>
              </div>

              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successStamp}>
                    <CheckCircle2 size={38} className={styles.successIconSvg} />
                    <span className={styles.successStampText}>MESSAGE SENT</span>
                  </div>
                  <h3 className={styles.successTitle}>THANK YOU!</h3>
                  <p className={styles.successText}>
                    Thank you, <strong>{formState.name}</strong>. Your message was sent to{' '}
                    <a href="mailto:shailashs79@gmail.com" className={styles.emailHighlight}>
                      shailashs79@gmail.com
                    </a>
                    . I will reply within 24 hours.
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
                      SEND ANOTHER MESSAGE
                    </button>
                    <a
                      href={`mailto:shailashs79@gmail.com?subject=Direct Inquiry from ${encodeURIComponent(formState.name)}&body=${encodeURIComponent(formState.message)}`}
                      className={styles.directMailBtn}
                    >
                      OPEN IN EMAIL APP ↗
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>

                  {/* Name & Email side-by-side */}
                  <div className={styles.rowTwoCols}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="contact-name" className={styles.fieldLabel}>
                        <span className={styles.fieldCode}>[ 01 ]</span> YOUR NAME
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className={styles.textInput}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="contact-email" className={styles.fieldLabel}>
                        <span className={styles.fieldCode}>[ 02 ]</span> YOUR EMAIL
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Service Needed Dropdown */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-service" className={styles.fieldLabel}>
                      <span className={styles.fieldCode}>[ 03 ]</span> SERVICE NEEDED
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
                        <option value="" disabled>Select a service...</option>
                        <option value="UI/UX Product Design">UI/UX Design</option>
                        <option value="Web Design & Frontend Development">Web Design &amp; Development</option>
                        <option value="SaaS & Dashboard Design">SaaS &amp; Dashboard Design</option>
                        <option value="Mobile App Design">Mobile App Design (iOS / Android)</option>
                        <option value="Brand Identity & Logo">Brand Identity &amp; Logo</option>
                        <option value="Other Project">Other Inquiry</option>
                      </select>
                      <div className={styles.selectArrow} aria-hidden="true">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-message" className={styles.fieldLabel}>
                      <span className={styles.fieldCode}>[ 04 ]</span> YOUR MESSAGE
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell me about your project, timeline, or goals..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className={styles.textareaInput}
                    />
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className={styles.errorBanner}>
                      <p className={styles.errorMsg}>{error}</p>
                      <a
                        href={`mailto:shailashs79@gmail.com?subject=Portfolio Inquiry (${encodeURIComponent(formState.service || 'General')}) from ${encodeURIComponent(formState.name || 'New Client')}&body=${encodeURIComponent('Hi Shailash,\n\n' + formState.message + '\n\n---\nName: ' + formState.name + '\nEmail: ' + formState.email + '\nService: ' + formState.service)}`}
                        className={styles.errorMailtoBtn}
                      >
                        Send email to shailashs79@gmail.com ↗
                      </a>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className={styles.submitRow}>
                    <button
                      type="submit"
                      disabled={loading}
                      className={styles.submitBtn}
                    >
                      <span className={styles.btnInnerWrap}>
                        <span className={styles.btnIcon}>✉</span>
                        <span className={styles.submitText}>
                          {loading ? 'SENDING...' : 'SEND MESSAGE →'}
                        </span>
                      </span>
                    </button>

                    <div className={styles.dispatchFallbackNote}>
                      <span>DIRECT EMAIL: shailashs79@gmail.com • INDORE, INDIA</span>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* Bottom Section Divider */}
        <div className={styles.newspaperBottomRule} />

      </div>
    </section>
  );
}

