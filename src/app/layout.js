import { Antonio, Manrope, Caveat } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import BackgroundNoise from '@/components/BackgroundNoise/BackgroundNoise';
import Cursor from '@/components/Cursor/Cursor';
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
  title: 'Sheelash Singh Bhadoriya — Product Designer & UI/UX Specialist',
  description: 'Portfolio of Sheelash Singh Bhadoriya, Product Designer and UI/UX Specialist. Crafting intuitive, high-impact digital products, SaaS dashboards, and modern web applications.',
  keywords: 'Sheelash Singh Bhadoriya, Product Designer, UI/UX Designer, Creative Web Designer, Frontend Developer',
  authors: [{ name: 'Sheelash Singh Bhadoriya' }],
  creator: 'Sheelash Singh Bhadoriya',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '64x64' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${antonio.variable} ${manrope.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,300..900;1,300..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Antonio:wght@400;500;600;700&family=Caveat:wght@400;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
