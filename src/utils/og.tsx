import satori from 'satori';
import sharp from 'sharp';

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
      style={{
        background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(30, 41, 59))',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        border: '20px solid rgb(55, 65, 81)',
      }}
    >
      {showLogo && (
        <img
          src="https://romaingrx.dev/favicon.svg"
          width={80}
          height={80}
          style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <h1
          style={{
            fontSize: '78px',
            fontWeight: 800,
            fontFamily: 'Inter',
            color: 'white',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: '45px',
              fontWeight: 500,
              fontFamily: 'Inter',
              color: 'rgb(156, 163, 175)',
              margin: '24px 0 0 0',
              lineHeight: 1.25,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );

  // Convert the markup to an SVG using Satori
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: await fetch('https://api.fontsource.org/v1/fonts/inter/latin-800-normal.ttf').then(
          res => res.arrayBuffer()
        ),
        weight: 800,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: await fetch('https://api.fontsource.org/v1/fonts/inter/latin-500-normal.ttf').then(
          res => res.arrayBuffer()
        ),
        weight: 500,
        style: 'normal',
      },
    ],
  });

  // Convert the SVG to PNG using Sharp
  return await sharp(Buffer.from(svg)).png().toBuffer();
}
