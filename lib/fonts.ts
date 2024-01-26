import fs from 'fs';
import path from 'path';

export async function getFontasArrayBuffer(fontName: string) {
  const fontPath = path.join(
    process.env.PWD!,
    'assets',
    'fonts',
    `${fontName}`,
  );
  console.log(fontPath);
  const arrayBuffer = fs.readFileSync(fontPath);
  return arrayBuffer;
}
