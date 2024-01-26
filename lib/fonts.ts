import fs from 'fs';
import path from 'path';


export async function getFontasArrayBuffer(fontName: string) {
  const fontPath = path.join(process.cwd(), `./assets/fonts/${fontName}`);
  const arrayBuffer = fs.readFileSync(fontPath);
  return arrayBuffer;
}
