const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, 'public', 'portfolio');
const pageFile = path.join(__dirname, 'src', 'data', 'projectsData.js');

const colors = ['rgba(189, 0, 255, 0.18)', 'rgba(0, 240, 255, 0.18)', 'rgba(242, 78, 30, 0.18)', 'rgba(5, 80, 255, 0.18)', 'rgba(255, 199, 0, 0.18)', 'rgba(255, 154, 0, 0.18)', 'rgba(255, 97, 246, 0.18)'];

// Read the folders
const folders = fs.readdirSync(portfolioDir).filter(f => fs.statSync(path.join(portfolioDir, f)).isDirectory());

// Read page.js
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Find the projectsData array using regex
const arrayRegex = /export const projectsData = (\[[\s\S]*?\]);/;
const match = pageContent.match(arrayRegex);

if (!match) {
    console.error("Could not find projectsData array");
    process.exit(1);
}

// Evaluate the array (it's safe here since we just read it locally)
let existingProjects;
try {
    // using eval to parse JS object string (not standard JSON)
    existingProjects = eval(match[1]); 
} catch (e) {
    console.error("Failed to parse projectsData:", e);
    process.exit(1);
}

// Update the array
folders.forEach((folder, i) => {
    const folderPath = path.join(portfolioDir, folder);
    const files = fs.readdirSync(folderPath);
    const mainImage = files.find(f => f.startsWith('mainone.'));
    
    if (mainImage) {
        const id = folder.toLowerCase().replace(/ /g, '-');
        const imagePath = `/portfolio/${folder}/${mainImage}`;
        
        // Find existing project
        const existing = existingProjects.find(p => p.id === id || p.title.toLowerCase() === folder.toLowerCase());
        
        if (existing) {
            existing.image = imagePath;
            // Optionally update color if you want, but user said "overwrite new one old" so let's just update image.
        } else {
            existingProjects.push({
                id: id,
                title: folder,
                category: 'creative',
                desc: `Portfolio project for ${folder}.`,
                role: 'UX/UI Designer',
                timeline: '2024',
                tools: 'Figma, Adobe CC',
                link: '#',
                color: colors[i % colors.length],
                image: imagePath
            });
        }
    }
});

// Format back to string
let newArrayStr = '[\n';
existingProjects.forEach(p => {
    newArrayStr += '    {\n';
    for (const [k, v] of Object.entries(p)) {
        if (v === undefined) continue;
        newArrayStr += `      ${k}: '${v}',\n`;
    }
    newArrayStr += '    },\n';
});
newArrayStr += '  ]';

pageContent = pageContent.replace(arrayRegex, `export const projectsData = ${newArrayStr};`);

fs.writeFileSync(pageFile, pageContent, 'utf8');
console.log("Updated page.js successfully!");
