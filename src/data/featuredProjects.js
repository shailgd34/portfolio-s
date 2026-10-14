// ==============================================================================
// HOMEPAGE FEATURED PROJECTS (DYNAMICALLY SOURCED FROM projects.json)
// ==============================================================================
// You NO LONGER need to edit this file or Projects.js manually!
// To show or hide any project on the homepage:
// Simply open public/projects.json or src/data/projects.json and set:
//   "isFeatured": true   (to show on homepage)
//   "isFeatured": false  (to hide from homepage)
// ==============================================================================

import projectsJson from './projects.json';

export const featuredProjects = projectsJson.filter((p) => Boolean(p.isFeatured));

export default featuredProjects;
