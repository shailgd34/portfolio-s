import fs from 'fs';
import path from 'path';

// Copy resume from root to public folder if it exists
try {
  const rootCvPath = path.join(process.cwd(), 'shailash 2026.pdf');
  const publicCvPath = path.join(process.cwd(), 'public', 'shailash 2026.pdf');
  if (fs.existsSync(rootCvPath)) {
    fs.copyFileSync(rootCvPath, publicCvPath);
    console.log('Successfully copied shailash 2026.pdf to public folder');
  }
} catch (err) {
  console.error('Error copying CV:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
