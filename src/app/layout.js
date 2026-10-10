import { Antonio, Inter } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import BackgroundNoise from '@/components/BackgroundNoise/BackgroundNoise';
import './globals.css';

const antonio = Antonio({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Sheelash Singh Bhadoriya — Product Designer & UI/UX Specialist',
  description: 'Portfolio of Sheelash Singh Bhadoriya, Product Designer and UI/UX Specialist. Crafting intuitive, high-impact digital products, SaaS dashboards, and modern web applications.',
  keywords: 'Sheelash Singh Bhadoriya, Product Designer, UI/UX Designer, Creative Web Designer, Frontend Developer',
  authors: [{ name: 'Sheelash Singh Bhadoriya' }],
  creator: 'Sheelash Singh Bhadoriya',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${antonio.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          {/* Continuous looping noise.gif texture background overlay */}
          <BackgroundNoise />

          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
