import type { ImageMetadata } from 'astro';
// @ts-expect-error : no types for colorthief
import ColorThief from 'colorthief';

export async function getDominantColor(image: ImageMetadata): Promise<string> {
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    const colorThief = new ColorThief();

    return new Promise((resolve) => {
      img.onload = () => {
        const color = colorThief.getColor(img);
        // Convert RGB to hex with opacity
        const [r, g, b] = color;
        resolve(`rgb(${r} ${g} ${b} / 0.1)`);
      };

      img.onerror = () => {
        resolve('rgb(234 179 8 / 0.1)'); // Default yellow color with opacity
      };

      // Use the src from the image metadata
      img.src = image.src;
    });
  } catch (error) {
    console.error('Error getting dominant color:', error);
    return 'rgb(234 179 8 / 0.1)'; // Default yellow color with opacity
  }
}

/**
 * Generate a consistent pastel color from a string
 * @param str Any string to generate a color from
 * @returns A CSS color string with opacity
 */
export function getColorFromString(str: string): string {
  // Generate a consistent hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 90%)`;
}
