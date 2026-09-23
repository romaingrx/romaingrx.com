import satori from 'satori';
import sharp from 'sharp';

import logoSvg from '@/components/logo/logo.svg?raw';
import { site } from '@/configs/site';

const ogColors = {
  primary: '#d5b990',
  primaryForeground: '#291f10',
  mutedForeground: '#5c4623',
} as const;

interface OGAssets {
  logo: string;
  fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 500 | 800;
    style: 'normal';
  }[];
}

let ogAssetsPromise: Promise<OGAssets> | undefined;

// These immutable image assets are shared for one build process; content is read per route.
function loadOGAssets(): Promise<OGAssets> {
  if (!ogAssetsPromise) {
    ogAssetsPromise = Promise.all([
      fetch('https://api.fontsource.org/v1/fonts/inter/latin-800-normal.ttf').then((response) => {
        if (!response.ok) throw new Error(`Failed to load the OG bold font: ${response.status}`);
        return response.arrayBuffer();
      }),
      fetch('https://api.fontsource.org/v1/fonts/inter/latin-500-normal.ttf').then((response) => {
        if (!response.ok) throw new Error(`Failed to load the OG regular font: ${response.status}`);
        return response.arrayBuffer();
      }),
      sharp(Buffer.from(logoSvg)).resize(40).png().toBuffer(),
    ])
      .then(([bold, regular, logo]) => ({
        logo: `data:image/png;base64,${logo.toString('base64')}`,
        fonts: [
          { name: 'Inter', data: bold, weight: 800 as const, style: 'normal' as const },
          { name: 'Inter', data: regular, weight: 500 as const, style: 'normal' as const },
        ],
      }))
      .catch((error: unknown) => {
        ogAssetsPromise = undefined;
        throw error;
      });
  }
  return ogAssetsPromise;
}

export interface OGImageProps {
  title: string;
  description?: string;
  showLogo?: boolean;
}

export function pngResponse(png: Uint8Array): Response {
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, must-revalidate',
      'CDN-Cache-Control': 'public, max-age=86400',
      'Surrogate-Control': 'public, max-age=86400',
    },
  });
}

export async function generateOGImage({
  title,
  description,
  showLogo = true,
}: OGImageProps): Promise<Buffer> {
  const { fonts, logo: logoDataUrl } = await loadOGAssets();
  // Create the markup using React
  const markup = (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: ogColors.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background with gradient */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          right: '-20%',
          bottom: '-20%',
          background: `radial-gradient(circle at top left, rgba(255, 182, 255, 0.3), transparent 40%),
                      radial-gradient(circle at bottom right, rgba(123, 180, 255, 0.3), transparent 40%)`,
          transform: 'rotate(-12deg)',
          opacity: 0.8,
        }}
      />

      {/* Decorative border */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '24px',
          border: '1px solid rgba(96, 115, 159, 0.2)',
          borderRadius: '12px',
        }}
      />

      {showLogo && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img src={logoDataUrl} width={40} height={40} />
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              fontFamily: 'Inter',
              fontWeight: 500,
              color: ogColors.mutedForeground,
            }}
          >
            {site.url.replace('http://', '').replace('https://', '')}
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '900px',
          padding: '0 64px',
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 800,
            fontFamily: 'Inter',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: ogColors.primaryForeground,
          }}
        >
          {title}
        </h1>
        {description && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '32px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '2px',
                background: 'rgb(96, 115, 159)',
              }}
            />
            <p
              style={{
                fontSize: '32px',
                fontWeight: 500,
                fontFamily: 'Inter',
                color: 'rgb(96, 115, 159)',
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Convert the markup to an SVG using Satori.
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts,
  });

  // Convert the SVG to PNG using Sharp with noise effect
  const noiseBuffer = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15"/>
    </svg>
  `);

  return await sharp(Buffer.from(svg))
    .composite([
      {
        input: noiseBuffer,
        blend: 'overlay',
      },
    ])
    .png()
    .toBuffer();
}
