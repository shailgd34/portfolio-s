import Script from 'next/script';
import { Antonio, Manrope, Caveat } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import BackgroundNoise from '@/components/BackgroundNoise/BackgroundNoise';
import Cursor from '@/components/Cursor/Cursor';
import MvLoader from '@/components/voss/MvLoader';
import ProjectShowcase from '@/components/ProjectShowcase/ProjectShowcase';
import VisitorTracker from '@/components/VisitorTracker/VisitorTracker';
import MvPageTrans from '@/components/voss/MvPageTrans';
import 'lenis/dist/lenis.css';
import './globals.css';

const antonio = Antonio({
  subsets: ['latin'],
  variable: '--font-antonio-next',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope-next',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat-next',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Sheelash B. — Product Designer & UI/UX Specialist',
  description: 'Portfolio of Sheelash Singh Bhadoriya, Product Designer and UI/UX Specialist. Crafting intuitive, high-impact digital products, SaaS dashboards, and modern web applications.',
  keywords: 'Sheelash Singh Bhadoriya, Product Designer, UI/UX Designer, Creative Web Designer, Frontend Developer',
  authors: [{ name: 'Sheelash Singh Bhadoriya' }],
  creator: 'Sheelash Singh Bhadoriya',
  icons: {
    icon: [
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
      { url: '/icon.svg?v=4', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg?v=4',
    apple: '/favicon.svg?v=4',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${antonio.variable} ${manrope.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=4" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=4" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=4" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900&family=Chivo+Mono:ital,wght@0,300..600;1,300..600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,300..900;1,300..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Antonio:wght@400;500;600;700&family=Caveat:wght@400;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Synchronous script to prepare film loader state without visual flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var seen = sessionStorage.getItem('mv-loaded');
                var hasForce = window.location.search.indexOf('loader') !== -1 || window.location.search.indexOf('intro') !== -1;
                if (!seen || hasForce) {
                  document.documentElement.classList.add('mv-hold-ld', 'mvld-go');
                }
              } catch(e) {}
            `,
          }}
        />

        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7S1N99XFBB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7S1N99XFBB');
          `}
        </Script>
      </head>
      <body>
        <MvPageTrans />
        <VisitorTracker />
        <MvLoader
          enabled={true}
          once={true}
          slate="Portfolio 2026 · Scene 01 · Take 1 · Sheelash Singh Bhadoriya"
        />
        <ProjectShowcase />
        <SmoothScroll>
          {/* Continuous looping noise.gif texture background overlay */}
          <BackgroundNoise />
          <Cursor />

          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
