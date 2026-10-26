import rawProjectsJson from '@/data/projects.json';
import { logosData } from '@/data/logosData';

// Helper to convert any title/id to a clean URL-friendly slug
export function slugify(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Site-wide data for Sheelash Singh Bhadoriya
export const siteData = {
  name: "Sheelash Singh Bhadoriya",
  firstName: "SHEELASH",
  lastName: "BHADORIYA",
  heroDisplayName: "SHEELASH", // Renders in giant letters behind portrait
  role: "Product Designer | UI/UX & Design Systems",
  roleLine: "Product Designer | UI/UX & Design Systems",
  tagline: "I design digital products and build them in code, from the first sketch to scalable production releases.",
  statement: "Product Designer and Frontend Developer with 6 years of experience creating user-centered digital products, SaaS platforms, and responsive web applications with Figma, React, Next.js, and WordPress.",
  email: "shailashs79@gmail.com",
  phone: "+91 9516372235",
  city: "Indore, India",
  tz: "Asia/Kolkata",
  avail: "Available for work — Immediate Joiner",
  noticePeriod: "Immediate Joiner",
  status: "Immediate Joiner",
  resume: "/Sheelash Singh Bhadoriya - Resume.pdf",
  socials: "LinkedIn:https://www.linkedin.com/in/sheelash-singh-bhadoriya-5a941818b/,Behance:https://www.behance.net/prithvibhadour,WhatsApp:https://wa.me/919516372235,Email:mailto:shailashs79@gmail.com",
  years: "6",
  book: "/contact",
  portrait: "/profile.webp",
  templatePortrait: "/profile.webp",
};

export const defaultBackdrops = "Bone:#E6DED1;Tangerine:#FF5B2E;Ink:#171311";

const PALETTE = ['#FF5B2E', '#22C3EE', '#3DDC84', '#A58BFF', '#FFB224', '#E0435B'];

const getIconType = (p) => {
  const text = `${p.category || ''} ${p.type || ''}`.toLowerCase();
  if (text.includes('app') || text.includes('mobile') || text.includes('ios') || text.includes('android')) return 'app';
  if (text.includes('dashboard') || text.includes('saas') || text.includes('fintech') || text.includes('telemetry') || text.includes('portal') || text.includes('analytics')) return 'dash';
  if (text.includes('react') || text.includes('fullstack') || text.includes('code') || text.includes('node') || text.includes('next')) return 'code';
  if (text.includes('brand') || text.includes('identity') || text.includes('agency') || text.includes('creative')) return 'brand';
  return 'photo';
};

export const getCleanCategory = (item) => {
  const t = (item.type || '').toLowerCase();
  const c = (item.category || '').toLowerCase();
  const name = (item.name || item.title || item.id || '').toLowerCase();
  const tech = (Array.isArray(item.technology) ? item.technology.join(' ') : (item.technology || '')).toLowerCase();

  // 1. WordPress (WordPress & WooCommerce websites)
  if (
    t.includes('wordpress') ||
    c.includes('wordpress') ||
    tech.includes('wordpress') ||
    name.includes('wordpress') ||
    tech.includes('elementor') ||
    tech.includes('woocommerce')
  ) {
    return 'WordPress';
  }

  // 2. React / Next (fullstack, React web apps, Next.js releases)
  if (
    t.includes('react') ||
    t.includes('next') ||
    c.includes('react') ||
    c.includes('next') ||
    c.includes('fullstack') ||
    name.includes('7sens') ||
    name.includes('fresh art') ||
    tech.includes('next.js') ||
    tech.includes('react')
  ) {
    return 'React / Next';
  }

  // 3. Mobile App (iOS, Android, mobile prototypes & apps)
  if (
    t.includes('mobile app') ||
    t.includes('phone') ||
    c.includes('mobile') ||
    t.includes('ios') ||
    t.includes('android') ||
    name.includes('mobile') ||
    name.includes('app')
  ) {
    return 'Mobile App';
  }

  // 4. UI/UX (B2B SaaS, Web UI/UX, Design systems, Dashboards, Figma prototypes)
  return 'UI/UX';
};

// All 61 real projects from projects.json plus 17 brand logos formatted for the Voss design system
const baseProjects = rawProjectsJson.map((p, idx) => {
  const cleanSlug = slugify(p.slug || p.id || p.name || p.title);
  return {
    slug: cleanSlug,
    f1: p.title || p.name,
    f2: p.client || p.category || 'Digital Product',
    f3: getCleanCategory(p),
    f4: p.year || (p.timeline ? p.timeline.split('—')[0].trim() : '2025'),
    f5: p.description || 'High-impact product and interaction design engineered for commercial scale.',
    img: p.image || '/profile.webp',
    f6: getIconType(p),
    f7: PALETTE[idx % PALETTE.length],
    f8: p.role || 'Senior Product Designer',
    f9: p.timeline || 'Design & Code',
    f10: p.featureTag === 'top' ? 'Featured Case Study' : (p.category || 'Production release'),
    n1: String(idx + 1),
    link: `/work/${cleanSlug}`,
    externalLink: p.link || p.liveLink || '',
    figmaLink: (p.figmaLink && p.figmaLink.trim() !== '')
      ? p.figmaLink.trim()
      : ((p.link && p.link.includes('figma.com'))
        ? p.link.trim()
        : ((p.liveLink && p.liveLink.includes('figma.com'))
          ? p.liveLink.trim()
          : (p.type && p.type.toLowerCase().includes('figma') ? 'https://www.figma.com/proto/NZc8NlQXXgQpO5VxYs73uN/Seductive-Seeker?node-id=59-1055' : ''))),
    liveLink: p.liveLink || p.link || '',
    technology: p.technology || [],
  };
});

export const logoProjects = (logosData || []).map((logo, idx) => {
  const cleanSlug = slugify(logo.id || logo.title);
  return {
    slug: cleanSlug,
    f1: logo.title,
    f2: logo.client || logo.industry || 'Brand Identity',
    f3: logo.category || 'Brand Identity',
    f4: logo.year || '2025',
    f5: logo.desc || 'Brand identity, logomark, and visual design system.',
    img: logo.image,
    f6: 'brand',
    f7: logo.accentColor || '#FF5B2E',
    f8: 'Brand & Logo Designer',
    f9: 'Identity Design',
    f10: logo.tagText || 'TRADEMARK',
    n1: String(idx + 1),
    link: `/work/${cleanSlug}`,
    externalLink: '',
    figmaLink: '',
    liveLink: '',
    technology: ['Illustrator', 'Figma', 'Vector Art', ...(logo.deliverables || [])],
    isLogo: true,
    logoData: logo,
  };
});

// All 61 real projects from projects.json formatted for the Voss design system
export const allProjects = baseProjects;

// Top 9 projects specified for Homepage display in exact user-requested order:
// 1. Fresh Art Club
// 2. IJ Art
// 3. Seductive Seeker
// 4. Runner
// 5. NZL App
// 6. iPixit
// 7. Siddhachalam
// 8. Active Communities
// 9. 7Sens
const TOP_SLUGS = [
  'milo-luxury-residence',
  'fresh-art-club',
  'ij-art-bank',
  'seductive-seeker',
  'runner',
  'nzl-app',
  'ipixit-photo-sharing-app',
  'siddhachalam-web-app',
  'active-communities',
  '7sens',
];

export const topHomeProjects = TOP_SLUGS.map((slug, idx) => {
  const found = allProjects.find((p) => p.slug === slug || p.slug.startsWith(slug.slice(0, 6)));
  if (!found) return allProjects[idx % allProjects.length];
  return {
    ...found,
    n1: String(idx + 1),
  };
});

// Default to allProjects across the entire portfolio
export const defaultProjects = allProjects;

export const defaultServices = [
  {
    slug: "product-design",
    f1: "Product design",
    f2: "Complex SaaS platforms and mobile apps from first wireframe to shipped release.",
    f3: "I map product telemetry with your team, design frictionless user flows, test with real users, and craft every micro-interaction and empty state.",
    f4: "User flows;Wireframes;Interactive prototypes;Usability testing;SaaS UI",
    f5: "#FF5B2E",
    f6: "product",
    n1: "1",
  },
  {
    slug: "design-systems",
    f1: "Design systems",
    f2: "One unified multi-brand component library for designers and engineers.",
    f3: "Semantic tokens, accessible components, and interactive documentation that live seamlessly in Figma and in code, ending design drift forever.",
    f4: "Design tokens;Figma variables;React components;Documentation;Governance",
    f5: "#FFB224",
    f6: "system",
    n1: "2",
  },
  {
    slug: "front-end-engineering",
    f1: "Front-end engineering",
    f2: "Production code in React, Next.js 15, TypeScript, and modern CSS.",
    f3: "Pixel-perfect, high-performance interfaces with 60fps animations, rock-solid accessibility, and zero compromise between design vision and production code.",
    f4: "Next.js 15;React;TypeScript;Motion physics;Clean architecture",
    f5: "#3DDC84",
    f6: "dev",
    n1: "3",
  },
  {
    slug: "ui-ux-architecture",
    f1: "UI/UX architecture",
    f2: "Information hierarchy and data-dense dashboards built for scale.",
    f3: "High-density data visualization, multi-step financial & analytical workflows, and enterprise design patterns optimized for rapid cognitive processing.",
    f4: "Telemetry dashboards;Information architecture;Data visualization;Enterprise SaaS",
    f5: "#22C3EE",
    f6: "brand",
    n1: "4",
  },
];

export const defaultExperience = [
  {
    slug: "savo",
    f1: "Senior Product Designer & Frontend Developer",
    f2: "Savo Technology Pvt. Ltd.",
    f3: "11/2022 — 10/2026",
    f4: "Led end-to-end UI/UX design and frontend development for SaaS and enterprise platforms. Created design systems in Figma and shipped production interfaces in React, Next.js, and WordPress.",
    f5: "work",
    n1: "1",
  },
  {
    slug: "votive",
    f1: "UI/UX & Web Designer",
    f2: "Votive Technologies Pvt. Ltd.",
    f3: "06/2021 — 11/2022",
    f4: "Designed responsive interfaces, user flows, wireframes, and prototypes for international clients. Built and customized WordPress websites using Elementor.",
    f5: "work",
    n1: "2",
  },
  {
    slug: "mind-info",
    f1: "Web Design Trainee",
    f2: "Mind Info Services",
    f3: "06/2020 — 06/2021",
    f4: "Learned HTML5 and CSS3 fundamentals, assisted with responsive layouts, and practiced user-centered design principles in production workflows.",
    f5: "work",
    n1: "3",
  },
  {
    slug: "diploma-mechanical",
    f1: "Diploma in Engineering (Mechanical)",
    f2: "RGPV University (Rajiv Gandhi Technical University), Bhopal",
    f3: "2011 — 2014",
    f4: "Engineering design principles, technical drawing, analytical problem solving, and computer-aided design.",
    f5: "edu",
    n1: "4",
  },
  {
    slug: "design-distinction",
    f1: "Design System Architecture Lead",
    f2: "Enterprise SaaS Ecosystems",
    f3: "2025",
    f4: "Architected unified 140+ component tokenized multi-brand design systems accelerating feature shipments by 40%.",
    f5: "award",
    n1: "5",
  },
  {
    slug: "verified-deliveries",
    f1: "50+ Production Releases",
    f2: "Global Client Deployments",
    f3: "2026",
    f4: "Delivered production SaaS, FinTech dashboards, and mobile prototypes across US, Europe, UAE, and India.",
    f5: "award",
    n1: "6",
  },
];

export const defaultReviews = [
  {
    slug: "fresh-art-review",
    f1: "Jordi Aunbell",
    f2: "Founder & Creative Director",
    f3: "Fresh Art Club · 2025",
    f4: "Sheelash designed our platform and design system from scratch. Clean workflows that helped us scale effortlessly.",
    f5: "Fresh Art Club",
  },
  {
    slug: "ij-art-review",
    f1: "Ingram Jean",
    f2: "Founder & Director",
    f3: "IJ Art Bank · 2025",
    f4: "Working with Sheelash was effortless. He delivered a clean, luxurious interface ahead of schedule.",
    f5: "IJ Art Bank",
  },
  {
    slug: "nzl-app-review",
    f1: "Noor Al-Thani",
    f2: "Founder & Product Lead",
    f3: "NZL App · 2025",
    f4: "Exceptional UI/UX clarity for our mobile app. The booking flows are fast, modern, and intuitive.",
    f5: "NZL App",
  },
  {
    slug: "out-app-review",
    f1: "Saeed",
    f2: "Founder & CEO",
    f3: "Out App · 2025",
    f4: "From Figma prototypes to live interactions, Sheelash made our app look sleek, responsive, and easy to use.",
    f5: "Out App",
  },
  {
    slug: "crconi-digital-review",
    f1: "Vikramaditya",
    f2: "Managing Director & Founder",
    f3: "Crconi Digital · 2025",
    f4: "A rare designer who understands both clean aesthetics and fast execution. Excellent turnaround.",
    f5: "Crconi Digital",
  },
];

export const defaultLab = [
  {
    slug: "fresh-art-canvas",
    f1: "Creator Canvas Engine",
    f2: "Fresh Art Club · Web App",
    f3: "2025",
    f4: "Next.js;Figma;Framer Motion;Canvas",
    img: "/portfolio/fresh art club/mainone.png",
    logo: "/logo/designerverse logo.png",
    client: "Fresh Art Club",
  },
  {
    slug: "curated-art-viewport",
    f1: "Curated Art Viewport",
    f2: "IJ Art Bank · FinTech & Art",
    f3: "2025",
    f4: "React;Next.js;CSS;Figma",
    img: "/ijart.png",
    logo: "/logo/ij logo.png",
    client: "IJ Art Bank",
  },
  {
    slug: "ipixit-photo-grid",
    f1: "Photo Grid & Telemetry",
    f2: "iPixit · Mobile Social App",
    f3: "2025",
    f4: "React Native;Figma;Mobile UI",
    img: "/ipixitapp.png",
    logo: "/logo/ipixit logo.png",
    client: "iPixit",
  },
  {
    slug: "order-flow-terminal",
    f1: "Order Flow Terminal",
    f2: "TugaTrades · FinTech L2",
    f3: "2025",
    f4: "Next.js;WebGL;Canvas;WebSocket",
    img: "/tugatraders.png",
    logo: "/logo/kzm logo.png",
    client: "TugaTrades",
  },
  {
    slug: "dispatch-board-radar",
    f1: "Fleet Dispatch Radar",
    f2: "TradeZone · Logistics Dashboard",
    f3: "2025",
    f4: "TypeScript;React;Next.js;GPS",
    img: "/tradezone.png",
    logo: "/logo/gmkc logo.png",
    client: "GMKC Logistics",
  },
  {
    slug: "sound-matrix-interactive",
    f1: "Sound Matrix Experience",
    f2: "Harmonity · Mobile App",
    f3: "2025",
    f4: "React Native;Mobile UX;Figma",
    img: "/harmonityapp.png",
    logo: "/logo/harmonity logo.png",
    client: "Harmonity",
  },
  {
    slug: "smart-living-surface",
    f1: "Smart Living Surface",
    f2: "Pyro Home · IoT Ecosystem",
    f3: "2025",
    f4: "React;Tailwind;Next.js;IoT",
    img: "/pryohome.png",
    logo: "/logo/pyro logo.png",
    client: "Pyro Home",
  },
];

export const defaultPosts = [
  {
    slug: "sub-second-decision-velocity",
    f1: "Designing Mobile Apps That People Actually Love Using",
    f2: "Oct 2026",
    f3: "4 min read",
    f4: "Simple principles for clear onboarding, smooth checkout flows, and natural gestures that feel effortless in hand.",
    img: "/tugatraders.png",
  },
  {
    slug: "building-figma-design-systems-fast-dev",
    f1: "Building Figma Design Systems for Fast Development",
    f2: "Aug 2026",
    f3: "5 min read",
    f4: "How I organize Figma components, color tokens, and layout grids so developers can code them in React without confusion.",
    img: "https://framerusercontent.com/images/VJUprwfcrDZhu5hrAX7RykPiVU.webp",
  },
  {
    slug: "designing-saas-dashboards-without-clutter",
    f1: "Designing SaaS Dashboards Without Clutter",
    f2: "May 2025",
    f3: "4 min read",
    f4: "How to take complex business data and turn it into clean, easy-to-read charts and tables that speed up daily work.",
    img: "/tradezone.png",
  },
  {
    slug: "from-figma-to-clean-code-guide",
    f1: "From Figma to Clean Code: A Designer's Guide",
    f2: "Feb 2025",
    f3: "3 min read",
    f4: "Why understanding HTML, CSS, and modern frontend tools makes you a 10x better product designer and saves weeks of back-and-forth.",
    img: "https://framerusercontent.com/images/HCyXSnJj8tsOubkimG9feSzY.webp",
  },
];

export const defaultAboutMoments =
  "2011|Diploma in Mechanical Engineering at RGPV, Bhopal;2020|Web Design Trainee at Mind Info Services;2021|UI/UX & Web Designer at Votive Technologies;2022|Senior Product Designer & Frontend Dev at Savo;2025|Architected 140+ component Figma design system;2026|Immediate Joiner · Open for Product Design & Frontend roles";

export const defaultAboutRules = [
  {
    title: "Design and development together",
    body: "I design in Figma and build with Next.js. This helps me test ideas early and make sure the final product looks and works as expected.",
  },
  {
    title: "Small steps, regular updates",
    body: "I break big projects into smaller tasks and deliver them step by step. This helps me get feedback early and improve the product faster.",
  },
  {
    title: "Clear and direct communication",
    body: "I work closely with clients and developers to understand requirements, solve problems, and make decisions quickly.",
  },
];

export const defaultCurrently =
  "Reading|Refactoring UI & Design Systems Handbook;Exploring|Figma Variables & Framer Motion Physics;Building|Modern SaaS Platforms & Component Libraries";

export const defaultBandCaps =
  "Figma Design Systems;Product Workspace, Indore;Mobile & SaaS Prototypes";

export const defaultContactHours = "1-5 09:30-18:30";
