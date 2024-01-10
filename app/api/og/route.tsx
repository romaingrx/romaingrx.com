import { IconSVG } from '@/app/icon';
import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'hsl(287, 86%, 90%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '64',
            height: '64',
          }}
        >
          <IconSVG />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
