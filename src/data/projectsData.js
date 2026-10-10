import projectsJson from './projects.json';

export const projectsData = projectsJson.map(p => ({
  id: p.id,
  title: p.title || p.name,
  name: p.name || p.title,
  category: p.category,
  type: p.type,
  desc: p.description,
  description: p.description,
  role: p.role || 'UX/UI Designer',
  timeline: '2024 - 2026',
  tools: Array.isArray(p.technology) ? p.technology.join(', ') : p.technology,
  technology: p.technology,
  link: p.link,
  figmaLink: p.figmaLink,
  liveLink: p.liveLink,
  color: p.isFeatured ? 'rgba(189, 0, 255, 0.18)' : 'rgba(0, 240, 255, 0.18)',
  image: p.image,
  isFeatured: p.isFeatured,
  featureTag: p.featureTag
}));

export default projectsData;