import { allArticles } from '@/.contentlayer/generated';
import { IconSVG } from '@/app/icon';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getFontasArrayBuffer } from '@/lib/fonts';

const Footer = () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '50px 100px',
    }}
  >
    <div
      style={{
        display: 'flex',
        width: '32',
        height: '32',
      }}
    >
      <IconSVG />
    </div>
    <span
      style={{
        fontSize: 20,
        color: 'white',
      }}
    >
      @romaingrx
    </span>
  </div>
);

const SVGBackground = () => (
  <div
    style={{
      display: 'flex',
      position: 'absolute',
      zIndex: -1,
      bottom: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      opacity: 0.01,
    }}
  >
    <svg
      style={{
        width: '100%',
        height: '100%',
      }}
      viewBox="0 0 100 50"
    >
      {Array.from({ length: 100 }).map((_, i) =>
        Array.from({ length: 50 }).map((_, j) => (
          <circle
            key={`${i}-${j}`}
            cx={j * 2}
            cy={i * 2}
            r={0.5 + Math.random() * 0.5}
            fill="white"
          />
        )),
      )}
    </svg>
  </div>
);

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const article = allArticles.find((article) => article.slug === slug);
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          fontSize: 40,
          color: 'black',
          width: '100%',
          height: '100%',
          padding: '50px 100px',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          textAlign: 'center',
          background: 'radial-gradient(at bottom left, #896ca7, #3b2c4a)',
        }}
      >
        {/* <SVGBackground /> */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1,
          }}
        >
          <Footer />
        </div>
        {article && (
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: '2em',
                textAlign: 'center',
                padding: '0 100px 5% 100px',
                textShadow: '2px 2px 4px #000000',
                letterSpacing: '0.05em',
                background: 'linear-gradient(to right, white, pink)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {article.title}
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 600,
      emoji: 'blobmoji',
      fonts: [
        {
          name: 'WorldWise',
          data: await getFontasArrayBuffer('WorldwiseSans.woff'),
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
}
