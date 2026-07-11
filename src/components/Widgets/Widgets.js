'use client';

import { useState, useEffect } from 'react';
import { MessageSquareCode, ArrowUp } from 'lucide-react';
import styles from './Widgets.module.css';

export default function Widgets() {
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll position to show/hide the back to top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.widgetContainer}>
      {/* Sticky WhatsApp Button */}
      <a 
        href="https://wa.me/919516372235" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.whatsappButton}
        aria-label="Contact Sheelash on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.25.003 9.522-4.265 9.525-9.518.002-2.546-.988-4.941-2.79-6.746a9.479 9.479 0 0 0-6.734-2.737C6.015 1.548 1.748 5.812 1.745 11.066c-.001 1.562.433 3.09 1.257 4.437l-.95 3.473 3.548-.93c1.332.726 2.68 1.118 4.048 1.118zM18.22 14c-.3-.15-1.782-.88-2.062-.982-.28-.102-.485-.153-.69.153-.205.305-.795 1.002-.974 1.205-.18.204-.359.229-.66.079a8.307 8.307 0 0 1-2.457-1.517 9.176 9.176 0 0 1-1.7-2.115c-.18-.305-.019-.47.131-.619.135-.135.3-.349.45-.524.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.526-.075-.15-.69-1.666-.945-2.278-.249-.611-.523-.529-.718-.539-.185-.01-.397-.012-.61-.012s-.56.08-.853.399c-.293.32-1.119 1.096-1.119 2.673s1.147 3.1 1.302 3.3c.156.2 2.257 3.447 5.467 4.836.763.33 1.359.527 1.823.674.767.243 1.465.209 2.016.127.615-.093 1.782-.728 2.032-1.432.25-.704.25-1.307.175-1.432-.076-.125-.281-.225-.581-.375z" />
        </svg>
      </a>

      {/* Sticky Back To Top Button */}
      <button 
        onClick={scrollToTop} 
        className={`${styles.backToTopButton} ${isVisible ? styles.visible : ''}`}
        aria-label="Scroll to top of the page"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
}
