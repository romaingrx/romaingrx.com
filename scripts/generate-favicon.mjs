import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import ico from 'sharp-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateFavicon() {
  try {
    // Read the SVG file
    const svg_logo = await fs.readFile(
      path.join(__dirname, '../src/components/logo/logo.svg'),
      'utf-8'
    );

    // Generate different sizes
    const buffers = await Promise.all([
      sharp(Buffer.from(svg_logo)).resize(64).toFormat('png').toBuffer(),
      sharp(Buffer.from(svg_logo)).resize(32).toFormat('png').toBuffer(),
      sharp(Buffer.from(svg_logo)).resize(16).toFormat('png').toBuffer(),
    ]);

    // Create ICO file
    const icoBuffer = ico.encode(buffers);

    // Ensure the public directory exists
    await fs.mkdir(path.join(__dirname, '../public'), { recursive: true });

    // Write the favicon
    await fs.writeFile(path.join(__dirname, '../public/favicon.ico'), icoBuffer);

    console.log('✓ Favicon generated successfully');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
