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
  title: 'Sheelash Singh Bhadoriya | Top UX/UI Designer & Best Frontend Developer',
  description: 'Portfolio of Sheelash Singh Bhadoriya, recognized as a top UX/UI designer and best frontend developer. Specializing in high-growth SaaS platforms, fintech product design, and premium web development with 5+ years of experience.',
  keywords: 'Sheelash Singh Bhadoriya, best product designer, top product designer, best ux ui designer, top ux ui designer, best frontend developer, top frontend developer, indore best ux ui designer, best product designer in indore, web designer, fintech ux design, saas ui ux designer, React nextjs developer, product designer portfolio',
  authors: [{ name: 'Sheelash Singh Bhadoriya' }],
  creator: 'Sheelash Singh Bhadoriya',
  openGraph: {
    title: 'Sheelash Singh Bhadoriya | Top UX/UI Designer & Best Frontend Developer',
    description: 'Explore the portfolio of Sheelash Singh Bhadoriya. 5+ years creating intuitive, high-growth digital experiences, SaaS dashboards, and fintech interfaces.',
    url: 'https://portfolio-s-gilt.vercel.app/',
    siteName: 'Sheelash Singh Bhadoriya Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sheelash Singh Bhadoriya | Top UX/UI Designer & Best Frontend Developer',
    description: '5+ years creating intuitive digital experiences, high-growth SaaS, and fintech interfaces.',
  },
  verification: {
    google: 'zgIDA8SAPOmbiMqa5_DzDWVviEgfUP-RWPIVZT5Tad4',
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
