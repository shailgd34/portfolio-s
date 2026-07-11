'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success' | 'error' | null
  const [statusMsg, setStatusMsg] = useState('');

  const sectionRef = useRef(null);
  const formCardRef = useRef(null);
  const socialRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal entry animation for contact cards
      gsap.fromTo(formCardRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    // Spotlight cursor follower listener
    const handleMouseMove = (e) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      ctx.revert();
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Magnetic hover effect on social buttons
  const handleSocialMove = (e, index) => {
    const btn = socialRefs.current[index];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleSocialLeave = (index) => {
    const btn = socialRefs.current[index];
    if (!btn) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus(null);

    const data = {
      ...formState,
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "6268f700-1c0b-410a-b28f-7f7243c2cbb4",
      subject: `New Portfolio Message from ${formState.name}`,
      from_name: "Portfolio Contact Form",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        setFormStatus('success');
        setStatusMsg('Message delivered! I will get in touch shortly.');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
        setStatusMsg(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormStatus('error');
      setStatusMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection} ref={sectionRef}>
      {/* Animated Mesh Backdrop */}
      <div className={styles.meshBg}></div>
      {/* Dynamic Cursor Spotlight Overlay */}
      <div className={styles.spotlight}></div>

      <div className="container">
        
        {/* Descriptive Header */}
        <div className="section-title-wrapper">
          <span className="section-subtitle">Contact</span>
          <h2 className="section-title">Get In Touch</h2>
        </div>

        <div className={styles.contactGrid}>
          
          {/* Left Column: Headline Content */}
          <div className={styles.headlineColumn}>
            <h3 className={styles.hugeHeadline}>
              Let's Build<br />Something<br />Extraordinary
            </h3>
            <p className={styles.subText}>
              Have an exciting product idea, fintech startup visual challenge, or a visual system design requirement? Send me a message and let's craft a luxury digital solution.
            </p>

            {/* Social handles list (Interactive Floating badges) */}
            <div className={styles.socialRow}>
              <span className={styles.socialLabel}>Connect Directly</span>
              <div className={styles.socialGrid}>
                
                <a 
                  href="https://www.behance.net/prithvibhadour" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  ref={(el) => (socialRefs.current[0] = el)}
                  className={styles.socialBtn} 
                  aria-label="Behance" 
                  data-cursor-text="BEHANCE"
                  style={{ '--tech-color': 'rgba(0, 240, 255, 0.22)' }}
                  onMouseMove={(e) => handleSocialMove(e, 0)}
                  onMouseLeave={() => handleSocialLeave(0)}
                >
                  <span className={styles.socialIconInner} style={{ fontWeight: '800', fontSize: '0.85rem' }}>Bē</span>
                </a>

                <a 
                  href="https://www.linkedin.com/in/shailash-singh-bhadoriya-5a941818b/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  ref={(el) => (socialRefs.current[1] = el)}
                  className={styles.socialBtn} 
                  aria-label="LinkedIn" 
                  data-cursor-text="LINKEDIN"
                  style={{ '--tech-color': 'rgba(5, 80, 255, 0.22)' }}
                  onMouseMove={(e) => handleSocialMove(e, 1)}
                  onMouseLeave={() => handleSocialLeave(1)}
                >
                  <span className={styles.socialIconInner}><Linkedin size={18} /></span>
                </a>

              </div>
            </div>

          </div>

          {/* Right Column: Glass Card Form */}
          <div className={styles.glassCard} ref={formCardRef}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={styles.formInput} 
                  placeholder="Your Name" 
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className={styles.formInput} 
                  placeholder="name@company.com" 
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>Message Details</label>
                <textarea 
                  id="message" 
                  className={`${styles.formInput} ${styles.formInputtextarea}`} 
                  placeholder="Tell me about your product requirements..." 
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                  disabled={loading}
                ></textarea>
              </div>

              {/* Liquid Hover submit button */}
              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={loading} 
                data-cursor-text="SEND"
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Send Message <ArrowRight size={14} />
                  </span>
                )}
              </button>

              {formStatus === 'success' && (
                <div className={`${styles.formStatus} ${styles.success}`}>
                  <CheckCircle size={16} />
                  <span>{statusMsg}</span>
                </div>
              )}

              {formStatus === 'error' && (
                <div className={`${styles.formStatus} ${styles.error}`}>
                  <AlertCircle size={16} />
                  <span>{statusMsg}</span>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
