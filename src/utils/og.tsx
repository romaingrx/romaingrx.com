import satori from 'satori';
import sharp from 'sharp';
import { site } from '@/configs/site';
import { inlineTailwind } from './tailwind';

interface OGImageProps {
  title: string;
  description?: string;
  showLogo?: boolean;
}

export async function generateOGImage({
  title,
  description,
  showLogo = true,
}: OGImageProps): Promise<Buffer> {
  // Create the markup using React
  const markup = (
    <div
      className="bg-primary"
      style={{
        width: '100%',
        height: '100%',
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
          <img src={`${site.url}/favicon.png`} width={40} height={40} />
          <div
            className="bg-black/30"
            style={{
              width: '1px',
              height: '24px',
            }}
          />
          <span
            className="text-muted-foreground"
            style={{
              fontSize: '20px',
              fontFamily: 'Inter',
              fontWeight: 500,
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
          zIndex: 1,
        }}
      >
        <h1
          className="text-primary-foreground"
          style={{
            fontSize: '72px',
            fontWeight: 800,
            fontFamily: 'Inter',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
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

  // Convert the markup to an SVG using Satori
  const inlineMarkup = inlineTailwind(markup);
  console.log(inlineMarkup);
  const svg = await satori(inlineMarkup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: await fetch('https://api.fontsource.org/v1/fonts/inter/latin-800-normal.ttf').then(
          (res) => res.arrayBuffer()
        ),
        weight: 800,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: await fetch('https://api.fontsource.org/v1/fonts/inter/latin-500-normal.ttf').then(
          (res) => res.arrayBuffer()
        ),
        weight: 500,
        style: 'normal',
      },
    ],
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
