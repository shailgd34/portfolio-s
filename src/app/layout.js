import { Plus_Jakarta_Sans, Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const serifItalic = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-italic',
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
});

export const metadata = {
  title: 'Sheelash Singh Bhadoriya | Product Designer & Frontend Developer',
  description: 'Portfolio of Sheelash Singh Bhadoriya, an Indore-based Product Designer & UX/UI Lead with 5 years of experience specializing in Fintech startups and high-impact digital experiences.',
  keywords: 'Sheelash Singh Bhadoriya, Product Designer, UX/UI Lead, UX Designer, UI Designer, Frontend Developer, Web Designer, Fintech UX, Savo Technology, Indore Portfolio',
  authors: [{ name: 'Sheelash Singh Bhadoriya' }],
  creator: 'Sheelash Singh Bhadoriya',
  openGraph: {
    title: 'Sheelash Singh Bhadoriya | Product Designer & Frontend Developer',
    description: 'Explore the portfolio of Sheelash Singh Bhadoriya. 5+ years creating intuitive digital experiences and high-growth fintech interfaces.',
    url: 'https://behance.net/prithvibhadour',
    siteName: 'Sheelash Singh Bhadoriya Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sheelash Singh Bhadoriya | Product Designer & Frontend Developer',
    description: '5+ years creating intuitive digital experiences and high-growth fintech interfaces.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serifItalic.variable}`}>
      <body>
        {/* Grain Noise Overlay Filter */}
        <svg 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.04,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          aria-hidden="true"
        >
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Ambient background leaks */}
        <div className="bg-ambient-wrapper">
          <div className="ambient-blob blob-1"></div>
          <div className="ambient-blob blob-2"></div>
          <div className="ambient-blob blob-3"></div>
        </div>

        {children}
      </body>
    </html>
  );
}
