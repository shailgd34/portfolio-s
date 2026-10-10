import fs from 'fs';
import path from 'path';

/**
 * Utility script to batch convert images in the public folder to modern WebP format.
 * Usage:
 *   npm run convert:webp
 *   node scripts/convert-to-webp.js [--update-json]
 */

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('\x1b[31m[ERROR]\x1b[0m "sharp" is not installed yet. Please run: npm install sharp');
  process.exit(1);
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PROJECTS_JSON_SRC = path.join(process.cwd(), 'src', 'data', 'projects.json');
const PROJECTS_JSON_PUB = path.join(process.cwd(), 'public', 'projects.json');

const updateJson = process.argv.includes('--update-json');

async function getAllImageFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await getAllImageFiles(fullPath, fileList);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

async function convertImages() {
  console.log('\x1b[36m%s\x1b[0m', '🔍 Scanning for PNG and JPG images in /public...');
  const files = await getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images to convert.`);

  let convertedCount = 0;
  let totalSavedBytes = 0;

  for (const file of files) {
    const parsed = path.parse(file);
    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

    try {
      const originalStats = fs.statSync(file);
      await sharp(file)
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      const savedBytes = originalStats.size - webpStats.size;
      totalSavedBytes += savedBytes > 0 ? savedBytes : 0;
      convertedCount++;

      const relPath = path.relative(PUBLIC_DIR, webpPath).replace(/\\/g, '/');
      const pct = originalStats.size > 0 
        ? Math.round(((originalStats.size - webpStats.size) / originalStats.size) * 100) 
        : 0;
      console.log(`  ✓ Converted: /${relPath} (-${pct}%)`);
    } catch (err) {
      console.error(`  ✗ Failed converting ${file}:`, err.message);
    }
  }

  const savedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log('\n\x1b[32m%s\x1b[0m', `🎉 Completed! Converted ${convertedCount} images to WebP format.`);
  console.log(`💾 Estimated bandwidth saved: ~${savedMB} MB\n`);

  if (updateJson) {
    console.log('🔄 Updating image references in projects.json to .webp...');
    [PROJECTS_JSON_SRC, PROJECTS_JSON_PUB].forEach((jsonPath) => {
      if (fs.existsSync(jsonPath)) {
        let content = fs.readFileSync(jsonPath, 'utf8');
        content = content.replace(/\.(png|jpe?g)"/gi, '.webp"');
        fs.writeFileSync(jsonPath, content, 'utf8');
        console.log(`  ✓ Updated ${path.relative(process.cwd(), jsonPath)}`);
      }
    });
  } else {
    console.log('💡 Note: Next.js will also automatically convert and serve all images in WebP format on-the-fly via next.config.mjs!');
    console.log('💡 If you want to update projects.json paths to .webp permanently, run:');
    console.log('   node scripts/convert-to-webp.js --update-json\n');
  }
}

convertImages().catch((err) => {
  console.error('Fatal error during conversion:', err);
  process.exit(1);
});
