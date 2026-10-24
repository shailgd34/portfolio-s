'use client';

import React from 'react';
import styles from './TechBadge.module.css';

// Tech and concept definitions with official brand colors & SVG graphics
const TECH_MAP = {
  // --- FIGMA ---
  figma: {
    name: 'Figma',
    color: '#F24E1E',
    svg: (
      <svg viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
      </svg>
    )
  },

  // --- FIGJAM ---
  figjam: {
    name: 'FigJam',
    color: '#9747FF',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#9747FF"/>
        <circle cx="8" cy="8" r="2.5" fill="#FFFFFF"/>
        <circle cx="16" cy="8" r="2.5" fill="#FFFFFF"/>
        <circle cx="8" cy="16" r="2.5" fill="#FFFFFF"/>
        <path d="M13.5 13.5h5v5h-5z" fill="#FFFFFF"/>
      </svg>
    )
  },

  // --- HOTJAR ---
  hotjar: {
    name: 'Hotjar',
    color: '#FF3C38',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1C1814"/>
        <path d="M12 4c3 4 5 8 4 12-1 3-5 3-7 1-2-2 0-6 3-13z" fill="#FF3C38"/>
        <circle cx="12" cy="15" r="2" fill="#FFAA00"/>
      </svg>
    )
  },

  // --- MIRO ---
  miro: {
    name: 'Miro',
    color: '#FFD02F',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#050038"/>
        <polygon points="7,6 11,18 6,18" fill="#FFD02F"/>
        <polygon points="11,6 15,18 10,18" fill="#FFD02F"/>
        <polygon points="15,6 19,18 14,18" fill="#FFD02F"/>
      </svg>
    )
  },

  // --- REACT ---
  react: {
    name: 'React',
    color: '#61DAFB',
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    )
  },

  // --- NEXT.JS ---
  'next.js': {
    name: 'Next.js',
    color: '#000000',
    svg: (
      <svg viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="88" fill="#000000" stroke="#FFFFFF" strokeWidth="6" />
        <path
          d="M148 154L71 54H54v72h13V70l72 94c3.1-2.9 6.2-6 9-10z"
          fill="url(#nextGrad)"
        />
        <rect x="114" y="54" width="13" height="72" fill="url(#nextGrad2)" />
        <defs>
          <linearGradient id="nextGrad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextGrad2" x1="121" y1="54" x2="121" y2="106" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  },

  // --- VERCEL ---
  vercel: {
    name: 'Vercel',
    color: '#FFFFFF',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L23 21H1L12 2Z" fill="#FFFFFF" />
      </svg>
    )
  },

  // --- TAILWIND CSS ---
  'tailwind css': {
    name: 'Tailwind CSS',
    color: '#38BDF8',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
          fill="#38BDF8"
        />
      </svg>
    )
  },

  // --- WORDPRESS ---
  wordpress: {
    name: 'WordPress',
    color: '#21759B',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#21759B" />
        <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
        <path
          d="M3.2 12c0 3.8 2.4 7 5.9 8.2L5.2 9.2C3.9 10 3.2 10.9 3.2 12zm13.1-.6c0-1.2-.4-2-0.8-2.7-.5-.8-1-1.5-1-2.3 0-.9.7-1.7 1.7-1.7.1 0 .2 0 .2.02-1.2-1-2.7-1.6-4.4-1.6-2.3 0-4.3 1.1-5.6 2.7.2 0 .3.02.5.02 1 0 2.5-.1 2.5-.1.5 0 .6.8.1.8 0 0-.5.1-1.1.1l3.5 10.5 2.1-6.3-1.5-4.2c-.5 0-1-.1-1-.1-.5 0-.4-.8.1-.8 0 0 1.5.1 2.5.1 1 0 2.5-.1 2.5-.1.5 0 .6.8.1.8 0 0-.5.1-1.1.1l3.5 10.4 1-3.3c.4-1.4.6-2.4.6-3.2zm-4.3 8.3l2.8-8.1 2.7 7.7c-1.6 1-3.5 1.5-5.5 0.4zm-7.7-1.1l3.5-10.2L11 18.2c-2.4-.6-4.3-2.3-5.2-4.5z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // --- WOOCOMMERCE ---
  woocommerce: {
    name: 'WooCommerce',
    color: '#96588A',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#96588A" />
        <path
          d="M3.5 6.5C3.5 5.1 4.6 4 6 4h12c1.4 0 2.5 1.1 2.5 2.5v7c0 1.4-1.1 2.5-2.5 2.5h-5.5L8.5 19v-3H6c-1.4 0-2.5-1.1-2.5-2.5v-7z"
          fill="#FFFFFF"
          fillOpacity="0.18"
        />
        <text x="12" y="14" fill="#FFFFFF" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          woo
        </text>
      </svg>
    )
  },

  // --- GSAP ---
  gsap: {
    name: 'GSAP',
    color: '#0AE448',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#111813" stroke="#0AE448" strokeWidth="1.2" />
        <path d="M5.5 13.5l3.5 3.5 9-9.5" stroke="#0AE448" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },

  // --- SCROLLTRIGGER ---
  scrolltrigger: {
    name: 'ScrollTrigger',
    color: '#0AE448',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#0C1A10" stroke="#0AE448" strokeWidth="1.2" />
        <path d="M12 5v14m0 0l-4-4m4 4l4-4" stroke="#0AE448" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },

  // --- LENIS SMOOTH SCROLL ---
  lenis: {
    name: 'Lenis',
    color: '#FF6B35',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1C1814" stroke="#FF6B35" strokeWidth="1.2" />
        <path d="M7 16c2-4 4-8 8-8s2 4 2 8" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#FF6B35" />
      </svg>
    )
  },

  // --- SPLIDE JS ---
  splide: {
    name: 'Splide JS',
    color: '#34E0A1',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#121815" stroke="#34E0A1" strokeWidth="1.2" />
        <rect x="5" y="7" width="6" height="10" rx="1" fill="#34E0A1" />
        <rect x="13" y="9" width="6" height="6" rx="1" stroke="#34E0A1" strokeWidth="1.5" />
      </svg>
    )
  },

  // --- VANILLA CSS ---
  'vanilla css': {
    name: 'Vanilla CSS',
    color: '#264DE4',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3z" fill="#264DE4" />
        <path d="M12 3.8v16.7l5.8-1.7L19.2 3.8H12z" fill="#2965F1" />
        <path d="M12 7.7H7.8l.3 3.3h3.9v-3.3zm0 6.6H9.3l-.2-2h-1.5l.4 4.5 4 .9v-3.4zm0-6.6v3.3h3.6l-.3 3.3-3.3.9v3.4l4-1.1.7-7.5H12z" fill="#FFFFFF" />
      </svg>
    )
  },

  // --- SEMANTIC HTML5 ---
  'semantic html5': {
    name: 'HTML5',
    color: '#E34F26',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3z" fill="#E34F26" />
        <path d="M12 3.8v16.7l5.8-1.7L19.2 3.8H12z" fill="#EF652A" />
        <path d="M12 7.7H7.8l.3 3.3h3.9v-3.3zm0 6.6H9.3l-.2-2h-1.5l.4 4.5 4 .9v-3.4zm0-6.6v3.3h3.6l-.3 3.3-3.3.9v3.4l4-1.1.7-7.5H12z" fill="#FFFFFF" />
      </svg>
    )
  },

  // --- PHP ---
  php: {
    name: 'PHP',
    color: '#777BB4',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4" />
        <text x="12" y="14.2" fill="#FFFFFF" fontSize="6.8" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">
          php
        </text>
      </svg>
    )
  },

  // --- ADOBE CC ---
  'adobe cc': {
    name: 'Adobe CC',
    color: '#FA0F00',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#FA0F00" />
        <path
          d="M14.5 7.5C13.2 6.5 11.5 6 9.8 6.2 7 6.6 4.8 8.9 4.3 11.7c-.7 3.7 1.8 7 5.4 7.3 2.1.2 4.1-.7 5.3-2.3.4-.5.1-1.2-.5-1.3-.4-.1-.8.2-1.1.5-.9 1.1-2.3 1.7-3.7 1.5-2.5-.3-4.4-2.5-4.2-5 .2-2.3 2.1-4.1 4.4-4.2 1.4-.1 2.7.5 3.5 1.5.3.4.9.4 1.2.1.4-.3.4-.8.1-1.2l-.2-.1z"
          fill="#FFFFFF"
        />
        <path
          d="M19.7 11.7c-.4-2.8-2.6-5.1-5.4-5.5-.3 0-.6.2-.6.5s.2.6.5.6c2.3.3 4.1 2.2 4.4 4.5.3 2.5-1.4 4.7-3.9 5.1-.3.1-.5.3-.5.6 0 .3.3.5.6.5 3.1-.5 5.2-3.3 4.9-6.3z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // --- PHOTOSHOP ---
  photoshop: {
    name: 'Photoshop',
    color: '#31A8FF',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#001829" stroke="#31A8FF" strokeWidth="1.5" />
        <text x="12" y="16.5" fill="#31A8FF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          Ps
        </text>
      </svg>
    )
  },

  // --- ILLUSTRATOR ---
  illustrator: {
    name: 'Illustrator',
    color: '#FF9A00',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#330000" stroke="#FF9A00" strokeWidth="1.5" />
        <text x="12" y="16.5" fill="#FF9A00" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          Ai
        </text>
      </svg>
    )
  },

  // --- ADOBE XD ---
  'adobe xd': {
    name: 'Adobe XD',
    color: '#FF61F6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#2E001F" stroke="#FF61F6" strokeWidth="1.5" />
        <text x="12" y="16.5" fill="#FF61F6" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          Xd
        </text>
      </svg>
    )
  },

  // --- HTML5 ---
  html5: {
    name: 'HTML5',
    color: '#E34F26',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3z" fill="#E34F26" />
        <path d="M12 3.8v16.7l5.8-1.7L19.2 3.8H12z" fill="#EF652A" />
        <path
          d="M12 7.7H7.8l.3 3.3h3.9v-3.3zm0 6.6H9.3l-.2-2h-1.5l.4 4.5 4 .9v-3.4zm0-6.6v3.3h3.6l-.3 3.3-3.3.9v3.4l4-1.1.7-7.5H12z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // --- CSS3 / CSS MODULES / CUSTOM CSS ---
  css3: {
    name: 'CSS3',
    color: '#1572B6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3z" fill="#1572B6" />
        <path d="M12 3.8v16.7l5.8-1.7L19.2 3.8H12z" fill="#33A9DC" />
        <path
          d="M12 7.7H7.8l.3 3.3h3.9v-3.3zm0 6.6H9.3l-.2-2h-1.5l.4 4.5 4 .9v-3.4zm0-6.6v3.3h3.6l-.3 3.3-3.3.9v3.4l4-1.1.7-7.5H12z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // --- JAVASCRIPT ---
  javascript: {
    name: 'JavaScript',
    color: '#F7DF1E',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path
          d="M6 17.5c1 .5 2 .7 2.8.2.8-.5 1-1.3 1-2.4V8.5H7.7v6.6c0 .7-.3 1-.7 1.1-.3.1-.7 0-1-.2v1.5zm8.5.1c1.5 0 2.6-.4 3.4-1.2l-1.2-1.3c-.6.6-1.3.9-2.2.9-.9 0-1.5-.4-1.5-1.1 0-.7.5-1 1.7-1.4l.6-.2c2-.7 2.8-1.5 2.8-3 0-1.8-1.4-3-3.4-3-1.4 0-2.4.4-3.2 1.1l1.1 1.3c.6-.5 1.3-.8 2.1-.8.8 0 1.4.4 1.4 1 0 .6-.5.9-1.5 1.3l-.6.2c-2 .7-2.9 1.6-2.9 3.1 0 1.9 1.5 3.1 3.4 3.1z"
          fill="#000000"
        />
      </svg>
    )
  },

  // --- TYPESCRIPT ---
  typescript: {
    name: 'TypeScript',
    color: '#3178C6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <text x="12" y="16.5" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          TS
        </text>
      </svg>
    )
  },

  // --- REACT NATIVE ---
  'react native': {
    name: 'React Native',
    color: '#61DAFB',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="1" width="18" height="22" rx="3" stroke="#61DAFB" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="5" ry="2" stroke="#61DAFB" strokeWidth="0.8" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="5" ry="2" stroke="#61DAFB" strokeWidth="0.8" transform="rotate(150 12 12)" />
      </svg>
    )
  },

  // --- WEB3 / CRYPTO / ETHEREUM / BLOCKCHAIN ---
  web3: {
    name: 'Web3',
    color: '#627EEA',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#1C1E24" stroke="#627EEA" strokeWidth="1" />
        <path d="M12 3.5l-4.5 7.5 4.5 2.6 4.5-2.6L12 3.5z" fill="#627EEA" />
        <path d="M12 3.5l4.5 7.5L12 13.6V3.5z" fill="#4E67C9" />
        <path d="M12 14.5l-4.5-2.6 4.5 6.6 4.5-6.6-4.5 2.6z" fill="#627EEA" />
        <path d="M12 14.5l4.5-2.6L12 18.5V14.5z" fill="#4E67C9" />
      </svg>
    )
  },

  // --- NODE.JS ---
  'node.js': {
    name: 'Node.js',
    color: '#339933',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9L12 2z" fill="#339933" />
        <text x="12" y="14" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          node
        </text>
      </svg>
    )
  },

  // --- BOOTSTRAP ---
  bootstrap: {
    name: 'Bootstrap',
    color: '#7952CC',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#7952CC" />
        <text x="12" y="17" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          B
        </text>
      </svg>
    )
  },

  // --- WEBFLOW ---
  webflow: {
    name: 'Webflow',
    color: '#146EF5',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#146EF5" />
        <path
          d="M18.8 8.4c-.1 0-.3.1-.3.2l-2.6 6.8-2.2-6.8c0-.1-.2-.2-.3-.2h-1.6c-.1 0-.3.1-.3.2l-2.6 6.8L6.7 8.6c0-.1-.2-.2-.3-.2H4.2c-.2 0-.3.2-.2.4l3.5 10c.1.2.2.3.4.3h1.8c.2 0 .3-.1.4-.3l2.4-6.4 2.4 6.4c.1.2.2.3.4.3h1.8c.2 0 .3-.1.4-.3l3.5-10c.1-.2 0-.4-.2-.4h-2z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // --- GITHUB ---
  github: {
    name: 'GitHub',
    color: '#FFFFFF',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#161B22" />
        <path
          d="M12 2.2c-5.5 0-10 4.5-10 10 0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1 .8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10z"
          fill="#FFFFFF"
        />
      </svg>
    )
  },

  // ==========================================
  // CONCEPT, UX & CATEGORY DOMAIN BADGES
  // ==========================================

  // --- DISCOVERY UI ---
  'discovery ui': {
    name: 'Discovery UI',
    color: '#0EA5E9',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#0EA5E9" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="#0EA5E9" fillOpacity="0.25" stroke="#0EA5E9" strokeWidth="1.5" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },

  // --- WEB APP ---
  'web app': {
    name: 'Web App',
    color: '#6366F1',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="4" stroke="#6366F1" strokeWidth="2" />
        <path d="M2 8h20" stroke="#6366F1" strokeWidth="1.5" />
        <circle cx="5" cy="5.5" r="1" fill="#6366F1" />
        <circle cx="8" cy="5.5" r="1" fill="#6366F1" />
        <circle cx="11" cy="5.5" r="1" fill="#6366F1" />
        <path d="M8 13l2.5 2.5L8 18M13 18h4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },

  // --- WEB DESIGN ---
  'web design': {
    name: 'Web Design',
    color: '#10B981',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="15" rx="3" stroke="#10B981" strokeWidth="2" />
        <path d="M2 7h20" stroke="#10B981" strokeWidth="1.5" />
        <path d="M8 21h8M12 18v3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <rect x="5" y="10" width="6" height="5" rx="1" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="1" />
      </svg>
    )
  },

  // --- INDUSTRIAL CMS / CMS ---
  'industrial cms': {
    name: 'Industrial CMS',
    color: '#F59E0B',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#F59E0B" strokeWidth="2" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="#F59E0B" strokeWidth="2" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="8" cy="11" r="1" fill="#F59E0B" />
        <circle cx="8" cy="17" r="1" fill="#F59E0B" />
      </svg>
    )
  },

  // --- REAL ESTATE UI / PROPTECH ---
  'real estate ui': {
    name: 'Real Estate UI',
    color: '#06B6D4',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18M5 21V7l8-4v18M13 10l6 3v8" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="11" width="2" height="2" fill="#06B6D4" />
        <rect x="8" y="15" width="2" height="2" fill="#06B6D4" />
      </svg>
    )
  },

  // --- DASHBOARD ---
  dashboard: {
    name: 'Dashboard',
    color: '#10B981',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="9" rx="2" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="5" rx="2" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.8" />
        <rect x="14" y="12" width="7" height="9" rx="2" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.8" />
        <rect x="3" y="16" width="7" height="5" rx="2" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.8" />
      </svg>
    )
  },

  // --- COMMUNITY PORTAL / SOCIAL ---
  'community portal': {
    name: 'Community Portal',
    color: '#EC4899',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="4" stroke="#EC4899" strokeWidth="1.8" />
        <path d="M2 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 11c1.8 0 3.2-1.3 3.2-3s-1.4-3-3.2-3" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 19c0-2-1.6-3.8-3.8-4.3" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },

  // --- UX DESIGN / UI/UX ---
  'ux design': {
    name: 'UX Design',
    color: '#8B5CF6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 19l7-7 3 3-7 7-3-3z" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="1.8" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="#8B5CF6" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="2" fill="#8B5CF6" />
      </svg>
    )
  },

  // --- BUSINESS UI / CORPORATE UI ---
  'business ui': {
    name: 'Business UI',
    color: '#3B82F6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="3" stroke="#3B82F6" strokeWidth="2" />
        <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" stroke="#3B82F6" strokeWidth="2" />
        <path d="M12 11v3M2 13h20" stroke="#3B82F6" strokeWidth="1.5" />
      </svg>
    )
  },

  // --- CRAFTSMANSHIP ---
  craftsmanship: {
    name: 'Craftsmanship',
    color: '#D97706',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2.5" stroke="#D97706" strokeWidth="2" />
        <path d="M7 21l4-13.5M17 21l-4-13.5M9 16h6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },

  // --- FINTECH / FINANCIAL UI / TRADING / BANKING ---
  fintech: {
    name: 'FinTech',
    color: '#EAB308',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#EAB308" strokeWidth="2" />
        <path d="M12 6v12M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },

  // --- MOBILE UI / MOBILE APP ---
  'mobile ui': {
    name: 'Mobile UI',
    color: '#8B5CF6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2" width="14" height="20" rx="3" stroke="#8B5CF6" strokeWidth="2" />
        <line x1="11" y1="18" x2="13" y2="18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="5" x2="14" y2="5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },

  // --- RENTAL PLATFORM / BOOKING ---
  'rental platform': {
    name: 'Rental Platform',
    color: '#14B8A6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="#14B8A6" strokeWidth="2" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="#14B8A6" strokeWidth="1.5" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 14l2.5 2.5L16 12" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },

  // --- SOCIAL APP ---
  'social app': {
    name: 'Social App',
    color: '#EC4899',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#EC4899" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="9" cy="12" r="1" fill="#EC4899" />
        <circle cx="12" cy="12" r="1" fill="#EC4899" />
        <circle cx="15" cy="12" r="1" fill="#EC4899" />
      </svg>
    )
  },

  // --- PROTOTYPING ---
  prototyping: {
    name: 'Prototyping',
    color: '#14B8A6',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" stroke="#14B8A6" strokeWidth="2" />
        <circle cx="18" cy="6" r="3" stroke="#14B8A6" strokeWidth="2" />
        <circle cx="12" cy="18" r="3" stroke="#14B8A6" strokeWidth="2" />
        <path d="M8.5 7.5l7 7M15.5 7.5l-7 7" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    )
  },

  // --- MEDIA DESIGN ---
  'media design': {
    name: 'Media Design',
    color: '#F43F5E',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" stroke="#F43F5E" strokeWidth="2" />
        <polygon points="10,8 16,12 10,16" fill="#F43F5E" />
      </svg>
    )
  },

  // --- LOGISTICS / LOGISTICS UI ---
  logistics: {
    name: 'Logistics',
    color: '#2563EB',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="1" y="3" width="15" height="13" rx="2" stroke="#2563EB" strokeWidth="2" />
        <path d="M16 8h4l3 4v4h-7V8z" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" stroke="#2563EB" strokeWidth="2" />
        <circle cx="18.5" cy="18.5" r="2.5" stroke="#2563EB" strokeWidth="2" />
      </svg>
    )
  },

  // --- E-COMMERCE ---
  'e-commerce': {
    name: 'E-Commerce',
    color: '#FF5A5F',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18" stroke="#FF5A5F" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 10a4 4 0 0 1-8 0" stroke="#FF5A5F" strokeWidth="2" />
      </svg>
    )
  },

  // --- BRAND IDENTITY / BRANDING ---
  'brand identity': {
    name: 'Brand Identity',
    color: '#D946EF',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#D946EF" fillOpacity="0.25" stroke="#D946EF" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2" fill="#D946EF" />
      </svg>
    )
  },

  // --- AI SAAS / GENERATED-AI ---
  'ai saas': {
    name: 'AI SaaS',
    color: '#A855F7',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" fill="#A855F7" fillOpacity="0.3" stroke="#A855F7" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="19" cy="19" r="2" fill="#A855F7" />
        <circle cx="5" cy="19" r="1.5" fill="#A855F7" />
      </svg>
    )
  },

  // --- 3D CONFIG ---
  '3d config': {
    name: '3D Config',
    color: '#38BDF8',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 22V12M12 12L21 7M12 12L3 7" stroke="#38BDF8" strokeWidth="2" />
      </svg>
    )
  },

  // --- EDTECH ---
  edtech: {
    name: 'EdTech',
    color: '#10B981',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 10L12 4 2 10l10 6 10-6z" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
        <path d="M6 12.5V17c0 2 2.7 4 6 4s6-2 6-4v-4.5" stroke="#10B981" strokeWidth="2" />
      </svg>
    )
  },

  // --- ART VAULT / NFT ART ---
  'art vault': {
    name: 'Art Vault',
    color: '#F59E0B',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#F59E0B" />
        <polyline points="21 15 16 10 5 21" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    )
  },

  // --- ENERGY SECTOR ---
  'energy sector': {
    name: 'Energy Sector',
    color: '#FACC15',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FACC15" fillOpacity="0.3" stroke="#FACC15" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    )
  },

  // --- AUTOMOTIVE UI ---
  'automotive ui': {
    name: 'Automotive UI',
    color: '#EF4444',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="#EF4444" />
        <path d="M12 3v6M3 12h6M21 12h-6M6 18l4-4M18 18l-4-4" stroke="#EF4444" strokeWidth="1.8" />
      </svg>
    )
  },

  // --- SPORTS ANALYTICS ---
  'sports analytics': {
    name: 'Sports Analytics',
    color: '#F97316',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#F97316" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="#F97316" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#F97316" />
      </svg>
    )
  },

  // --- SPEECH RECOGNITION ---
  'speech recognition': {
    name: 'Speech Recognition',
    color: '#A855F7',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" stroke="#A855F7" strokeWidth="2" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },

  // --- PAYMENT GATEWAY ---
  'payment gateway': {
    name: 'Payment Gateway',
    color: '#0D9488',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#0D9488" strokeWidth="2" />
        <line x1="2" y1="10" x2="22" y2="10" stroke="#0D9488" strokeWidth="1.8" />
        <circle cx="7" cy="15" r="1.5" fill="#0D9488" />
      </svg>
    )
  },

  // --- RESPONSIVE UI ---
  'responsive ui': {
    name: 'Responsive UI',
    color: '#0284C7',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="14" height="11" rx="2" stroke="#0284C7" strokeWidth="1.8" />
        <rect x="14" y="9" width="8" height="11" rx="2" stroke="#0284C7" strokeWidth="1.8" fill="#0284C7" fillOpacity="0.2" />
        <line x1="18" y1="17" x2="18" y2="17.01" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
};

// Aliases mapping varied names to normalized keys
const ALIASES = {
  // Figma
  fig: 'figma',
  'figma prototype': 'figma',
  'figma design': 'figma',
  'figma web design': 'figma',
  'figma mobile': 'figma',

  // Next.js
  nextjs: 'next.js',
  next: 'next.js',
  'next 14': 'next.js',

  // React
  reactjs: 'react',
  'react.js': 'react',

  // Tailwind
  tailwind: 'tailwind css',
  tailwindcss: 'tailwind css',

  // WordPress
  wp: 'wordpress',
  'custom theme': 'wordpress',

  // WooCommerce
  woo: 'woocommerce',

  // CSS
  css: 'css3',
  'css modules': 'css3',
  'custom css': 'css3',

  // HTML
  html: 'html5',

  // JavaScript
  js: 'javascript',
  es6: 'javascript',

  // TypeScript
  ts: 'typescript',

  // Adobe
  adobe: 'adobe cc',
  'creative cloud': 'adobe cc',
  ps: 'photoshop',
  ai: 'illustrator',
  xd: 'adobe xd',

  // Web3
  crypto: 'web3',
  blockchain: 'web3',
  ethereum: 'web3',
  'nft art': 'art vault',
  'crypto exchange design': 'fintech',
  trading: 'fintech',
  'banking ui': 'fintech',
  'financial ui': 'fintech',
  'mobile payment': 'payment gateway',

  // Mobile
  'mobile application': 'mobile ui',
  'mobile app': 'mobile ui',
  'mobile app design': 'mobile ui',
  'mobile & web': 'mobile ui',
  'ios design': 'mobile ui',
  'ios / android': 'mobile ui',

  // CMS
  cms: 'industrial cms',

  // PropTech
  proptech: 'real estate ui',
  'proptech saas': 'real estate ui',

  // UI/UX
  'ui/ux': 'ux design',
  'ui/ux design': 'ux design',
  'ui design': 'ux design',
  'ux/ui': 'ux design',
  'ux/ui designer': 'ux design',
  'vector art': 'illustrator',
  iconography: 'illustrator',
  typography: 'brand identity',
  'brand guidelines': 'brand identity',
  'brand creative': 'brand identity',
  'brand mark': 'brand identity',
  'brand & logo': 'brand identity',
  'branding & logo': 'brand identity',
  branding: 'brand identity',
  'logo design': 'brand identity',

  // Web concepts
  'web flow': 'webflow',
  'corporate ui': 'business ui',
  'corporate web': 'business ui',
  'enterprise services': 'business ui',
  'saas dashboard': 'dashboard',
  'saas platform': 'dashboard',
  saas: 'dashboard',
  'exchange': 'fintech',
  'booking system': 'rental platform',
  'booking portal': 'rental platform',
  'pet care booking': 'rental platform',
  'hospitality & travel': 'rental platform',
  'travel tourism': 'rental platform',
  'social network': 'social app',
  'social app ui': 'social app',
  'media & social': 'media design',
  'creative ui': 'ux design',
  'interactive': 'prototyping',
  'fullstack concept': 'web app',
  'digital experience': 'web app',
  'landing page': 'responsive ui',
  'edtech app': 'edtech',
  'interactive education': 'edtech',
  'art investment': 'art vault',
  'catering ui': 'catering ui',
  'speech recognition': 'speech recognition',
  'sports analytics': 'sports analytics',
  'automotive ui': 'automotive ui',
  'energy sector': 'energy sector',
  'generated-ai': 'ai saas',
  'ai': 'ai saas'
};

// Helper to look up tech info
export function getTechInfo(rawName) {
  if (!rawName) return null;
  const clean = String(rawName).trim().toLowerCase();
  const resolvedKey = ALIASES[clean] || clean;

  if (TECH_MAP[resolvedKey]) {
    return {
      ...TECH_MAP[resolvedKey],
      displayName: String(rawName).trim()
    };
  }

  // Fallback: check partial substring matching
  for (const [key, val] of Object.entries(TECH_MAP)) {
    if (clean.includes(key)) {
      return {
        ...val,
        displayName: String(rawName).trim()
      };
    }
  }

  // Default fallback icon (sleek generic spark)
  return {
    name: String(rawName).trim(),
    displayName: String(rawName).trim(),
    color: '#FF6B35',
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#FF6B35" fillOpacity="0.4" stroke="#FF6B35" strokeWidth="1.8" />
      </svg>
    )
  };
}

export default function TechBadge({ name, compact = false, className = '' }) {
  const tech = getTechInfo(name);
  if (!tech) return null;

  return (
    <div className={`${styles.badgeWrapper} ${className}`} title={tech.displayName}>
      <div
        className={`${styles.badge} ${compact ? styles.badgeCompact : ''}`}
        aria-label={tech.displayName}
      >
        <span className={styles.iconSvg}>
          {tech.svg}
        </span>
      </div>
      <span className={styles.tooltip}>{tech.displayName}</span>
    </div>
  );
}

// Helper component for "+N" more technologies badge
export function TechMoreBadge({ count, remainingNames = [], className = '' }) {
  if (!count || count <= 0) return null;

  const tooltipText = remainingNames.length > 0 ? remainingNames.join(', ') : `+${count} more`;

  return (
    <div className={`${styles.badgeWrapper} ${className}`} title={tooltipText}>
      <span className={styles.moreCountPill}>
        +{count}
      </span>
      {remainingNames.length > 0 && (
        <span className={styles.tooltip}>{tooltipText}</span>
      )}
    </div>
  );
}
